"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { FixedManifestItem } from "@/lib/utils/fixed-manifest-parser"
import type { EnhancedManifestItem } from "@/lib/utils/enhanced-manifest-parser"

const SimpleItemAnalysisSchema = z.object({
  cleanedTitle: z.string(),
  category: z.string(),
  brand: z.string(),
  estimatedValue: z.number(),
  riskScore: z.number().min(1).max(100),
  marketDemand: z.enum(["Low", "Medium", "High"]),
  profitPotential: z.number(),
  confidence: z.number().min(0).max(1),
})

const SimpleManifestInsightsSchema = z.object({
  summary: z.string(),
  totalValue: z.number(),
  totalProfit: z.number(),
  averageMargin: z.number(),
  topCategories: z.array(z.string()),
  opportunities: z.array(z.string()),
  risks: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export interface SimpleAnalysisResult {
  id: string
  originalItem: FixedManifestItem | EnhancedManifestItem
  analysis: z.infer<typeof SimpleItemAnalysisSchema>
}

export interface SimpleManifestAnalysisResult {
  manifestId: string
  manifestName: string
  totalItems: number
  totalRetailValue: number
  totalEstimatedValue: number
  totalPotentialProfit: number
  processingTime: number
  analysisResults: SimpleAnalysisResult[]
  insights: z.infer<typeof SimpleManifestInsightsSchema>
  summary: {
    averageItemValue: number
    averageProfit: number
    expectedROI: number
    categoryBreakdown: Record<string, number>
    riskDistribution: { low: number; medium: number; high: number }
  }
}

export async function performSimpleItemAnalysis(
  item: FixedManifestItem | EnhancedManifestItem,
  itemIndex: number,
): Promise<SimpleAnalysisResult> {
  console.log(`🔍 Analyzing item ${itemIndex}: "${getItemProduct(item).substring(0, 50)}..."`)

  try {
    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)
    const quantity = getItemQuantity(item)
    const condition = getItemCondition(item)

    const analysis = await generateObject({
      model: openai("gpt-4o"),
      schema: SimpleItemAnalysisSchema,
      prompt: `Analyze this liquidation item:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}

Provide:
1. A clean, marketable product title
2. Product category (Electronics, Clothing, Home, Toys, Sports, Beauty, Auto, Books, Other)
3. Brand name (if identifiable)
4. Estimated liquidation value (typically 10-40% of retail)
5. Risk score (1-100, higher = riskier)
6. Market demand level
7. Profit potential estimate
8. Analysis confidence (0-1)

Be realistic and conservative in estimates.`,
      system:
        "You are a liquidation expert who analyzes products for resale potential. Provide practical, realistic assessments.",
    })

    console.log(`✅ Analysis completed for item ${itemIndex}`)

    return {
      id: `item-${itemIndex}`,
      originalItem: item,
      analysis: analysis.object,
    }
  } catch (error) {
    console.error(`❌ Analysis failed for item ${itemIndex}:`, error)

    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)

    // Fallback analysis
    return {
      id: `item-${itemIndex}`,
      originalItem: item,
      analysis: {
        cleanedTitle: product.substring(0, 60),
        category: "Other",
        brand: "Unknown",
        estimatedValue: retailPrice * 0.2, // 20% of retail
        riskScore: 50,
        marketDemand: "Medium" as const,
        profitPotential: retailPrice * 0.1, // 10% profit
        confidence: 0.5,
      },
    }
  }
}

