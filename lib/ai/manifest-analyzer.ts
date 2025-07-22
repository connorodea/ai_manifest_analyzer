"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { number } from "zod"

const ItemAnalysisSchema = z.object({
  cleanedTitle: z.string(),
  category: z.string(),
  brand: z.string().optional(),
  condition: z.string(),
  estimatedValue: z.number(),
  marketValue: z.number(),
  riskScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  reasoning: z.object({
    categorization: z.string(),
    valuation: z.string(),
    risk: z.string(),
  }),
})

const ManifestSummarySchema = z.object({
  totalItems: number(),
  totalEstimatedValue: z.number(),
  averageItemValue: z.number(),
  categoryBreakdown: z.record(z.number()),
  riskBreakdown: z.object({
    lowRisk: z.number(),
    mediumRisk: z.number(),
    highRisk: z.number(),
  }),
  insights: z.object({
    summary: z.string(),
    opportunities: z.array(z.string()),
    risks: z.array(z.string()),
    recommendations: z.array(z.string()),
    profitabilityScore: z.number().min(0).max(100),
    marketTrends: z.array(z.string()),
  }),
  aiConfidenceScore: z.number().min(0).max(1),
  processingTime: z.number(),
})

export type ItemAnalysis = z.infer<typeof ItemAnalysisSchema>
export type ManifestSummary = z.infer<typeof ManifestSummarySchema>

export interface ManifestItem {
  id: string
  description: string
  price: number
  quantity: number
  condition?: string
  category?: string
}

export interface ManifestAnalysisResult {
  manifestId: string
  manifestName: string
  items: (ManifestItem & { analysis: ItemAnalysis })[]
  summary: ManifestSummary
  createdAt: string
}

export async function analyzeManifestItem(item: ManifestItem): Promise<ItemAnalysis> {
  try {
    console.log(`🔍 Analyzing item: ${item.description.substring(0, 50)}...`)

    const analysis = await generateObject({
      model: openai("gpt-4o"),
      schema: ItemAnalysisSchema,
      prompt: `Analyze this liquidation item for resale potential:

Description: "${item.description}"
Listed Price: $${item.price}
Quantity: ${item.quantity}
Condition: ${item.condition || "Unknown"}

Provide:
1. A clean, marketable product title
2. Product category (Electronics, Clothing, Home, Toys, Sports, Beauty, Auto, Books, Other)
3. Brand name if identifiable
4. Actual condition assessment
5. Estimated liquidation value (realistic resale price)
6. Market high value (best case scenario)
7. Risk score (0-100, higher = riskier investment)
8. Confidence in analysis (0-1)
9. Detailed reasoning for each assessment

Consider factors like:
- Market demand for this type of product
- Condition impact on value
- Brand recognition and value
- Seasonal factors
- Competition and market saturation
- Liquidation market dynamics`,

      system: `You are an expert liquidation analyst with deep knowledge of resale markets, product valuation, and risk assessment. Provide realistic, conservative estimates that account for liquidation market conditions.`,
    })

    console.log(`✅ Analysis completed for item`)
    return analysis.object
  } catch (error) {
    console.error(`❌ Analysis failed for item:`, error)

    // Fallback analysis
    return {
      cleanedTitle: item.description.substring(0, 60),
      category: "Other",
      brand: undefined,
      condition: item.condition || "Unknown",
      estimatedValue: item.price * 0.3, // Conservative 30% of listed price
      marketValue: item.price * 0.5,
      riskScore: 50,
      confidence: 0.3,
      reasoning: {
        categorization: "Unable to analyze - using fallback categorization",
        valuation: "Conservative estimate based on 30% of listed price",
        risk: "Medium risk due to analysis failure",
      },
    }
  }
}

