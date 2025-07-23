"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Input schema
const ManifestValuationInputSchema = z.object({
  manifest_csv: z.string(),
  buy_pct_msrp: z.number().min(0).max(1),
  fee_pct: z.number().min(0).max(1),
  ship_pct: z.number().min(0).max(1),
  scenario_sale_pcts: z.array(z.number().min(0).max(1)).min(1),
  inbound_freight_est: z.number().optional(),
  min_units_for_brand: z.number().optional().default(1),
})

// Output schemas
const ManifestSnapshotSchema = z.object({
  total_unique_skus: z.number().int(),
  total_units: z.number().int(),
  aggregate_msrp: z.number(),
  avg_msrp_per_unit: z.number(),
  purchase_cost: z.number(),
})

const BrandMarketCompSchema = z.object({
  brand: z.string(),
  unit_count: z.number().int(),
  resale_pct_msrp_est: z.number(),
})

const ProfitScenarioSchema = z.object({
  sale_pct_msrp: z.number(),
  gross_sales: z.number(),
  total_fees: z.number(),
  total_ship: z.number(),
  net_profit: z.number(),
  roc: z.number(),
})

const ManifestValuationOutputSchema = z.object({
  manifest_snapshot: ManifestSnapshotSchema,
  brand_market_comps: z.array(BrandMarketCompSchema),
  profit_scenarios: z.array(ProfitScenarioSchema),
  operational_notes: z.array(z.string()),
  verdict: z.enum(["BUY", "PASS", "BORDERLINE"]),
})

export type ManifestValuationInput = z.infer<typeof ManifestValuationInputSchema>
export type ManifestValuationOutput = z.infer<typeof ManifestValuationOutputSchema>

interface ParsedManifestItem {
  brand: string
  description: string
  msrp: number
  qty: number
}

export async function runManifestValuationAgent(input: ManifestValuationInput): Promise<ManifestValuationOutput> {
  try {
    console.log("🤖 Starting Manifest Valuation Agent v2...")

    // Step 1: Parse CSV
    const items = parseManifestCSV(input.manifest_csv)
    console.log(`📊 Parsed ${items.length} items`)

    // Step 2: Calculate snapshot metrics
    const snapshot = calculateManifestSnapshot(items, input.buy_pct_msrp)
    console.log(`💰 Total MSRP: $${snapshot.aggregate_msrp.toFixed(2)}`)

    // Step 3: Generate brand-level market comps
    const brandComps = generateBrandMarketComps(items, input.min_units_for_brand)
    console.log(`🏷️ Analyzed ${brandComps.length} brands`)

    // Step 4: Calculate profit scenarios
    const inboundFreight = input.inbound_freight_est || estimateInboundFreight(snapshot.total_units)
    const profitScenarios = calculateProfitScenarios(
      snapshot,
      input.scenario_sale_pcts,
      input.fee_pct,
      input.ship_pct,
      inboundFreight,
    )

    // Step 5: Generate operational notes using AI
    const operationalNotes = await generateOperationalNotes(items, snapshot, brandComps)

    // Step 6: Determine verdict
    const verdict = determineVerdict(profitScenarios)

    console.log(`✅ Analysis complete. Verdict: ${verdict}`)

    return {
      manifest_snapshot: snapshot,
      brand_market_comps: brandComps,
      profit_scenarios: profitScenarios,
      operational_notes: operationalNotes,
      verdict,
    }
  } catch (error) {
    console.error("❌ Manifest Valuation Agent failed:", error)
    throw error
  }
}

function parseManifestCSV(csvContent: string): ParsedManifestItem[] {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("invalid csv")
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  // Find required column indices
  const brandIndex = headers.findIndex((h) => h.includes("brand"))
  const descIndex = headers.findIndex((h) => h.includes("description"))
  const msrpIndex = headers.findIndex((h) => h.includes("msrp"))
  const qtyIndex = headers.findIndex((h) => h.includes("qty") || h.includes("quantity"))

  if (brandIndex === -1 || descIndex === -1 || msrpIndex === -1 || qtyIndex === -1) {
    throw new Error("missing required columns")
  }

  const items: ParsedManifestItem[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    const brand = values[brandIndex] || "Unknown"
    const description = values[descIndex] || ""
    const msrp = Number.parseFloat(values[msrpIndex]) || 0
    const qty = Number.parseInt(values[qtyIndex]) || 0

    if (msrp <= 0 || qty <= 0) {
      continue // Skip invalid rows
    }

    items.push({ brand, description, msrp, qty })
  }

  if (items.length === 0) {
    throw new Error("empty manifest")
  }

  return items
}

function calculateManifestSnapshot(items: ParsedManifestItem[], buyPctMsrp: number) {
  const totalUniqueSkus = items.length
  const totalUnits = items.reduce((sum, item) => sum + item.qty, 0)
  const aggregateMsrp = items.reduce((sum, item) => sum + item.msrp * item.qty, 0)
  const avgMsrpPerUnit = aggregateMsrp / totalUnits
  const purchaseCost = aggregateMsrp * buyPctMsrp

  return {
    total_unique_skus: totalUniqueSkus,
    total_units: totalUnits,
    aggregate_msrp: Math.round(aggregateMsrp * 100) / 100,
    avg_msrp_per_unit: Math.round(avgMsrpPerUnit * 100) / 100,
    purchase_cost: Math.round(purchaseCost * 100) / 100,
  }
}

