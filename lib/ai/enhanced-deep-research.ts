"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { EnhancedManifestItem } from "@/lib/utils/enhanced-manifest-parser"

// Enhanced schemas for the specific manifest structure
const ProductDeepAnalysisSchema = z.object({
  productIdentification: z.object({
    cleanedProductName: z.string(),
    brand: z.string(),
    model: z.string(),
    category: z.string(),
    subcategory: z.string(),
    upc: z.string().optional(),
    manufacturerPartNumber: z.string().optional(),
    productType: z.string(),
  }),
  marketAnalysis: z.object({
    currentMarketPrice: z.number(),
    amazonPrice: z.number().optional(),
    ebayAveragePrice: z.number().optional(),
    walmartPrice: z.number().optional(),
    liquidationEstimate: z.number(),
    wholesaleEstimate: z.number(),
    marketDemandLevel: z.enum(["Very Low", "Low", "Moderate", "High", "Very High"]),
    competitionLevel: z.enum(["Low", "Moderate", "High", "Very High"]),
    salesVelocity: z.enum(["Very Slow", "Slow", "Moderate", "Fast", "Very Fast"]),
    seasonalityFactor: z.number().min(0.5).max(2.0),
  }),
  conditionAnalysis: z.object({
    conditionImpact: z.number().min(0.1).max(1.0),
    conditionDescription: z.string(),
    expectedConditionMultiplier: z.number(),
    conditionRisks: z.array(z.string()),
  }),
  profitabilityProjection: z.object({
    estimatedSellPrice: z.number(),
    estimatedProfit: z.number(),
    profitMargin: z.number(),
    roi: z.number(),
    timeToSell: z.string(),
    recommendedStrategy: z.string(),
  }),
  riskAssessment: z.object({
    overallRiskScore: z.number().min(1).max(100),
    authenticityRisk: z.number().min(1).max(100),
    marketSaturationRisk: z.number().min(1).max(100),
    conditionRisk: z.number().min(1).max(100),
    demandRisk: z.number().min(1).max(100),
    riskFactors: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
  }),
  sellingRecommendations: z.object({
    bestPlatforms: z.array(z.string()),
    targetAudience: z.string(),
    keySellingPoints: z.array(z.string()),
    pricingStrategy: z.string(),
    listingOptimization: z.array(z.string()),
  }),
  confidence: z.object({
    analysisConfidence: z.number().min(0).max(1),
    dataQuality: z.number().min(0).max(1),
    marketDataReliability: z.number().min(0).max(1),
  }),
})