export async function analyzeManifest(items: ManifestItem[], manifestName: string): Promise<ManifestAnalysisResult> {
  const startTime = Date.now()
  console.log(`🚀 Starting manifest analysis for ${items.length} items...`)

  try {
    // Analyze items in batches to avoid rate limits
    const batchSize = 5
    const analyzedItems: (ManifestItem & { analysis: ItemAnalysis })[] = []

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      console.log(`📊 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`)

      const batchPromises = batch.map(async (item) => ({
        ...item,
        analysis: await analyzeManifestItem(item),
      }))

      const batchResults = await Promise.all(batchPromises)
      analyzedItems.push(...batchResults)

      // Small delay between batches
      if (i + batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Generate summary
    console.log(`📈 Generating manifest summary...`)
    const summary = await generateManifestSummary(analyzedItems)

    const processingTime = Date.now() - startTime
    const manifestId = `manifest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log(`✅ Manifest analysis completed in ${processingTime}ms`)

    return {
      manifestId,
      manifestName,
      items: analyzedItems,
      summary: {
        ...summary,
        processingTime,
      },
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`❌ Manifest analysis failed:`, error)
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function generateManifestSummary(
  items: (ManifestItem & { analysis: ItemAnalysis })[],
): Promise<Omit<ManifestSummary, "processingTime">> {
  try {
    // Calculate basic metrics
    const totalItems = items.length
    const totalEstimatedValue = items.reduce((sum, item) => sum + item.analysis.estimatedValue, 0)
    const averageItemValue = totalEstimatedValue / totalItems

    // Category breakdown
    const categoryBreakdown = items.reduce(
      (acc, item) => {
        const category = item.analysis.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Risk breakdown
    const riskBreakdown = items.reduce(
      (acc, item) => {
        const risk = item.analysis.riskScore
        if (risk <= 30) acc.lowRisk++
        else if (risk <= 70) acc.mediumRisk++
        else acc.highRisk++
        return acc
      },
      { lowRisk: 0, mediumRisk: 0, highRisk: 0 },
    )

    // Average confidence
    const aiConfidenceScore = items.reduce((sum, item) => sum + item.analysis.confidence, 0) / totalItems

    // Generate insights using AI
    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        summary: z.string(),
        opportunities: z.array(z.string()),
        risks: z.array(z.string()),
        recommendations: z.array(z.string()),
        profitabilityScore: z.number().min(0).max(100),
        marketTrends: z.array(z.string()),
      }),
      prompt: `Analyze this liquidation manifest summary and provide strategic insights:

Total Items: ${totalItems}
Total Estimated Value: $${totalEstimatedValue.toFixed(2)}
Average Item Value: $${averageItemValue.toFixed(2)}

Category Breakdown:
${Object.entries(categoryBreakdown)
  .map(([category, count]) => `- ${category}: ${count} items`)
  .join("\n")}

Risk Distribution:
- Low Risk: ${riskBreakdown.lowRisk} items
- Medium Risk: ${riskBreakdown.mediumRisk} items  
- High Risk: ${riskBreakdown.highRisk} items

Top Items by Value:
${items
  .sort((a, b) => b.analysis.estimatedValue - a.analysis.estimatedValue)
  .slice(0, 5)
  .map((item, i) => `${i + 1}. ${item.analysis.cleanedTitle} - $${item.analysis.estimatedValue.toFixed(2)}`)
  .join("\n")}

Provide:
1. Executive summary of the manifest
2. Key profit opportunities
3. Main risk factors to consider
4. Strategic recommendations for maximizing returns
5. Profitability score (0-100)
6. Current market trends affecting these categories`,

      system:
        "You are a liquidation business strategist. Provide actionable insights for maximizing profit from this manifest.",
    })

    return {
      totalItems,
      totalEstimatedValue,
      averageItemValue,
      categoryBreakdown,
      riskBreakdown,
      insights: insights.object,
      aiConfidenceScore,
    }
  } catch (error) {
    console.error("Error generating manifest summary:", error)

    // Fallback summary
    const totalItems = items.length
    const totalEstimatedValue = items.reduce((sum, item) => sum + item.analysis.estimatedValue, 0)

    return {
      totalItems,
      totalEstimatedValue,
      averageItemValue: totalEstimatedValue / totalItems,
      categoryBreakdown: { Other: totalItems },
      riskBreakdown: { lowRisk: 0, mediumRisk: totalItems, highRisk: 0 },
      insights: {
        summary: `Analysis of ${totalItems} items with estimated value of $${totalEstimatedValue.toFixed(2)}`,
        opportunities: ["Review individual items for high-value opportunities"],
        risks: ["Analysis incomplete - manual review recommended"],
        recommendations: ["Conduct detailed market research", "Verify item conditions"],
        profitabilityScore: 50,
        marketTrends: ["Market analysis unavailable"],
      },
      aiConfidenceScore: 0.5,
    }
  }
}
