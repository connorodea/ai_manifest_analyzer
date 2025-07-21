"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { FixedManifestItem } from "@/lib/utils/fixed-manifest-parser"

// Enhanced schemas for deep research with web search
const DeepMarketResearchSchema = z.object({
  productIdentification: z.object({
    cleanedProductName: z.string(),
    brand: z.string(),
    model: z.string(),
    category: z.string(),
    subcategory: z.string(),
    upc: z.string().optional(),
    manufacturerPartNumber: z.string().optional(),
  }),
  currentMarketData: z.object({
    amazonCurrentPrice: z.number().optional(),
    ebayAveragePrice: z.number().optional(),
    walmartPrice: z.number().optional(),
    bestBuyPrice: z.number().optional(),
    facebookMarketplaceRange: z
      .object({
        low: z.number(),
        high: z.number(),
      })
      .optional(),
    liquidationEstimate: z.number(),
    wholesaleEstimate: z.number(),
    marketTrend: z.enum(["Rising", "Stable", "Declining"]),
    demandLevel: z.enum(["Very Low", "Low", "Moderate", "High", "Very High"]),
    competitionLevel: z.enum(["Low", "Moderate", "High", "Very High"]),
    salesVelocity: z.enum(["Very Slow", "Slow", "Moderate", "Fast", "Very Fast"]),
    seasonalityFactor: z.number().min(0.5).max(2.0),
    priceVolatility: z.enum(["Low", "Moderate", "High"]),
  }),
  marketIntelligence: z.object({
    recentPriceChanges: z.string(),
    demandDrivers: z.array(z.string()),
    marketOpportunities: z.array(z.string()),
    competitorAnalysis: z.string(),
    seasonalTrends: z.string(),
    brandReputation: z.string(),
    authenticityRisks: z.array(z.string()),
  }),
  profitabilityAnalysis: z.object({
    estimatedSellPrice: z.number(),
    estimatedProfit: z.number(),
    profitMargin: z.number(),
    roi: z.number(),
    timeToSell: z.string(),
    bestSellingPlatforms: z.array(z.string()),
    targetAudience: z.string(),
    pricingStrategy: z.string(),
  }),
  riskAssessment: z.object({
    overallRiskScore: z.number().min(1).max(100),
    authenticityRisk: z.number().min(1).max(100),
    marketSaturationRisk: z.number().min(1).max(100),
    conditionRisk: z.number().min(1).max(100),
    demandRisk: z.number().min(1).max(100),
    brandRisk: z.number().min(1).max(100),
    riskFactors: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
  }),
  confidence: z.object({
    dataQuality: z.number().min(0).max(1),
    marketDataFreshness: z.number().min(0).max(1),
    overallConfidence: z.number().min(0).max(1),
  }),
})

const ManifestDeepInsightsSchema = z.object({
  executiveSummary: z.string(),
  marketOverview: z.object({
    totalItems: z.number(),
    totalRetailValue: z.number(),
    estimatedLiquidationValue: z.number(),
    potentialProfit: z.number(),
    expectedROI: z.number(),
    marketConfidence: z.number(),
  }),
  categoryPerformance: z.array(
    z.object({
      category: z.string(),
      itemCount: z.number(),
      totalValue: z.number(),
      averageMargin: z.number(),
      marketTrend: z.string(),
      riskLevel: z.string(),
      recommendation: z.string(),
    }),
  ),
  topOpportunities: z.array(
    z.object({
      productName: z.string(),
      estimatedProfit: z.number(),
      profitMargin: z.number(),
      riskLevel: z.string(),
      marketTrend: z.string(),
      actionPlan: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      timeframe: z.string(),
    }),
  ),
  marketTrends: z.array(
    z.object({
      trend: z.string(),
      impact: z.string(),
      affectedCategories: z.array(z.string()),
      timeframe: z.string(),
      actionRequired: z.string(),
    }),
  ),
  riskAnalysis: z.object({
    overallRiskLevel: z.string(),
    majorRisks: z.array(z.string()),
    riskMitigation: z.array(z.string()),
    highRiskItems: z.number(),
    mediumRiskItems: z.number(),
    lowRiskItems: z.number(),
  }),
  strategicRecommendations: z.object({
    immediateActions: z.array(z.string()),
    shortTermStrategy: z.array(z.string()),
    longTermStrategy: z.array(z.string()),
    budgetAllocation: z.string(),
    expectedTimeline: z.string(),
  }),
  financialProjections: z.object({
    conservativeProfit: z.number(),
    realisticProfit: z.number(),
    optimisticProfit: z.number(),
    cashFlowProjection: z.string(),
    liquidationTimeframe: z.string(),
    breakEvenAnalysis: z.string(),
  }),
})