const ManifestStrategicInsightsSchema = z.object({
  executiveSummary: z.string(),
  manifestOverview: z.object({
    totalItems: z.number(),
    totalRetailValue: z.number(),
    estimatedLiquidationValue: z.number(),
    averageItemValue: z.number(),
    potentialProfit: z.number(),
    expectedROI: z.number(),
  }),
  categoryAnalysis: z.array(
    z.object({
      category: z.string(),
      itemCount: z.number(),
      totalValue: z.number(),
      averageValue: z.number(),
      profitPotential: z.string(),
      marketOutlook: z.string(),
      recommendedAction: z.string(),
    }),
  ),
  topOpportunities: z.array(
    z.object({
      productName: z.string(),
      estimatedProfit: z.number(),
      profitMargin: z.number(),
      riskLevel: z.string(),
      actionPlan: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
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
  marketTrends: z.array(
    z.object({
      trend: z.string(),
      impact: z.string(),
      affectedCategories: z.array(z.string()),
      timeframe: z.string(),
      actionRequired: z.string(),
    }),
  ),
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

export interface DeepAnalysisResult {
  id: string
  originalItem: EnhancedManifestItem
  deepAnalysis: z.infer<typeof ProductDeepAnalysisSchema>
  processingTime: number
}

export async function performEnhancedDeepResearch(
  item: EnhancedManifestItem,
  itemIndex: number,
): Promise<DeepAnalysisResult> {
  const startTime = Date.now()

  console.log(`🔬 DEEP RESEARCH - Item ${itemIndex}: "${item.product.substring(0, 50)}..."`)
  console.log(`   Retail Price: $${item.retailPrice} | Quantity: ${item.quantity} | Condition: ${item.condition}`)

  try {
    const deepAnalysis = await generateObject({
      model: openai("gpt-4o"),
      schema: ProductDeepAnalysisSchema,
      prompt: `Perform comprehensive deep market research and analysis for this liquidation item:

PRODUCT DETAILS:
- Product Description: "${item.product}"
- Retail Price: $${item.retailPrice}
- Quantity Available: ${item.quantity}
- Total Retail Value: $${item.totalRetailPrice}
- Condition: ${item.condition}

ANALYSIS REQUIREMENTS:

1. PRODUCT IDENTIFICATION & CATEGORIZATION:
   - Clean and standardize the product name
   - Identify brand, model, and specific product type
   - Categorize into appropriate retail categories
   - Extract any identifiable part numbers or specifications

2. COMPREHENSIVE MARKET RESEARCH:
   - Research current market prices across major platforms (Amazon, eBay, Walmart, Facebook Marketplace)
   - Analyze historical price trends and market demand
   - Estimate liquidation value (typically 10-30% of retail)
   - Assess wholesale market value
   - Evaluate market demand level and competition
   - Determine sales velocity and seasonality factors

3. CONDITION IMPACT ANALYSIS:
   - Analyze how the stated condition affects market value
   - Calculate condition-based price multipliers
   - Identify condition-related risks and opportunities
   - Provide realistic condition impact assessment

4. PROFITABILITY PROJECTION:
   - Calculate realistic selling price based on condition and market
   - Project potential profit margins
   - Estimate ROI based on liquidation purchase price
   - Recommend optimal selling strategy
   - Estimate time to sell

5. COMPREHENSIVE RISK ASSESSMENT:
   - Evaluate authenticity risks (counterfeits, gray market)
   - Assess market saturation and competition risks
   - Analyze condition-related risks
   - Evaluate demand stability and seasonal risks
   - Provide risk mitigation strategies

6. SELLING STRATEGY RECOMMENDATIONS:
   - Identify best platforms for selling this item
   - Define target customer segments
   - Highlight key selling points and value propositions
   - Recommend pricing strategy and listing optimization
   - Suggest marketing approaches

Provide realistic, data-driven analysis based on current market conditions and liquidation industry standards.`,
      system: `You are a senior liquidation market analyst with 20+ years of experience in retail arbitrage, wholesale buying, and resale operations. You have comprehensive knowledge of:

- Current market prices across all major e-commerce platforms
- Liquidation and wholesale market dynamics
- Brand reputation and authenticity markers
- Seasonal trends and consumer demand patterns
- Condition impact on resale values
- Platform-specific selling strategies
- Risk assessment for liquidation purchases

Your analysis should be:
- Realistic and conservative in profit projections
- Based on actual market conditions
- Focused on actionable insights
- Considering liquidation-specific factors
- Accounting for all associated costs and risks

Use your expertise to provide practical guidance that maximizes ROI while minimizing risks.`,
    })

    const processingTime = Date.now() - startTime

    console.log(`✅ Deep analysis completed for item ${itemIndex} in ${processingTime}ms`)
    console.log(`   Estimated Liquidation Value: $${deepAnalysis.object.marketAnalysis.liquidationEstimate}`)
    console.log(`   Risk Score: ${deepAnalysis.object.riskAssessment.overallRiskScore}/100`)
    console.log(`   Market Demand: ${deepAnalysis.object.marketAnalysis.marketDemandLevel}`)

    return {
      id: `deep-item-${itemIndex}`,
      originalItem: item,
      deepAnalysis: deepAnalysis.object,
      processingTime,
    }
  } catch (error) {
    console.error(`❌ Deep research failed for item ${itemIndex}:`, error)
    throw new Error(
      `Deep analysis failed for item ${itemIndex}: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function generateEnhancedManifestInsights(
  analysisResults: DeepAnalysisResult[],
): Promise<z.infer<typeof ManifestStrategicInsightsSchema>> {
  console.log(`🧠 Generating ENHANCED STRATEGIC INSIGHTS for ${analysisResults.length} analyzed items...`)

  try {
    // Prepare comprehensive analysis data
    const totalRetailValue = analysisResults.reduce((sum, result) => sum + result.originalItem.totalRetailPrice, 0)
    const totalLiquidationValue = analysisResults.reduce(
      (sum, result) => sum + result.deepAnalysis.marketAnalysis.liquidationEstimate,
      0,
    )
    const totalPotentialProfit = analysisResults.reduce(
      (sum, result) => sum + result.deepAnalysis.profitabilityProjection.estimatedProfit,
      0,
    )

    // Category breakdown
    const categoryBreakdown = analysisResults.reduce(
      (acc, result) => {
        const category = result.deepAnalysis.productIdentification.category
        if (!acc[category]) {
          acc[category] = { count: 0, totalValue: 0, totalProfit: 0 }
        }
        acc[category].count++
        acc[category].totalValue += result.deepAnalysis.marketAnalysis.liquidationEstimate
        acc[category].totalProfit += result.deepAnalysis.profitabilityProjection.estimatedProfit
        return acc
      },
      {} as Record<string, { count: number; totalValue: number; totalProfit: number }>,
    )

    // Risk distribution
    const riskDistribution = analysisResults.reduce(
      (acc, result) => {
        const risk = result.deepAnalysis.riskAssessment.overallRiskScore
        if (risk <= 30) acc.low++
        else if (risk <= 70) acc.medium++
        else acc.high++
        return acc
      },
      { low: 0, medium: 0, high: 0 },
    )

    // Top opportunities
    const topOpportunities = analysisResults
      .sort(
        (a, b) =>
          b.deepAnalysis.profitabilityProjection.estimatedProfit -
          a.deepAnalysis.profitabilityProjection.estimatedProfit,
      )
      .slice(0, 10)

    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ManifestStrategicInsightsSchema,
      prompt: `Analyze this liquidation manifest and provide comprehensive strategic business insights:

MANIFEST OVERVIEW:
- Total Items Analyzed: ${analysisResults.length}
- Total Retail Value: $${totalRetailValue.toFixed(2)}
- Total Estimated Liquidation Value: $${totalLiquidationValue.toFixed(2)}
- Total Potential Profit: $${totalPotentialProfit.toFixed(2)}
- Average Item Retail Value: $${(totalRetailValue / analysisResults.length).toFixed(2)}
- Estimated ROI: ${((totalPotentialProfit / totalLiquidationValue) * 100).toFixed(1)}%

CATEGORY BREAKDOWN:
${Object.entries(categoryBreakdown)
  .map(
    ([category, data]) =>
      `${category}: ${data.count} items, $${data.totalValue.toFixed(2)} value, $${data.totalProfit.toFixed(2)} profit`,
  )
  .join("\n")}

RISK DISTRIBUTION:
- Low Risk Items: ${riskDistribution.low}
- Medium Risk Items: ${riskDistribution.medium}  
- High Risk Items: ${riskDistribution.high}

TOP PROFIT OPPORTUNITIES:
${topOpportunities
  .slice(0, 5)
  .map(
    (result, index) =>
      `${index + 1}. ${result.deepAnalysis.productIdentification.cleanedProductName}
     Retail: $${result.originalItem.retailPrice} | Est. Profit: $${result.deepAnalysis.profitabilityProjection.estimatedProfit}
     Risk: ${result.deepAnalysis.riskAssessment.overallRiskScore}/100 | Demand: ${result.deepAnalysis.marketAnalysis.marketDemandLevel}`,
  )
  .join("\n")}

DETAILED ANALYSIS DATA:
${analysisResults
  .slice(0, 15)
  .map(
    (result) => `
- ${result.deepAnalysis.productIdentification.cleanedProductName}
  Category: ${result.deepAnalysis.productIdentification.category}
  Retail: $${result.originalItem.retailPrice} | Liquidation Est: $${result.deepAnalysis.marketAnalysis.liquidationEstimate}
  Profit: $${result.deepAnalysis.profitabilityProjection.estimatedProfit} (${result.deepAnalysis.profitabilityProjection.profitMargin}% margin)
  Risk: ${result.deepAnalysis.riskAssessment.overallRiskScore}/100 | Demand: ${result.deepAnalysis.marketAnalysis.marketDemandLevel}
  Best Platforms: ${result.deepAnalysis.sellingRecommendations.bestPlatforms.join(", ")}
`,
  )
  .join("")}

Provide comprehensive strategic analysis including:
1. Executive summary of manifest investment potential
2. Detailed financial overview and projections
3. Category-by-category performance analysis
4. Top profit opportunities with specific action plans
5. Comprehensive risk analysis and mitigation strategies
6. Market trend analysis and timing considerations
7. Strategic recommendations (immediate, short-term, long-term)
8. Financial projections (conservative, realistic, optimistic scenarios)

Focus on actionable insights for liquidation buyers and resellers to maximize ROI.`,
      system: `You are a senior liquidation investment strategist with 25+ years of experience in wholesale buying, retail arbitrage, and resale operations. You specialize in:

- Liquidation manifest evaluation and ROI optimization
- Multi-platform selling strategies and market analysis
- Risk assessment and mitigation for liquidation purchases
- Category-specific market trends and opportunities
- Financial modeling and cash flow projections
- Strategic planning for resale operations

Provide strategic, actionable insights that help liquidation buyers:
- Make informed investment decisions
- Maximize profit margins and ROI
- Minimize risks and potential losses
- Optimize inventory turnover and cash flow
- Develop effective selling strategies
- Plan operational and financial resources

Your analysis should be practical, data-driven, and focused on real-world execution in the liquidation and resale industry.`,
    })

    console.log(`✅ Enhanced strategic insights generated successfully`)
    return insights.object
  } catch (error) {
    console.error(`❌ Failed to generate enhanced insights:`, error)
    throw error
  }
}
