"use server"

import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { FixedManifestItem } from "@/lib/utils/fixed-manifest-parser"
import type { EnhancedManifestItem } from "@/lib/utils/enhanced-manifest-parser"

const ThinkingProcessSchema = z.object({
  initialObservation: z.string(),
  categoryAnalysis: z.string(),
  marketResearch: z.string(),
  valuationReasoning: z.string(),
  riskAssessment: z.string(),
  finalConclusion: z.string(),
})

const DeepItemAnalysisSchema = z.object({
  cleanedTitle: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  brand: z.string(),
  model: z.string().optional(),
  estimatedValue: z.number(),
  marketValue: z.number(),
  liquidationValue: z.number(),
  riskScore: z.number().min(1).max(100),
  marketDemand: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  profitPotential: z.number(),
  confidence: z.number().min(0).max(1),
  competitorPricing: z.object({
    low: z.number(),
    average: z.number(),
    high: z.number(),
  }),
  marketTrends: z.object({
    trend: z.enum(["Declining", "Stable", "Growing", "Booming"]),
    seasonality: z.string(),
    demandFactors: z.array(z.string()),
  }),
  resaleStrategy: z.object({
    recommendedPlatform: z.array(z.string()),
    pricingStrategy: z.string(),
    timingAdvice: z.string(),
  }),
})

const ComprehensiveManifestInsightsSchema = z.object({
  executiveSummary: z.string(),
  marketAnalysis: z.object({
    overallMarketCondition: z.enum(["Poor", "Fair", "Good", "Excellent"]),
    topPerformingCategories: z.array(z.string()),
    marketOpportunities: z.array(z.string()),
    competitiveLandscape: z.string(),
  }),
  financialProjections: z.object({
    totalInvestment: z.number(),
    projectedRevenue: z.number(),
    estimatedProfit: z.number(),
    expectedROI: z.number(),
    breakEvenTimeframe: z.string(),
    cashFlowProjection: z.array(
      z.object({
        month: z.number(),
        revenue: z.number(),
        profit: z.number(),
      }),
    ),
  }),
  strategicRecommendations: z.object({
    immediate: z.array(z.string()),
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string()),
  }),
  riskAnalysis: z.object({
    majorRisks: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
    contingencyPlans: z.array(z.string()),
  }),
  operationalInsights: z.object({
    inventoryManagement: z.array(z.string()),
    logisticsConsiderations: z.array(z.string()),
    qualityControl: z.array(z.string()),
  }),
})

export interface EnhancedAnalysisResult {
  id: string
  originalItem: FixedManifestItem | EnhancedManifestItem
  analysis: z.infer<typeof DeepItemAnalysisSchema>
  thinkingProcess: z.infer<typeof ThinkingProcessSchema>
  processingTime: number
}

export interface ComprehensiveManifestAnalysisResult {
  manifestId: string
  manifestName: string
  totalItems: number
  analyzedItems: number
  totalRetailValue: number
  totalEstimatedValue: number
  totalPotentialProfit: number
  processingTime: number
  analysisResults: EnhancedAnalysisResult[]
  insights: z.infer<typeof ComprehensiveManifestInsightsSchema>
  thinkingProcess: {
    overallStrategy: string
    marketResearchFindings: string[]
    valuationMethodology: string
    riskAssessmentApproach: string
    recommendationRationale: string
  }
  summary: {
    averageItemValue: number
    averageProfit: number
    expectedROI: number
    categoryBreakdown: Record<string, number>
    riskDistribution: { veryLow: number; low: number; medium: number; high: number; veryHigh: number }
    confidenceScore: number
  }
}