export async function analyzeSimpleManifest(
  items: (FixedManifestItem | EnhancedManifestItem)[],
  manifestName: string,
): Promise<SimpleManifestAnalysisResult> {
  const startTime = Date.now()
  console.log(`🚀 Starting simple analysis for ${items.length} items...`)

  try {
    // Limit to first 20 items for demo
    const itemsToAnalyze = items.slice(0, Math.min(20, items.length))
    console.log(`📊 Analyzing ${itemsToAnalyze.length} items...`)

    // Process items in small batches
    const batchSize = 3
    const analysisResults: SimpleAnalysisResult[] = []

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      console.log(
        `🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(itemsToAnalyze.length / batchSize)}`,
      )

      const batchPromises = batch.map((item, batchIndex) => performSimpleItemAnalysis(item, i + batchIndex + 1))

      const batchResults = await Promise.all(batchPromises)
      analysisResults.push(...batchResults)

      // Small delay between batches
      if (i + batchSize < itemsToAnalyze.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Calculate totals
    const totalRetailValue = analysisResults.reduce((sum, result) => {
      const item = result.originalItem
      return sum + getItemTotalRetailPrice(item)
    }, 0)

    const totalEstimatedValue = analysisResults.reduce((sum, result) => sum + result.analysis.estimatedValue, 0)
    const totalPotentialProfit = analysisResults.reduce((sum, result) => sum + result.analysis.profitPotential, 0)

    // Generate insights
    console.log(`🧠 Generating insights...`)
    const insights = await generateManifestInsights(
      analysisResults,
      totalRetailValue,
      totalEstimatedValue,
      totalPotentialProfit,
    )

    // Calculate summary stats
    const categoryBreakdown = analysisResults.reduce(
      (acc, result) => {
        const category = result.analysis.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const riskDistribution = analysisResults.reduce(
      (acc, result) => {
        const risk = result.analysis.riskScore
        if (risk <= 30) acc.low++
        else if (risk <= 70) acc.medium++
        else acc.high++
        return acc
      },
      { low: 0, medium: 0, high: 0 },
    )

    const processingTime = Date.now() - startTime
    const manifestId = `manifest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ Analysis completed in ${processingTime}ms`)
    console.log(`💰 Total Retail: $${totalRetailValue.toFixed(2)}`)
    console.log(`📈 Total Estimated: $${totalEstimatedValue.toFixed(2)}`)
    console.log(`🎯 Total Profit: $${totalPotentialProfit.toFixed(2)}`)

    return {
      manifestId,
      manifestName,
      totalItems: analysisResults.length,
      totalRetailValue,
      totalEstimatedValue,
      totalPotentialProfit,
      processingTime,
      analysisResults,
      insights,
      summary: {
        averageItemValue: totalEstimatedValue / analysisResults.length,
        averageProfit: totalPotentialProfit / analysisResults.length,
        expectedROI: (totalPotentialProfit / totalEstimatedValue) * 100,
        categoryBreakdown,
        riskDistribution,
      },
    }
  } catch (error) {
    console.error("❌ Simple analysis failed:", error)
    throw error
  }
}

// Alias for backward compatibility
export const analyzeManifestWithAI = analyzeSimpleManifest

async function generateManifestInsights(
  results: SimpleAnalysisResult[],
  totalRetail: number,
  totalEstimated: number,
  totalProfit: number,
): Promise<z.infer<typeof SimpleManifestInsightsSchema>> {
  try {
    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: SimpleManifestInsightsSchema,
      prompt: `Analyze this liquidation manifest:

Total Items: ${results.length}
Total Retail Value: $${totalRetail.toFixed(2)}
Total Estimated Value: $${totalEstimated.toFixed(2)}
Total Potential Profit: $${totalProfit.toFixed(2)}
Expected ROI: ${((totalProfit / totalEstimated) * 100).toFixed(1)}%

Top Items:
${results
  .slice(0, 5)
  .map((r, i) => `${i + 1}. ${r.analysis.cleanedTitle} - $${r.analysis.estimatedValue} (${r.analysis.category})`)
  .join("\n")}

Provide strategic insights including:
- Executive summary
- Total value assessment
- Profit potential
- Average margin
- Top categories
- Key opportunities
- Main risks
- Actionable recommendations`,
      system: "You are a liquidation business analyst. Provide practical insights for resellers.",
    })

    return insights.object
  } catch (error) {
    console.error("Error generating insights:", error)
    return {
      summary: `Analysis of ${results.length} items with total retail value of $${totalRetail.toFixed(2)}`,
      totalValue: totalEstimated,
      totalProfit: totalProfit,
      averageMargin: (totalProfit / totalEstimated) * 100,
      topCategories: ["Electronics", "Home Goods"],
      opportunities: ["Focus on high-value items", "Quick turnaround potential"],
      risks: ["Market saturation", "Condition verification needed"],
      recommendations: ["Start with low-risk items", "Research market prices"],
    }
  }
}

// Helper functions to handle different item types
function getItemProduct(item: FixedManifestItem | EnhancedManifestItem): string {
  return "product" in item ? item.product : "description" in item ? item.description : ""
}

function getItemRetailPrice(item: FixedManifestItem | EnhancedManifestItem): number {
  return "retailPrice" in item ? item.retailPrice : "price" in item ? item.price : 0
}

function getItemQuantity(item: FixedManifestItem | EnhancedManifestItem): number {
  return item.quantity || 1
}

function getItemCondition(item: FixedManifestItem | EnhancedManifestItem): string {
  return item.condition || "Unknown"
}

function getItemTotalRetailPrice(item: FixedManifestItem | EnhancedManifestItem): number {
  if ("totalRetailPrice" in item) {
    return item.totalRetailPrice
  }
  return getItemRetailPrice(item) * getItemQuantity(item)
}