export interface DeepResearchResult {
  id: string
  originalItem: FixedManifestItem
  deepResearch: z.infer<typeof DeepMarketResearchSchema>
  processingTime: number
  webSearchUsed: boolean
}

export interface ManifestDeepAnalysisResult {
  manifestId: string
  manifestName: string
  totalItems: number
  totalRetailValue: number
  estimatedLiquidationValue: number
  totalPotentialProfit: number
  processingTime: number
  webSearchEnabled: boolean
  deepResearchResults: DeepResearchResult[]
  insights: z.infer<typeof ManifestDeepInsightsSchema>
  summary: {
    averageItemValue: number
    averageProfit: number
    expectedROI: number
    categoryBreakdown: Record<string, number>
    riskDistribution: { low: number; medium: number; high: number }
    marketConfidence: number
  }
}

export async function performDeepMarketResearch(
  item: FixedManifestItem,
  itemIndex: number,
  useWebSearch = true,
): Promise<DeepResearchResult> {
  const startTime = Date.now()

  console.log(`🔬 DEEP RESEARCH - Item ${itemIndex}: "${item.product.substring(0, 50)}..."`)
  console.log(`   Retail Price: $${item.retailPrice} | Quantity: ${item.quantity} | Condition: ${item.condition}`)
  console.log(`   Web Search: ${useWebSearch ? "ENABLED" : "DISABLED"}`)

  try {
    let deepResearch: z.infer<typeof DeepMarketResearchSchema>

    if (useWebSearch) {
      // Use OpenAI's new Responses API with web search for real-time market data
      console.log(`🌐 Using web search for real-time market data...`)

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          tools: [
            {
              type: "web_search_preview",
              search_context_size: "medium",
            },
          ],
          input: `Perform comprehensive market research for this liquidation item:

PRODUCT DETAILS:
- Product: "${item.product}"
- Retail Price: $${item.retailPrice}
- Quantity: ${item.quantity}
- Condition: ${item.condition}

RESEARCH REQUIREMENTS:
1. Search for current market prices on major platforms (Amazon, eBay, Walmart, Facebook Marketplace)
2. Analyze recent price trends and market demand
3. Identify brand reputation and authenticity concerns
4. Assess competition levels and market saturation
5. Determine seasonal factors and demand drivers
6. Estimate liquidation and wholesale values
7. Evaluate profit potential and selling strategies

Provide detailed market intelligence with current data and realistic projections for liquidation resale.`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Web search API failed: ${response.statusText}`)
      }

      const webSearchResult = await response.json()
      const marketData = webSearchResult.output_text

      // Now use the web search results to generate structured analysis
      deepResearch = await generateObject({
        model: openai("gpt-4o"),
        schema: DeepMarketResearchSchema,
        prompt: `Based on the following web search results, provide comprehensive market analysis:

WEB SEARCH RESULTS:
${marketData}

PRODUCT DETAILS:
- Product: "${item.product}"
- Retail Price: $${item.retailPrice}
- Quantity: ${item.quantity}
- Condition: ${item.condition}

Analyze the web search data and provide structured market research including current prices, trends, risks, and profit projections.`,
        system: `You are a senior market research analyst specializing in liquidation and resale markets. Use the web search data to provide accurate, current market analysis.`,
      })
    } else {
      // Fallback to AI analysis without web search
      console.log(`🤖 Using AI analysis without web search...`)

      deepResearch = await generateObject({
        model: openai("gpt-4o"),
        schema: DeepMarketResearchSchema,
        prompt: `Perform market analysis for this liquidation item based on your knowledge:

PRODUCT DETAILS:
- Product: "${item.product}"
- Retail Price: $${item.retailPrice}
- Quantity: ${item.quantity}
- Condition: ${item.condition}

Provide comprehensive analysis including market estimates, risk assessment, and profit projections based on typical liquidation market patterns.`,
        system: `You are a liquidation market expert. Provide realistic analysis based on typical market conditions and liquidation industry standards.`,
      })
    }

    const processingTime = Date.now() - startTime

    console.log(`✅ Deep research completed for item ${itemIndex} in ${processingTime}ms`)
    console.log(`   Estimated Liquidation Value: $${deepResearch.object.currentMarketData.liquidationEstimate}`)
    console.log(`   Risk Score: ${deepResearch.object.riskAssessment.overallRiskScore}/100`)
    console.log(`   Market Demand: ${deepResearch.object.currentMarketData.demandLevel}`)

    return {
      id: `deep-item-${itemIndex}`,
      originalItem: item,
      deepResearch: deepResearch.object,
      processingTime,
      webSearchUsed: useWebSearch,
    }
  } catch (error) {
    console.error(`❌ Deep research failed for item ${itemIndex}:`, error)

    // Fallback analysis
    const fallbackResearch: z.infer<typeof DeepMarketResearchSchema> = {
      productIdentification: {
        cleanedProductName: item.product.substring(0, 60),
        brand: "Unknown",
        model: "Unknown",
        category: "Other",
        subcategory: "General",
      },
      currentMarketData: {
        liquidationEstimate: item.retailPrice * 0.2,
        wholesaleEstimate: item.retailPrice * 0.3,
        marketTrend: "Stable",
        demandLevel: "Moderate",
        competitionLevel: "Moderate",
        salesVelocity: "Moderate",
        seasonalityFactor: 1.0,
        priceVolatility: "Moderate",
      },
      marketIntelligence: {
        recentPriceChanges: "No recent data available",
        demandDrivers: ["General market demand"],
        marketOpportunities: ["Standard resale opportunity"],
        competitorAnalysis: "Moderate competition expected",
        seasonalTrends: "No specific seasonal patterns identified",
        brandReputation: "Unknown brand reputation",
        authenticityRisks: ["Verify authenticity before sale"],
      },
      profitabilityAnalysis: {
        estimatedSellPrice: item.retailPrice * 0.4,
        estimatedProfit: item.retailPrice * 0.1,
        profitMargin: 25,
        roi: 50,
        timeToSell: "30-60 days",
        bestSellingPlatforms: ["eBay", "Facebook Marketplace"],
        targetAudience: "General consumers",
        pricingStrategy: "Competitive pricing",
      },
      riskAssessment: {
        overallRiskScore: 50,
        authenticityRisk: 50,
        marketSaturationRisk: 50,
        conditionRisk: 40,
        demandRisk: 50,
        brandRisk: 50,
        riskFactors: ["Market uncertainty", "Condition verification needed"],
        mitigationStrategies: ["Research before listing", "Competitive pricing"],
      },
      confidence: {
        dataQuality: 0.3,
        marketDataFreshness: 0.2,
        overallConfidence: 0.3,
      },
    }

    return {
      id: `deep-item-${itemIndex}`,
      originalItem: item,
      deepResearch: fallbackResearch,
      processingTime: Date.now() - startTime,
      webSearchUsed: false,
    }
  }
}

export async function analyzeManifestWithDeepResearch(
  items: FixedManifestItem[],
  manifestName: string,
  useWebSearch = true,
): Promise<ManifestDeepAnalysisResult> {
  const startTime = Date.now()
  console.log(`🚀 Starting DEEP RESEARCH analysis for ${items.length} items...`)
  console.log(`🌐 Web Search: ${useWebSearch ? "ENABLED" : "DISABLED"}`)

  try {
    // Limit to first 10 items for deep research (can be expensive)
    const itemsToAnalyze = items.slice(0, Math.min(10, items.length))
    console.log(`🔬 Deep analyzing ${itemsToAnalyze.length} items...`)

    // Process items in small batches to avoid rate limits
    const batchSize = 2
    const deepResearchResults: DeepResearchResult[] = []

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      console.log(
        `🔄 Processing deep research batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(itemsToAnalyze.length / batchSize)}`,
      )

      const batchPromises = batch.map((item, batchIndex) =>
        performDeepMarketResearch(item, i + batchIndex + 1, useWebSearch),
      )

      const batchResults = await Promise.all(batchPromises)
      deepResearchResults.push(...batchResults)

      // Longer delay between batches for web search
      if (i + batchSize < itemsToAnalyze.length) {
        const delay = useWebSearch ? 3000 : 1000
        console.log(`⏳ Waiting ${delay / 1000} seconds before next batch...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    // Calculate totals
    const totalRetailValue = deepResearchResults.reduce((sum, result) => sum + result.originalItem.totalRetailPrice, 0)
    const totalLiquidationValue = deepResearchResults.reduce(
      (sum, result) => sum + result.deepResearch.currentMarketData.liquidationEstimate,
      0,
    )
    const totalPotentialProfit = deepResearchResults.reduce(
      (sum, result) => sum + result.deepResearch.profitabilityAnalysis.estimatedProfit,
      0,
    )

    // Generate comprehensive insights
    console.log(`🧠 Generating deep market insights...`)
    const insights = await generateDeepManifestInsights(
      deepResearchResults,
      totalRetailValue,
      totalLiquidationValue,
      totalPotentialProfit,
      useWebSearch,
    )

    // Calculate summary stats
    const categoryBreakdown = deepResearchResults.reduce(
      (acc, result) => {
        const category = result.deepResearch.productIdentification.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const riskDistribution = deepResearchResults.reduce(
      (acc, result) => {
        const risk = result.deepResearch.riskAssessment.overallRiskScore
        if (risk <= 30) acc.low++
        else if (risk <= 70) acc.medium++
        else acc.high++
        return acc
      },
      { low: 0, medium: 0, high: 0 },
    )

    const marketConfidence =
      deepResearchResults.reduce((sum, result) => sum + result.deepResearch.confidence.overallConfidence, 0) /
      deepResearchResults.length

    const processingTime = Date.now() - startTime
    const manifestId = `deep-manifest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ Deep research analysis completed in ${processingTime}ms`)
    console.log(`💰 Total Retail: $${totalRetailValue.toFixed(2)}`)
    console.log(`📈 Total Liquidation Est: $${totalLiquidationValue.toFixed(2)}`)
    console.log(`🎯 Total Profit Est: $${totalPotentialProfit.toFixed(2)}`)
    console.log(`📊 Market Confidence: ${(marketConfidence * 100).toFixed(1)}%`)

    return {
      manifestId,
      manifestName,
      totalItems: deepResearchResults.length,
      totalRetailValue,
      estimatedLiquidationValue: totalLiquidationValue,
      totalPotentialProfit,
      processingTime,
      webSearchEnabled: useWebSearch,
      deepResearchResults,
      insights,
      summary: {
        averageItemValue: totalLiquidationValue / deepResearchResults.length,
        averageProfit: totalPotentialProfit / deepResearchResults.length,
        expectedROI: (totalPotentialProfit / totalLiquidationValue) * 100,
        categoryBreakdown,
        riskDistribution,
        marketConfidence,
      },
    }
  } catch (error) {
    console.error("❌ Deep research analysis failed:", error)
    throw error
  }
}

async function generateDeepManifestInsights(
  results: DeepResearchResult[],
  totalRetail: number,
  totalLiquidation: number,
  totalProfit: number,
  webSearchUsed: boolean,
): Promise<z.infer<typeof ManifestDeepInsightsSchema>> {
  try {
    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ManifestDeepInsightsSchema,
      prompt: `Analyze this liquidation manifest with ${webSearchUsed ? "REAL-TIME WEB SEARCH DATA" : "AI ANALYSIS"}:

MANIFEST OVERVIEW:
- Total Items: ${results.length}
- Total Retail Value: $${totalRetail.toFixed(2)}
- Total Liquidation Estimate: $${totalLiquidation.toFixed(2)}
- Total Potential Profit: $${totalProfit.toFixed(2)}
- Expected ROI: ${((totalProfit / totalLiquidation) * 100).toFixed(1)}%
- Web Search Used: ${webSearchUsed ? "YES" : "NO"}

DETAILED ANALYSIS:
${results
  .map(
    (result, i) => `
${i + 1}. ${result.deepResearch.productIdentification.cleanedProductName}
   Category: ${result.deepResearch.productIdentification.category}
   Brand: ${result.deepResearch.productIdentification.brand}
   Retail: $${result.originalItem.retailPrice} | Liquidation Est: $${result.deepResearch.currentMarketData.liquidationEstimate}
   Profit Est: $${result.deepResearch.profitabilityAnalysis.estimatedProfit} (${result.deepResearch.profitabilityAnalysis.profitMargin}% margin)
   Risk: ${result.deepResearch.riskAssessment.overallRiskScore}/100
   Market Trend: ${result.deepResearch.currentMarketData.marketTrend}
   Demand: ${result.deepResearch.currentMarketData.demandLevel}
   Competition: ${result.deepResearch.currentMarketData.competitionLevel}
   Best Platforms: ${result.deepResearch.profitabilityAnalysis.bestSellingPlatforms.join(", ")}
   Market Intelligence: ${result.deepResearch.marketIntelligence.recentPriceChanges}
`,
  )
  .join("")}

Provide comprehensive strategic analysis including:
1. Executive summary with key findings
2. Market overview and financial projections
3. Category-by-category performance analysis
4. Top profit opportunities with specific action plans
5. Current market trends and their impact
6. Comprehensive risk analysis and mitigation
7. Strategic recommendations (immediate, short-term, long-term)
8. Financial projections (conservative, realistic, optimistic)

${webSearchUsed ? "Leverage the real-time market data for accurate insights." : "Provide analysis based on typical market patterns."}`,
      system: `You are a senior liquidation investment strategist with access to ${webSearchUsed ? "real-time market data" : "comprehensive market knowledge"}. 
      
      Provide strategic, actionable insights for liquidation buyers focusing on:
      - ROI optimization and profit maximization
      - Risk assessment and mitigation strategies
      - Market timing and opportunity identification
      - Platform-specific selling strategies
      - Financial planning and cash flow management
      
      Your analysis should be practical, data-driven, and focused on real-world execution.`,
    })

    return insights.object
  } catch (error) {
    console.error("Error generating deep insights:", error)

    // Fallback insights
    return {
      executiveSummary: `Deep research analysis of ${results.length} items with ${webSearchUsed ? "real-time web data" : "AI analysis"}. Total retail value of $${totalRetail.toFixed(2)} with estimated liquidation value of $${totalLiquidation.toFixed(2)}.`,
      marketOverview: {
        totalItems: results.length,
        totalRetailValue: totalRetail,
        estimatedLiquidationValue: totalLiquidation,
        potentialProfit: totalProfit,
        expectedROI: (totalProfit / totalLiquidation) * 100,
        marketConfidence: webSearchUsed ? 0.8 : 0.6,
      },
      categoryPerformance: [
        {
          category: "Electronics",
          itemCount: Math.floor(results.length * 0.4),
          totalValue: totalLiquidation * 0.5,
          averageMargin: 25,
          marketTrend: "Strong demand",
          riskLevel: "Medium",
          recommendation: "Focus on popular brands",
        },
      ],
      topOpportunities: results.slice(0, 3).map((result, i) => ({
        productName: result.deepResearch.productIdentification.cleanedProductName,
        estimatedProfit: result.deepResearch.profitabilityAnalysis.estimatedProfit,
        profitMargin: result.deepResearch.profitabilityAnalysis.profitMargin,
        riskLevel:
          result.deepResearch.riskAssessment.overallRiskScore > 70
            ? "High"
            : result.deepResearch.riskAssessment.overallRiskScore > 40
              ? "Medium"
              : "Low",
        marketTrend: result.deepResearch.currentMarketData.marketTrend,
        actionPlan: `List on ${result.deepResearch.profitabilityAnalysis.bestSellingPlatforms[0]} at competitive price`,
        priority: i === 0 ? ("High" as const) : i === 1 ? ("Medium" as const) : ("Low" as const),
        timeframe: result.deepResearch.profitabilityAnalysis.timeToSell,
      })),
      marketTrends: [
        {
          trend: webSearchUsed ? "Real-time market data shows strong demand" : "Stable market conditions",
          impact: "Positive for liquidation sales",
          affectedCategories: ["Electronics", "Home Goods"],
          timeframe: "Next 3-6 months",
          actionRequired: "Monitor pricing trends",
        },
      ],
      riskAnalysis: {
        overallRiskLevel: "Medium",
        majorRisks: ["Market saturation", "Authenticity concerns", "Condition verification"],
        riskMitigation: ["Research before listing", "Competitive pricing", "Clear condition descriptions"],
        highRiskItems: results.filter((r) => r.deepResearch.riskAssessment.overallRiskScore > 70).length,
        mediumRiskItems: results.filter(
          (r) =>
            r.deepResearch.riskAssessment.overallRiskScore > 40 && r.deepResearch.riskAssessment.overallRiskScore <= 70,
        ).length,
        lowRiskItems: results.filter((r) => r.deepResearch.riskAssessment.overallRiskScore <= 40).length,
      },
      strategicRecommendations: {
        immediateActions: ["Verify item conditions", "Research top opportunities", "Set up selling accounts"],
        shortTermStrategy: ["List high-value items first", "Monitor market response", "Adjust pricing as needed"],
        longTermStrategy: ["Build seller reputation", "Develop category expertise", "Scale successful strategies"],
        budgetAllocation: "Focus 60% on low-risk items, 30% on medium-risk, 10% on high-risk",
        expectedTimeline: "3-6 months for full liquidation",
      },
      financialProjections: {
        conservativeProfit: totalProfit * 0.7,
        realisticProfit: totalProfit,
        optimisticProfit: totalProfit * 1.3,
        cashFlowProjection: "Positive cash flow expected within 30-60 days",
        liquidationTimeframe: "3-6 months for complete liquidation",
        breakEvenAnalysis: `Break even at ${((totalLiquidation / totalProfit) * 100).toFixed(1)}% of estimated profit`,
      },
    }
  }
}
