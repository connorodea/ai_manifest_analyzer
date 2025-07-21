"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Enhanced schemas for deep research
const DeepProductResearchSchema = z.object({
  productIdentification: z.object({
    exactProductName: z.string(),
    manufacturer: z.string(),
    modelNumber: z.string(),
    upc: z.string().optional(),
    sku: z.string().optional(),
    productLine: z.string().optional(),
  }),
  marketResearch: z.object({
    currentRetailPrice: z.number(),
    amazonPrice: z.number().optional(),
    ebayAveragePrice: z.number().optional(),
    walmartPrice: z.number().optional(),
    bestBuyPrice: z.number().optional(),
    liquidationValue: z.number(),
    wholesaleValue: z.number(),
    marketDemandScore: z.number().min(1).max(100),
    competitionLevel: z.enum(["Low", "Medium", "High"]),
    salesVelocity: z.enum(["Slow", "Moderate", "Fast", "Very Fast"]),
  }),
  profitabilityAnalysis: z.object({
    estimatedProfit: z.number(),
    profitMargin: z.number(),
    roi: z.number(),
    breakEvenPrice: z.number(),
    recommendedSellingPrice: z.number(),
    timeToSell: z.string(),
  }),
  riskAssessment: z.object({
    overallRiskScore: z.number().min(1).max(100),
    authenticityRisk: z.number().min(1).max(100),
    marketSaturationRisk: z.number().min(1).max(100),
    seasonalityRisk: z.number().min(1).max(100),
    conditionRisk: z.number().min(1).max(100),
    brandReputationRisk: z.number().min(1).max(100),
    riskFactors: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
  }),
  marketIntelligence: z.object({
    trendAnalysis: z.string(),
    seasonalFactors: z.string(),
    competitorAnalysis: z.string(),
    priceHistory: z.string(),
    demandDrivers: z.array(z.string()),
    marketOpportunities: z.array(z.string()),
  }),
  sellingStrategy: z.object({
    bestPlatforms: z.array(z.string()),
    targetAudience: z.string(),
    keySellingPoints: z.array(z.string()),
    pricingStrategy: z.string(),
    marketingTips: z.array(z.string()),
  }),
  confidence: z.object({
    dataQuality: z.number().min(0).max(1),
    marketDataAccuracy: z.number().min(0).max(1),
    overallConfidence: z.number().min(0).max(1),
  }),
})

const ManifestDeepInsightsSchema = z.object({
  executiveSummary: z.string(),
  totalValueAnalysis: z.object({
    conservativeEstimate: z.number(),
    optimisticEstimate: z.number(),
    mostLikelyEstimate: z.number(),
    confidenceInterval: z.string(),
  }),
  categoryPerformance: z.array(
    z.object({
      category: z.string(),
      itemCount: z.number(),
      totalValue: z.number(),
      averageMargin: z.number(),
      riskLevel: z.string(),
      marketOutlook: z.string(),
    }),
  ),
  topOpportunities: z.array(
    z.object({
      item: z.string(),
      opportunity: z.string(),
      potentialProfit: z.number(),
      actionRequired: z.string(),
    }),
  ),
  riskAnalysis: z.object({
    majorRisks: z.array(z.string()),
    riskMitigation: z.array(z.string()),
    overallRiskScore: z.number(),
  }),
  marketTrends: z.array(
    z.object({
      trend: z.string(),
      impact: z.string(),
      timeframe: z.string(),
    }),
  ),
  actionPlan: z.object({
    immediateActions: z.array(z.string()),
    shortTermStrategy: z.array(z.string()),
    longTermStrategy: z.array(z.string()),
  }),
  profitabilityForecast: z.object({
    expectedROI: z.number(),
    timeToLiquidate: z.string(),
    cashFlowProjection: z.string(),
  }),
})

export interface DeepResearchItem {
  id: string
  rowNumber: number
  originalDescription: string
  listPrice: number
  deepResearch: z.infer<typeof DeepProductResearchSchema>
}

