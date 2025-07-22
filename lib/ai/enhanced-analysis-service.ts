"use server"

import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { FixedManifestItem } from "@/lib/utils/fixed-manifest-parser"
import type { EnhancedManifestItem } from "@/lib/utils/enhanced-manifest-parser"

// Enhanced schemas for comprehensive analysis
const ThinkingProcessSchema = z.object({
  initialAssessment: z.string(),
  marketContextAnalysis: z.string(),
  valuationMethodology: z.string(),
  riskFactorAnalysis: z.string(),
  competitiveAnalysis: z.string(),
  finalRecommendation: z.string(),
})

const ComprehensiveItemAnalysisSchema = z.object({
  cleanedTitle: z.string(),
  category: z.string(),
  subcategory: z.string(),
  brand: z.string(),
  model: z.string().optional(),
  estimatedValue: z.number(),
  conservativeValue: z.number(),
  optimisticValue: z.number(),
  riskScore: z.number().min(1).max(100),
  riskLevel: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  marketDemand: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
  profitPotential: z.number(),
  confidence: z.number().min(0).max(1),
  timeToSell: z.enum(["1-7 days", "1-2 weeks", "2-4 weeks", "1-2 months", "2+ months"]),
  recommendedPlatform: z.array(z.string()),
  competitorPricing: z.object({
    low: z.number(),
    average: z.number(),
    high: z.number(),
  }),
  seasonalFactors: z.string(),
  conditionImpact: z.string(),
})

const MarketAnalysisSchema = z.object({
  overallMarketCondition: z.enum(["Excellent", "Good", "Fair", "Poor", "Very Poor"]),
  topPerformingCategories: z.array(z.string()),
  emergingTrends: z.array(z.string()),
  seasonalConsiderations: z.array(z.string()),
  competitiveLandscape: z.string(),
  priceVolatility: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
})

const StrategicRecommendationsSchema = z.object({
  immediate: z.array(z.string()),
  shortTerm: z.array(z.string()),
  longTerm: z.array(z.string()),
  riskMitigation: z.array(z.string()),
  operationalTips: z.array(z.string()),
})

const FinancialProjectionsSchema = z.object({
  monthlyProjections: z.array(
    z.object({
      month: z.number(),
      expectedRevenue: z.number(),
      expectedCosts: z.number(),
      netProfit: z.number(),
      cashFlow: z.number(),
    }),
  ),
  breakEvenPoint: z.number(),
  roiTimeline: z.string(),
  capitalRequirements: z.number(),
})

const ComprehensiveManifestInsightsSchema = z.object({
  executiveSummary: z.string(),
  keyFindings: z.array(z.string()),
  totalValue: z.number(),
  totalProfit: z.number(),
  averageMargin: z.number(),
  topCategories: z.array(z.string()),
  opportunities: z.array(z.string()),
  risks: z.array(z.string()),
  marketAnalysis: MarketAnalysisSchema,
  strategicRecommendations: StrategicRecommendationsSchema,
  financialProjections: FinancialProjectionsSchema,
  operationalInsights: z.object({
    inventoryManagement: z.array(z.string()),
    logisticsConsiderations: z.array(z.string()),
    qualityControl: z.array(z.string()),
    customerService: z.array(z.string()),
  }),
})

export interface ComprehensiveAnalysisResult {
  id: string
  originalItem: FixedManifestItem | EnhancedManifestItem
  analysis: z.infer<typeof ComprehensiveItemAnalysisSchema>
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
  analysisResults: ComprehensiveAnalysisResult[]
  insights: z.infer<typeof ComprehensiveManifestInsightsSchema>
  summary: {
    averageItemValue: number
    averageProfit: number
    expectedROI: number
    confidenceScore: number
    categoryBreakdown: Record<string, number>
    riskDistribution: { veryLow: number; low: number; medium: number; high: number; veryHigh: number }
  }
}