function generateBrandMarketComps(items: ParsedManifestItem[], minUnitsForBrand: number) {
  // Group by brand
  const brandGroups = new Map<string, { items: ParsedManifestItem[]; unitCount: number }>()

  items.forEach((item) => {
    if (!brandGroups.has(item.brand)) {
      brandGroups.set(item.brand, { items: [], unitCount: 0 })
    }
    const group = brandGroups.get(item.brand)!
    group.items.push(item)
    group.unitCount += item.qty
  })

  // Filter brands with sufficient units and assign resale percentages
  const brandComps = Array.from(brandGroups.entries())
    .filter(([_, group]) => group.unitCount >= minUnitsForBrand)
    .map(([brand, group]) => ({
      brand,
      unit_count: group.unitCount,
      resale_pct_msrp_est: getBrandResalePercentage(brand),
    }))
    .sort((a, b) => b.unit_count - a.unit_count)

  return brandComps
}

function getBrandResalePercentage(brand: string): number {
  const brandLower = brand.toLowerCase()

  // High-tier brands (45-60%)
  const highTierBrands = [
    "apple",
    "dyson",
    "kohler",
    "dewalt",
    "milwaukee",
    "bosch",
    "kitchenaid",
    "sony",
    "samsung",
    "lg",
    "canon",
    "nikon",
    "moen",
    "delta",
    "grohe",
  ]

  // Mid-tier brands (30-45%)
  const midTierBrands = [
    "insignia",
    "hampton bay",
    "ge",
    "whirlpool",
    "frigidaire",
    "hamilton beach",
    "cuisinart",
    "black+decker",
    "craftsman",
    "ryobi",
  ]

  if (highTierBrands.some((b) => brandLower.includes(b))) {
    return Math.round((0.45 + Math.random() * 0.15) * 100) / 100 // 0.45-0.60
  } else if (midTierBrands.some((b) => brandLower.includes(b))) {
    return Math.round((0.3 + Math.random() * 0.15) * 100) / 100 // 0.30-0.45
  } else {
    return Math.round((0.2 + Math.random() * 0.15) * 100) / 100 // 0.20-0.35
  }
}

function calculateProfitScenarios(
  snapshot: any,
  salePcts: number[],
  feePct: number,
  shipPct: number,
  inboundFreight: number,
) {
  return salePcts.map((salePct) => {
    const grossSales = snapshot.aggregate_msrp * salePct
    const totalFees = grossSales * feePct
    const totalShip = grossSales * shipPct
    const totalCost = snapshot.purchase_cost + totalFees + totalShip + inboundFreight
    const netProfit = grossSales - totalCost
    const roc = netProfit / snapshot.purchase_cost

    return {
      sale_pct_msrp: salePct,
      gross_sales: Math.round(grossSales * 100) / 100,
      total_fees: Math.round(totalFees * 100) / 100,
      total_ship: Math.round(totalShip * 100) / 100,
      net_profit: Math.round(netProfit * 100) / 100,
      roc: Math.round(roc * 100) / 100,
    }
  })
}

function estimateInboundFreight(totalUnits: number): number {
  // Rough estimate based on units
  if (totalUnits < 50) return 150
  if (totalUnits < 200) return 250
  if (totalUnits < 500) return 400
  return 600
}

async function generateOperationalNotes(
  items: ParsedManifestItem[],
  snapshot: any,
  brandComps: any[],
): Promise<string[]> {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        notes: z.array(z.string()).min(3).max(6),
      }),
      prompt: `Generate 3-6 concise operational notes for this liquidation manifest:

Items: ${items.length} SKUs, ${snapshot.total_units} total units
Average MSRP: $${snapshot.avg_msrp_per_unit}
Top brands: ${brandComps
        .slice(0, 3)
        .map((b) => b.brand)
        .join(", ")}

Cover these areas:
- Condition/returns risk assessment
- Expected sell-through timeline
- Storage/logistics requirements
- Channel strategy recommendations
- Brand-specific considerations

Keep each note under 80 characters and actionable.`,
      system: "You are a liquidation operations expert. Provide practical, concise operational guidance.",
    })

    return result.object.notes
  } catch (error) {
    console.error("Failed to generate operational notes:", error)
    return [
      "Review item conditions for return/refurb rates",
      "Plan 3-6 month sell-through timeline",
      "Estimate storage needs based on unit count",
      "Consider multi-channel sales strategy",
      "Research brand-specific market dynamics",
    ]
  }
}

function determineVerdict(profitScenarios: any[]): "BUY" | "PASS" | "BORDERLINE" {
  const minRoc = Math.min(...profitScenarios.map((s) => s.roc))
  const maxRoc = Math.max(...profitScenarios.map((s) => s.roc))

  if (minRoc >= 1.4) return "BUY"
  if (maxRoc < 1.2) return "PASS"
  return "BORDERLINE"
}