export async function performDeepItemAnalysis(
  item: FixedManifestItem | EnhancedManifestItem,
  itemIndex: number,
  marketContext = "",
): Promise<EnhancedAnalysisResult> {
  const startTime = Date.now()
  console.log(`🔍 Starting deep analysis for item ${itemIndex}: "${getItemProduct(item).substring(0, 50)}..."`)

  try {
    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)
    const quantity = getItemQuantity(item)
    const condition = getItemCondition(item)

    // First, generate the thinking process
    console.log(`🧠 Generating thinking process for item ${itemIndex}...`)
    const thinkingResult = await generateObject({
      model: openai("gpt-4o"),
      schema: ThinkingProcessSchema,
      prompt: `You are analyzing this liquidation item for resale potential. Think through your analysis step by step:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}
Market Context: ${marketContext}

Walk through your thinking process:
1. Initial observation - What do you notice about this item?
2. Category analysis - How do you categorize this and why?
3. Market research - What do you know about this market segment?
4. Valuation reasoning - How do you determine its value?
5. Risk assessment - What risks do you see?
6. Final conclusion - What's your overall assessment?

Be detailed and explain your reasoning at each step.`,
      system: "You are an expert liquidation analyst. Show your complete thought process as you analyze each item.",
    })

    // Then perform the detailed analysis
    console.log(`📊 Performing detailed analysis for item ${itemIndex}...`)
    const analysis = await generateObject({
      model: openai("gpt-4o"),
      schema: DeepItemAnalysisSchema,
      prompt: `Based on your thinking process, now provide a comprehensive analysis of this liquidation item:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}

Your thinking process:
- Initial observation: ${thinkingResult.object.initialObservation}
- Category analysis: ${thinkingResult.object.categoryAnalysis}
- Market research: ${thinkingResult.object.marketResearch}
- Valuation reasoning: ${thinkingResult.object.valuationReasoning}
- Risk assessment: ${thinkingResult.object.riskAssessment}

Provide detailed analysis including:
1. Clean product title and categorization
2. Brand and model identification
3. Multiple valuation estimates (market, liquidation)
4. Comprehensive risk scoring
5. Market demand assessment
6. Competitor pricing research
7. Market trend analysis
8. Specific resale strategy recommendations

Be thorough and data-driven in your analysis.`,
      system: "You are a liquidation expert with deep market knowledge. Provide comprehensive, actionable analysis.",
    })

    const processingTime = Date.now() - startTime
    console.log(`✅ Deep analysis completed for item ${itemIndex} in ${processingTime}ms`)

    return {
      id: `enhanced-item-${itemIndex}`,
      originalItem: item,
      analysis: analysis.object,
      thinkingProcess: thinkingResult.object,
      processingTime,
    }
  } catch (error) {
    console.error(`❌ Deep analysis failed for item ${itemIndex}:`, error)

    const processingTime = Date.now() - startTime
    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)

    // Fallback analysis with thinking process
    return {
      id: `enhanced-item-${itemIndex}`,
      originalItem: item,
      analysis: {
        cleanedTitle: product.substring(0, 60),
        category: "Other",
        brand: "Unknown",
        estimatedValue: retailPrice * 0.25,
        marketValue: retailPrice * 0.4,
        liquidationValue: retailPrice * 0.15,
        riskScore: 60,
        marketDemand: "Medium" as const,
        profitPotential: retailPrice * 0.1,
        confidence: 0.3,
        competitorPricing: {
          low: retailPrice * 0.1,
          average: retailPrice * 0.25,
          high: retailPrice * 0.4,
        },
        marketTrends: {
          trend: "Stable" as const,
          seasonality: "No clear seasonal pattern",
          demandFactors: ["General market conditions"],
        },
        resaleStrategy: {
          recommendedPlatform: ["eBay", "Facebook Marketplace"],
          pricingStrategy: "Start at market average, adjust based on response",
          timingAdvice: "List immediately to test market response",
        },
      },
      thinkingProcess: {
        initialObservation: "Analysis failed, using fallback assessment",
        categoryAnalysis: "Unable to perform detailed categorization",
        marketResearch: "Market research unavailable",
        valuationReasoning: "Using conservative 25% of retail value",
        riskAssessment: "Medium risk due to limited analysis",
        finalConclusion: "Requires manual review for accurate assessment",
      },
      processingTime,
    }
  }
}