export async function performDeepProductResearch(
  description: string,
  listPrice: number,
  rowNumber: number,
): Promise<DeepResearchItem> {
  console.log(`🔬 Starting DEEP RESEARCH for item ${rowNumber}: "${description.substring(0, 50)}..."`)

  try {
    const deepResearch = await generateObject({
      model: openai("gpt-4o"),
      schema: DeepProductResearchSchema,
      prompt: `Perform comprehensive market research and analysis for this liquidation item:

PRODUCT DETAILS:
- Description: "${description}"
- Listed Price: $${listPrice}

RESEARCH REQUIREMENTS:
Conduct deep analysis covering:

1. PRODUCT IDENTIFICATION:
   - Identify exact product name, manufacturer, model
   - Find UPC, SKU, product line if possible
   - Verify product authenticity markers

2. COMPREHENSIVE MARKET RESEARCH:
   - Current retail prices across major platforms (Amazon, eBay, Walmart, Best Buy)
   - Historical price trends and patterns
   - Liquidation market values and wholesale pricing
   - Market demand analysis and sales velocity
   - Competition level assessment

3. PROFITABILITY ANALYSIS:
   - Calculate potential profit margins
   - Determine ROI scenarios (conservative, optimistic, realistic)
   - Estimate time to sell and cash flow impact
   - Recommend optimal selling price

4. RISK ASSESSMENT:
   - Authenticity and counterfeit risks
   - Market saturation analysis
   - Seasonal demand fluctuations
   - Brand reputation factors
   - Condition-related risks

5. MARKET INTELLIGENCE:
   - Current market trends affecting this product
   - Seasonal factors and timing considerations
   - Competitor landscape analysis
   - Price history and volatility
   - Demand drivers and market opportunities

6. SELLING STRATEGY:
   - Best platforms for selling (eBay, Amazon, Facebook, etc.)
   - Target audience identification
   - Key selling points and marketing angles
   - Pricing strategy recommendations

Provide realistic, data-driven analysis based on current market conditions.`,
      system: `You are a senior market research analyst specializing in liquidation and resale markets. You have access to comprehensive market data across all major e-commerce platforms, auction sites, and wholesale markets. 

Your analysis should be:
- Data-driven and realistic
- Based on current market conditions
- Focused on actionable insights
- Considering liquidation-specific factors
- Accounting for condition and authenticity issues

Use your knowledge of:
- Amazon, eBay, Facebook Marketplace pricing
- Wholesale and liquidation market dynamics
- Brand reputation and authenticity markers
- Seasonal trends and market cycles
- Consumer demand patterns
- Reseller profit margins and strategies`,
    })

    console.log(`✅ Deep research completed for item ${rowNumber}`)

    return {
      id: `deep-item-${rowNumber}`,
      rowNumber,
      originalDescription: description,
      listPrice,
      deepResearch: deepResearch.object,
    }
  } catch (error) {
    console.error(`❌ Deep research failed for item ${rowNumber}:`, error)
    throw error
  }
}

export async function generateManifestDeepInsights(
  items: DeepResearchItem[],
): Promise<z.infer<typeof ManifestDeepInsightsSchema>> {
  console.log(`🧠 Generating DEEP MANIFEST INSIGHTS for ${items.length} items...`)

  try {
    const totalListValue = items.reduce((sum, item) => sum + item.listPrice, 0)
    const totalEstimatedValue = items.reduce((sum, item) => sum + item.deepResearch.marketResearch.liquidationValue, 0)

    // Prepare comprehensive data for analysis
    const analysisData = {
      totalItems: items.length,
      totalListValue,
      totalEstimatedValue,
      averageItemValue: totalEstimatedValue / items.length,
      categories: items.reduce(
        (acc, item) => {
          const category = item.deepResearch.productIdentification.manufacturer || "Unknown"
          acc[category] = (acc[category] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      highValueItems: items.filter((item) => item.deepResearch.marketResearch.liquidationValue > 200).length,
      highRiskItems: items.filter((item) => item.deepResearch.riskAssessment.overallRiskScore > 70).length,
      fastMovingItems: items.filter(
        (item) =>
          item.deepResearch.marketResearch.salesVelocity === "Fast" ||
          item.deepResearch.marketResearch.salesVelocity === "Very Fast",
      ).length,
    }

    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ManifestDeepInsightsSchema,
      prompt: `Analyze this liquidation manifest and provide comprehensive strategic insights:

MANIFEST OVERVIEW:
- Total Items: ${analysisData.totalItems}
- Total List Value: $${totalListValue.toFixed(2)}
- Total Estimated Liquidation Value: $${totalEstimatedValue.toFixed(2)}
- Average Item Value: $${analysisData.averageItemValue.toFixed(2)}
- High Value Items (>$200): ${analysisData.highValueItems}
- High Risk Items: ${analysisData.highRiskItems}
- Fast Moving Items: ${analysisData.fastMovingItems}

DETAILED ITEM ANALYSIS:
${items
  .slice(0, 15)
  .map(
    (item) => `
- ${item.deepResearch.productIdentification.exactProductName}
  List: $${item.listPrice} | Liquidation: $${item.deepResearch.marketResearch.liquidationValue}
  Profit: $${item.deepResearch.profitabilityAnalysis.estimatedProfit} (${item.deepResearch.profitabilityAnalysis.profitMargin}% margin)
  Risk: ${item.deepResearch.riskAssessment.overallRiskScore}/100
  Demand: ${item.deepResearch.marketResearch.marketDemandScore}/100
  Sales Velocity: ${item.deepResearch.marketResearch.salesVelocity}
`,
  )
  .join("")}

CATEGORY BREAKDOWN:
${Object.entries(analysisData.categories)
  .map(([cat, count]) => `${cat}: ${count} items`)
  .join(", ")}

Provide strategic analysis including:
1. Executive summary of manifest potential
2. Conservative, optimistic, and realistic value estimates
3. Category performance analysis
4. Top profit opportunities with specific action plans
5. Risk analysis and mitigation strategies
6. Market trends impact assessment
7. Detailed action plan (immediate, short-term, long-term)
8. Profitability forecast and cash flow projections

Focus on actionable insights for maximizing ROI in liquidation resale.`,
      system: `You are a senior liquidation strategist with 20+ years of experience in wholesale buying, retail arbitrage, and resale operations. 

Provide strategic, actionable insights that help liquidation buyers:
- Maximize profit margins and ROI
- Minimize risks and losses
- Optimize inventory turnover
- Identify market opportunities
- Develop effective selling strategies
- Plan cash flow and operations

Your analysis should be practical, data-driven, and focused on real-world execution.`,
    })

    console.log(`✅ Deep manifest insights generated`)
    return insights.object
  } catch (error) {
    console.error(`❌ Failed to generate deep insights:`, error)
    throw error
  }
}