export async function performComprehensiveItemAnalysis(
  item: FixedManifestItem | EnhancedManifestItem,
  itemIndex: number,
  marketContext: string,
): Promise<ComprehensiveAnalysisResult> {
  const startTime = Date.now()
  console.log(
    `🔍 Performing comprehensive analysis for item ${itemIndex}: "${getItemProduct(item).substring(0, 50)}..."`,
  )

  try {
    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)
    const quantity = getItemQuantity(item)
    const condition = getItemCondition(item)

    // First, generate the thinking process
    console.log(`🧠 Generating thinking process for item ${itemIndex}...`)
    const thinkingProcess = await generateObject({
      model: openai("gpt-4o"),
      schema: ThinkingProcessSchema,
      prompt: `As a liquidation expert, think through the analysis of this item step by step:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}

Market Context: ${marketContext}

Provide your detailed thinking process covering:
1. Initial assessment of the product and its market position
2. Market context analysis considering current trends and demand
3. Valuation methodology explaining how you'll determine pricing
4. Risk factor analysis identifying potential challenges
5. Competitive analysis comparing to similar products
6. Final recommendation with reasoning

Be thorough and explain your reasoning at each step.`,
      system:
        "You are an expert liquidation analyst with deep market knowledge. Think through each analysis step carefully and explain your reasoning.",
    })

    // Then perform the comprehensive analysis
    console.log(`📊 Performing detailed analysis for item ${itemIndex}...`)
    const analysis = await generateObject({
      model: openai("gpt-4o"),
      schema: ComprehensiveItemAnalysisSchema,
      prompt: `Based on your thinking process, now provide a comprehensive analysis of this liquidation item:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}

Market Context: ${marketContext}

Your thinking process: ${JSON.stringify(thinkingProcess.object, null, 2)}

Provide a detailed analysis including:
- Clean, marketable product title and categorization
- Multiple valuation scenarios (conservative, realistic, optimistic)
- Comprehensive risk assessment with specific risk level
- Market demand analysis with supporting reasoning
- Time-to-sell estimates based on market conditions
- Recommended selling platforms
- Competitor pricing analysis
- Seasonal and condition impact factors

Be realistic, data-driven, and provide actionable insights.`,
      system:
        "You are a professional liquidation analyst. Provide comprehensive, realistic assessments based on market data and experience.",
    })

    const processingTime = Date.now() - startTime
    console.log(`✅ Comprehensive analysis completed for item ${itemIndex} in ${processingTime}ms`)

    return {
      id: `item-${itemIndex}`,
      originalItem: item,
      analysis: analysis.object,
      thinkingProcess: thinkingProcess.object,
      processingTime,
    }
  } catch (error) {
    console.error(`❌ Comprehensive analysis failed for item ${itemIndex}:`, error)

    const product = getItemProduct(item)
    const retailPrice = getItemRetailPrice(item)
    const processingTime = Date.now() - startTime

    // Fallback analysis with thinking process
    return {
      id: `item-${itemIndex}`,
      originalItem: item,
      analysis: {
        cleanedTitle: product.substring(0, 60),
        category: "Other",
        subcategory: "General Merchandise",
        brand: "Unknown",
        estimatedValue: retailPrice * 0.25,
        conservativeValue: retailPrice * 0.15,
        optimisticValue: retailPrice * 0.35,
        riskScore: 60,
        riskLevel: "Medium" as const,
        marketDemand: "Medium" as const,
        profitPotential: retailPrice * 0.1,
        confidence: 0.4,
        timeToSell: "2-4 weeks" as const,
        recommendedPlatform: ["eBay", "Facebook Marketplace"],
        competitorPricing: {
          low: retailPrice * 0.1,
          average: retailPrice * 0.25,
          high: retailPrice * 0.4,
        },
        seasonalFactors: "No significant seasonal impact identified",
        conditionImpact: "Condition assessment needed for accurate pricing",
      },
      thinkingProcess: {
        initialAssessment: "Limited information available for comprehensive analysis",
        marketContextAnalysis: "General market conditions assumed",
        valuationMethodology: "Conservative percentage-based valuation applied",
        riskFactorAnalysis: "Medium risk due to limited product information",
        competitiveAnalysis: "Standard competitive landscape assumed",
        finalRecommendation: "Requires additional research for optimal pricing strategy",
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
    console.log(`🌍 Generating market context...`)
    const marketContext = await generateMarketContext(items)

    // Limit to first 15 items for comprehensive analysis
    const itemsToAnalyze = items.slice(0, Math.min(15, items.length))
    console.log(`📊 Performing comprehensive analysis on ${itemsToAnalyze.length} items...`)

    // Process items in small batches to avoid overwhelming the API
    const batchSize = 2
    const analysisResults: ComprehensiveAnalysisResult[] = []

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      console.log(
        `🔄 Processing comprehensive batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(itemsToAnalyze.length / batchSize)}`,
      )

      const batchPromises = batch.map((item, batchIndex) =>
        performComprehensiveItemAnalysis(item, i + batchIndex + 1, marketContext),
      )

      const batchResults = await Promise.all(batchPromises)
      analysisResults.push(...batchResults)

      // Delay between batches to respect rate limits
      if (i + batchSize < itemsToAnalyze.length) {
        console.log(`⏳ Waiting before next batch...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Calculate totals
    const totalRetailValue = analysisResults.reduce((sum, result) => {
      const item = result.originalItem
      return sum + getItemTotalRetailPrice(item)
    }, 0)

    const totalEstimatedValue = analysisResults.reduce((sum, result) => sum + result.analysis.estimatedValue, 0)
    const totalPotentialProfit = analysisResults.reduce((sum, result) => sum + result.analysis.profitPotential, 0)

    // Generate comprehensive insights
    console.log(`🧠 Generating comprehensive manifest insights...`)
    const insights = await generateComprehensiveManifestInsights(
      analysisResults,
      totalRetailValue,
      totalEstimatedValue,
      totalPotentialProfit,
      marketContext,
    )

    // Calculate summary statistics
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
        const riskLevel = result.analysis.riskLevel
        switch (riskLevel) {
          case "Very Low":
            acc.veryLow++
            break
          case "Low":
            acc.low++
            break
          case "Medium":
            acc.medium++
            break
          case "High":
            acc.high++
            break
          case "Very High":
            acc.veryHigh++
            break
        }
        return acc
      },
      { veryLow: 0, low: 0, medium: 0, high: 0, veryHigh: 0 },
    )

    const averageConfidence =
      analysisResults.reduce((sum, result) => sum + result.analysis.confidence, 0) / analysisResults.length

    const processingTime = Date.now() - startTime
    const manifestId = `manifest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ Comprehensive analysis completed in ${processingTime}ms`)
    console.log(`💰 Total Retail: $${totalRetailValue.toFixed(2)}`)
    console.log(`📈 Total Estimated: $${totalEstimatedValue.toFixed(2)}`)
    console.log(`🎯 Total Profit: $${totalPotentialProfit.toFixed(2)}`)
    console.log(`🎯 Average Confidence: ${(averageConfidence * 100).toFixed(1)}%`)

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
      summary: {
        averageItemValue: totalEstimatedValue / analysisResults.length,
        averageProfit: totalPotentialProfit / analysisResults.length,
        expectedROI: (totalPotentialProfit / totalEstimatedValue) * 100,
        confidenceScore: averageConfidence,
        categoryBreakdown,
        riskDistribution,
      },
    }
  } catch (error) {
    console.error("❌ Comprehensive analysis failed:", error)
    throw error
  }
}

async function generateMarketContext(items: (FixedManifestItem | EnhancedManifestItem)[]): Promise<string> {
  try {
    const sampleItems = items.slice(0, 10).map((item) => ({
      product: getItemProduct(item),
      price: getItemRetailPrice(item),
      category: "category" in item ? item.category : "Unknown",
    }))

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze the current market context for these liquidation items:

${sampleItems.map((item, i) => `${i + 1}. ${item.product} - $${item.price} (${item.category})`).join("\n")}

Provide a comprehensive market context analysis covering:
- Current market conditions for these product categories
- Seasonal trends and timing considerations
- Consumer demand patterns
- Economic factors affecting resale markets
- Platform-specific considerations (eBay, Amazon, Facebook, etc.)
- Competitive landscape overview

Keep the analysis concise but informative (2-3 paragraphs).`,
      system:
        "You are a market research analyst specializing in liquidation and resale markets. Provide current, actionable market insights.",
    })

    return text
  } catch (error) {
    console.error("Error generating market context:", error)
    return "Current market conditions show mixed demand across categories. E-commerce platforms remain strong channels for liquidation sales, with seasonal considerations affecting timing and pricing strategies."
  }
}

async function generateComprehensiveManifestInsights(
  results: ComprehensiveAnalysisResult[],
  totalRetail: number,
  totalEstimated: number,
  totalProfit: number,
  marketContext: string,
): Promise<z.infer<typeof ComprehensiveManifestInsightsSchema>> {
  try {
    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ComprehensiveManifestInsightsSchema,
      prompt: `Provide comprehensive strategic insights for this liquidation manifest:

Total Items Analyzed: ${results.length}
Total Retail Value: $${totalRetail.toFixed(2)}
Total Estimated Value: $${totalEstimated.toFixed(2)}
Total Potential Profit: $${totalProfit.toFixed(2)}
Expected ROI: ${((totalProfit / totalEstimated) * 100).toFixed(1)}%

Market Context: ${marketContext}

Top Items Analysis:
${results
  .slice(0, 8)
  .map(
    (r, i) =>
      `${i + 1}. ${r.analysis.cleanedTitle} - Est: $${r.analysis.estimatedValue} (${r.analysis.category}, Risk: ${r.analysis.riskLevel})`,
  )
  .join("\n")}

Risk Distribution:
${Object.entries(
  results.reduce(
    (acc, r) => {
      acc[r.analysis.riskLevel] = (acc[r.analysis.riskLevel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  ),
)
  .map(([level, count]) => `${level}: ${count} items`)
  .join(", ")}

Provide comprehensive strategic analysis including:
- Executive summary with key insights
- Detailed financial projections with monthly breakdown
- Strategic recommendations for immediate, short-term, and long-term actions
- Risk mitigation strategies
- Operational insights for inventory, logistics, quality control, and customer service
- Market analysis with competitive landscape assessment

Be specific, actionable, and data-driven in your recommendations.`,
      system:
        "You are a senior business strategist specializing in liquidation and resale operations. Provide comprehensive, actionable insights for maximizing profitability and minimizing risk.",
    })

    return insights.object
  } catch (error) {
    console.error("Error generating comprehensive insights:", error)

    // Fallback comprehensive insights
    return {
      executiveSummary: `Analysis of ${results.length} items reveals a total estimated value of $${totalEstimated.toFixed(2)} with potential profit of $${totalProfit.toFixed(2)} (${((totalProfit / totalEstimated) * 100).toFixed(1)}% ROI). The manifest shows mixed risk levels with opportunities for strategic category focus.`,
      keyFindings: [
        "Diverse product mix provides risk distribution",
        "Several high-value items identified for priority focus",
        "Market conditions favor quick turnaround strategy",
        "Quality control will be critical for customer satisfaction",
      ],
      totalValue: totalEstimated,
      totalProfit: totalProfit,
      averageMargin: (totalProfit / totalEstimated) * 100,
      topCategories: ["Electronics", "Home Goods", "Apparel"],
      opportunities: [
        "Focus on high-confidence, low-risk items first",
        "Bundle complementary products for higher margins",
        "Leverage seasonal timing for specific categories",
      ],
      risks: [
        "Condition verification needed for accurate pricing",
        "Market saturation in some categories",
        "Storage and handling costs impact margins",
      ],
      marketAnalysis: {
        overallMarketCondition: "Good" as const,
        topPerformingCategories: ["Electronics", "Home Goods"],
        emergingTrends: ["Sustainable products", "Smart home devices"],
        seasonalConsiderations: ["Holiday season approaching", "Back-to-school demand"],
        competitiveLandscape: "Moderate competition with opportunities for differentiation",
        priceVolatility: "Medium" as const,
      },
      strategicRecommendations: {
        immediate: [
          "Sort items by risk level and start with low-risk, high-confidence items",
          "Set up quality control process for condition verification",
          "Research current market prices for top-value items",
        ],
        shortTerm: [
          "Develop category-specific pricing strategies",
          "Establish relationships with multiple selling platforms",
          "Create efficient inventory management system",
        ],
        longTerm: [
          "Build brand reputation for quality liquidation goods",
          "Develop data-driven pricing algorithms",
          "Expand into complementary product categories",
        ],
        riskMitigation: [
          "Diversify across multiple selling platforms",
          "Maintain conservative pricing for uncertain items",
          "Implement thorough condition assessment protocols",
        ],
        operationalTips: [
          "Batch similar items for efficient processing",
          "Use professional photography for higher-value items",
          "Implement customer service protocols for returns",
        ],
      },
      financialProjections: {
        monthlyProjections: [
          {
            month: 1,
            expectedRevenue: totalEstimated * 0.3,
            expectedCosts: totalEstimated * 0.15,
            netProfit: totalEstimated * 0.15,
            cashFlow: totalEstimated * 0.15,
          },
          {
            month: 2,
            expectedRevenue: totalEstimated * 0.4,
            expectedCosts: totalEstimated * 0.2,
            netProfit: totalEstimated * 0.2,
            cashFlow: totalEstimated * 0.35,
          },
          {
            month: 3,
            expectedRevenue: totalEstimated * 0.3,
            expectedCosts: totalEstimated * 0.15,
            netProfit: totalEstimated * 0.15,
            cashFlow: totalEstimated * 0.5,
          },
        ],
        breakEvenPoint: 2.5,
        roiTimeline: "Expected full ROI within 3-4 months",
        capitalRequirements: totalEstimated * 0.1,
      },
      operationalInsights: {
        inventoryManagement: [
          "Implement FIFO system for perishable/seasonal items",
          "Use barcode system for tracking",
          "Maintain detailed condition records",
        ],
        logisticsConsiderations: [
          "Optimize packaging for different item types",
          "Negotiate bulk shipping rates",
          "Consider local pickup options for large items",
        ],
        qualityControl: [
          "Photograph all items before listing",
          "Test electronic items thoroughly",
          "Grade condition consistently across all items",
        ],
        customerService: [
          "Provide detailed item descriptions",
          "Offer reasonable return policies",
          "Respond quickly to customer inquiries",
        ],
      },
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