export async function analyzeComprehensiveManifest(
  items: (FixedManifestItem | EnhancedManifestItem)[],
  manifestName: string,
): Promise<ComprehensiveManifestAnalysisResult> {
  const startTime = Date.now()
  console.log(`🚀 Starting comprehensive analysis for ${items.length} items...`)

  try {
    // Generate market context first
    console.log(`🌐 Generating market context...`)
    const marketContext = await generateMarketContext(items)

    // Limit analysis to manageable number for demo
    const itemsToAnalyze = items.slice(0, Math.min(15, items.length))
    console.log(`📊 Analyzing ${itemsToAnalyze.length} items with market context...`)

    // Process items in small batches with thinking process
    const batchSize = 2 // Smaller batches for detailed analysis
    const analysisResults: EnhancedAnalysisResult[] = []

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(itemsToAnalyze.length / batchSize)

      console.log(`🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)`)

      const batchPromises = batch.map((item, batchIndex) =>
        performDeepItemAnalysis(item, i + batchIndex + 1, marketContext),
      )

      const batchResults = await Promise.all(batchPromises)
      analysisResults.push(...batchResults)

      // Progress update
      console.log(`📈 Progress: ${analysisResults.length}/${itemsToAnalyze.length} items analyzed`)

      // Delay between batches to avoid rate limits
      if (i + batchSize < itemsToAnalyze.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Calculate comprehensive totals
    const totalRetailValue = analysisResults.reduce((sum, result) => {
      const item = result.originalItem
      return sum + getItemTotalRetailPrice(item)
    }, 0)

    const totalEstimatedValue = analysisResults.reduce((sum, result) => sum + result.analysis.estimatedValue, 0)
    const totalPotentialProfit = analysisResults.reduce((sum, result) => sum + result.analysis.profitPotential, 0)

    // Generate comprehensive insights with thinking process
    console.log(`🧠 Generating comprehensive insights with AI thinking process...`)
    const { insights, thinkingProcess } = await generateComprehensiveInsights(
      analysisResults,
      totalRetailValue,
      totalEstimatedValue,
      totalPotentialProfit,
      marketContext,
    )

    // Calculate detailed summary stats
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
        if (risk <= 20) acc.veryLow++
        else if (risk <= 40) acc.low++
        else if (risk <= 60) acc.medium++
        else if (risk <= 80) acc.high++
        else acc.veryHigh++
        return acc
      },
      { veryLow: 0, low: 0, medium: 0, high: 0, veryHigh: 0 },
    )

    const averageConfidence =
      analysisResults.reduce((sum, result) => sum + result.analysis.confidence, 0) / analysisResults.length

    const processingTime = Date.now() - startTime
    const manifestId = `comprehensive-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ Comprehensive analysis completed in ${(processingTime / 1000).toFixed(1)}s`)
    console.log(`💰 Total Retail: $${totalRetailValue.toFixed(2)}`)
    console.log(`📈 Total Estimated: $${totalEstimatedValue.toFixed(2)}`)
    console.log(`🎯 Total Profit: $${totalPotentialProfit.toFixed(2)}`)
    console.log(`🎲 Average Confidence: ${(averageConfidence * 100).toFixed(1)}%`)

    return {
      manifestId,
      manifestName,
      totalItems: items.length,
      analyzedItems: analysisResults.length,
      totalRetailValue,
      totalEstimatedValue,
      totalPotentialProfit,
      processingTime,
      analysisResults,
      insights,
      thinkingProcess,
      summary: {
        averageItemValue: totalEstimatedValue / analysisResults.length,
        averageProfit: totalPotentialProfit / analysisResults.length,
        expectedROI: (totalPotentialProfit / totalEstimatedValue) * 100,
        categoryBreakdown,
        riskDistribution,
        confidenceScore: averageConfidence,
      },
    }
  } catch (error) {
    console.error("❌ Comprehensive analysis failed:", error)
    throw error
  }
}

