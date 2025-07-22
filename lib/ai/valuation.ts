"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const ValuationSchema = z.object({
  estimatedValue: z.number(),
  marketHigh: z.number(),
  marketLow: z.number(),
  confidence: z.number().min(0).max(1),
  factors: z.array(z.string()),
  comparables: z.array(
    z.object({
      source: z.string(),
      price: z.number(),
      condition: z.string(),
    }),
  ),
  reasoning: z.string(),
})

export type ValuationResult = z.infer<typeof ValuationSchema>

export async function valuateItem(
  description: string,
  condition: string,
  category: string,
  brand?: string,
): Promise<ValuationResult> {
  try {
    console.log(`💰 Valuating item: ${description.substring(0, 50)}...`)

    const valuation = await generateObject({
      model: openai("gpt-4o"),
      schema: ValuationSchema,
      prompt: `Provide a detailed valuation for this liquidation item:

Product: "${description}"
Category: ${category}
Brand: ${brand || "Unknown"}
Condition: ${condition}

Research and provide:
1. Realistic estimated liquidation value (what it would sell for in liquidation market)
2. Market high value (best case scenario, excellent condition, ideal buyer)
3. Market low value (worst case scenario, poor condition, quick sale)
4. Confidence level in this valuation (0-1)
5. Key factors affecting the valuation
6. Comparable sales data (if available)
7. Detailed reasoning for the valuation

Consider:
- Current market demand for this product type
- Brand value and recognition
- Condition impact on price
- Seasonal factors
- Competition in the liquidation market
- Typical liquidation discounts (usually 20-60% off retail)
- Resale platform fees and costs`,

      system: `You are a professional appraiser specializing in liquidation and resale markets. Provide realistic, conservative valuations based on actual market conditions. Consider that liquidation items typically sell for 20-60% below retail prices.`,
    })

    console.log(`✅ Valuation completed`)
    return valuation.object
  } catch (error) {
    console.error(`❌ Valuation failed:`, error)

    // Fallback valuation
    return {
      estimatedValue: 25, // Conservative fallback
      marketHigh: 50,
      marketLow: 10,
      confidence: 0.3,
      factors: ["Analysis failed - using conservative estimates"],
      comparables: [],
      reasoning: "Unable to complete detailed valuation analysis. Using conservative fallback estimates.",
    }
  }
}

export async function batchValuateItems(
  items: Array<{
    description: string
    condition: string
    category: string
    brand?: string
  }>,
): Promise<ValuationResult[]> {
  console.log(`💰 Starting batch valuation for ${items.length} items...`)

  const results: ValuationResult[] = []
  const batchSize = 3

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    console.log(`📊 Processing valuation batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`)

    const batchPromises = batch.map((item) => valuateItem(item.description, item.condition, item.category, item.brand))

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Small delay between batches
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.log(`✅ Batch valuation completed`)
  return results
}

export async function getMarketTrends(category: string): Promise<{
  trend: "rising" | "stable" | "declining"
  confidence: number
  factors: string[]
  seasonality: string
}> {
  try {
    console.log(`📈 Analyzing market trends for ${category}...`)

    const trends = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        trend: z.enum(["rising", "stable", "declining"]),
        confidence: z.number().min(0).max(1),
        factors: z.array(z.string()),
        seasonality: z.string(),
      }),
      prompt: `Analyze current market trends for the ${category} category in the liquidation/resale market:

Provide:
1. Overall trend direction (rising, stable, or declining)
2. Confidence level in this assessment (0-1)
3. Key factors driving the trend
4. Seasonality information and timing considerations

Consider:
- Current consumer demand
- Economic factors
- Seasonal patterns
- Competition levels
- Platform changes (eBay, Amazon, etc.)
- Supply chain impacts
- Recent market shifts`,

      system:
        "You are a market analyst specializing in liquidation and resale markets. Provide current, accurate trend analysis.",
    })

    console.log(`✅ Market trend analysis completed`)
    return trends.object
  } catch (error) {
    console.error(`❌ Market trend analysis failed:`, error)

    return {
      trend: "stable" as const,
      confidence: 0.5,
      factors: ["Analysis unavailable"],
      seasonality: "No seasonal data available",
    }
  }
}