async function generateMarketContext(items: (FixedManifestItem | EnhancedManifestItem)[]): Promise<string> {
  try {
    const sampleProducts = items
      .slice(0, 5)
      .map((item) => getItemProduct(item))
      .join(", ")

    const contextResult = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze these sample products from a liquidation manifest and provide market context:

Sample products: ${sampleProducts}

Provide a brief market context covering:
1. Current market conditions for these product categories
2. Seasonal factors affecting demand
3. Economic factors influencing liquidation markets
4. Key trends in resale markets

Keep it concise but informative for analysis context.`,
      system: "You are a market research analyst specializing in liquidation and resale markets.",
    })

    return contextResult.text
  } catch (error) {
    console.error("Error generating market context:", error)
    return "General market conditions apply. Consider seasonal demand patterns and current economic factors."
  }
}

async function generateComprehensiveInsights(
  results: EnhancedAnalysisResult[],
  totalRetail: number,
  totalEstimated: number,
  totalProfit: number,
  marketContext: string,
): Promise<{
  insights: z.infer<typeof ComprehensiveManifestInsightsSchema>
  thinkingProcess: ComprehensiveManifestAnalysisResult["thinkingProcess"]
}> {
  try {
    // Generate thinking process first
    const thinkingResult = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are analyzing a liquidation manifest. Walk through your strategic thinking process:

Manifest Overview:
- Total Items Analyzed: ${results.length}
- Total Retail Value: $${totalRetail.toFixed(2)}
- Total Estimated Value: $${totalEstimated.toFixed(2)}
- Total Potential Profit: $${totalProfit.toFixed(2)}
- Expected ROI: ${((totalProfit / totalEstimated) * 100).toFixed(1)}%

Market Context: ${marketContext}

Top Categories: ${Object.entries(
        results.reduce(
          (acc, r) => {
            acc[r.analysis.category] = (acc[r.analysis.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, count]) => `${cat} (${count})`)
        .join(", ")}

Explain your strategic thinking process:
1. Overall strategy for this manifest
2. Key market research findings that influence your recommendations
3. Valuation methodology you're using
4. Risk assessment approach
5. Rationale behind your recommendations

Be detailed and show your reasoning.`,
      system: "You are a senior liquidation strategist. Show your complete strategic thinking process.",
    })

    // Generate comprehensive insights
    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ComprehensiveManifestInsightsSchema,
      prompt: `Based on your strategic analysis, provide comprehensive insights for this liquidation manifest:

Analysis Data:
- Items: ${results.length}
- Retail Value: $${totalRetail.toFixed(2)}
- Estimated Value: $${totalEstimated.toFixed(2)}
- Potential Profit: $${totalProfit.toFixed(2)}
- ROI: ${((totalProfit / totalEstimated) * 100).toFixed(1)}%

Market Context: ${marketContext}

Your Strategic Thinking: ${thinkingResult.text}

Top Performing Items:
${results
  .sort((a, b) => b.analysis.profitPotential - a.analysis.profitPotential)
  .slice(0, 5)
  .map(
    (r, i) =>
      `${i + 1}. ${r.analysis.cleanedTitle} - Profit: $${r.analysis.profitPotential.toFixed(2)} (${r.analysis.category})`,
  )
  .join("\n")}

Provide comprehensive business insights including executive summary, market analysis, financial projections with monthly cash flow, strategic recommendations (immediate/short/long term), detailed risk analysis, and operational insights.`,
      system:
        "You are a senior business analyst specializing in liquidation investments. Provide executive-level insights.",
    })

    // Parse thinking process
    const thinkingLines = thinkingResult.text.split("\n").filter((line) => line.trim())
    const thinkingProcess = {
      overallStrategy:
        thinkingLines.find((line) => line.toLowerCase().includes("strategy")) ||
        "Strategic approach based on market analysis",
      marketResearchFindings: thinkingLines.filter(
        (line) => line.toLowerCase().includes("market") || line.toLowerCase().includes("demand"),
      ),
      valuationMethodology:
        thinkingLines.find(
          (line) => line.toLowerCase().includes("valuation") || line.toLowerCase().includes("value"),
        ) || "Conservative valuation approach",
      riskAssessmentApproach:
        thinkingLines.find((line) => line.toLowerCase().includes("risk")) || "Comprehensive risk evaluation",
      recommendationRationale:
        thinkingLines.find((line) => line.toLowerCase().includes("recommend")) || "Data-driven recommendations",
    }

    return { insights: insights.object, thinkingProcess }
  } catch (error) {
    console.error("Error generating comprehensive insights:", error)

    // Fallback insights
    return {
      insights: {
        executiveSummary: `Analysis of ${results.length} items with total retail value of $${totalRetail.toFixed(2)} and estimated profit potential of $${totalProfit.toFixed(2)}.`,
        marketAnalysis: {
          overallMarketCondition: "Fair" as const,
          topPerformingCategories: ["Electronics", "Home Goods"],
          marketOpportunities: ["Focus on high-value items", "Quick turnaround potential"],
          competitiveLandscape: "Moderate competition in liquidation markets",
        },
        financialProjections: {
          totalInvestment: totalEstimated,
          projectedRevenue: totalEstimated + totalProfit,
          estimatedProfit: totalProfit,
          expectedROI: (totalProfit / totalEstimated) * 100,
          breakEvenTimeframe: "3-6 months",
          cashFlowProjection: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            revenue: (totalEstimated + totalProfit) / 6,
            profit: totalProfit / 6,
          })),
        },
        strategicRecommendations: {
          immediate: ["Verify item conditions", "Research market prices"],
          shortTerm: ["List high-value items first", "Build customer base"],
          longTerm: ["Expand to new categories", "Develop supplier relationships"],
        },
        riskAnalysis: {
          majorRisks: ["Market saturation", "Condition verification", "Storage costs"],
          mitigationStrategies: ["Diversify inventory", "Thorough inspection", "Efficient logistics"],
          contingencyPlans: ["Quick liquidation options", "Return policies", "Insurance coverage"],
        },
        operationalInsights: {
          inventoryManagement: ["Track item conditions", "Organize by category", "Monitor turnover rates"],
          logisticsConsiderations: ["Storage requirements", "Shipping costs", "Packaging needs"],
          qualityControl: ["Inspection protocols", "Condition documentation", "Return handling"],
        },
      },
      thinkingProcess: {
        overallStrategy: "Conservative approach with focus on quick turnaround",
        marketResearchFindings: ["Market research limited", "Using general industry knowledge"],
        valuationMethodology: "Conservative 25% of retail value",
        riskAssessmentApproach: "Medium risk assessment due to limited data",
        recommendationRationale: "Based on general liquidation best practices",
      },
    }
  }
}

// Helper functions
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
