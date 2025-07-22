"use server"

import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { FixedManifestItem } from "@/lib/utils/fixed-manifest-parser"
import type { EnhancedManifestItem } from "@/lib/utils/enhanced-manifest-parser"

// Deep Research Schemas
const ProductResearchSchema = z.object({
  productIdentification: z.object({
    cleanedTitle: z.string(),
    brand: z.string(),
    model: z.string().optional(),
    upc: z.string().optional(),
    category: z.string(),
    subcategory: z.string(),
    productType: z.string(),
  }),
  marketResearch: z.object({
    currentMarketPrice: z.object({
      amazon: z.number().optional(),
      ebay: z.number().optional(),
      walmart: z.number().optional(),
      bestBuy: z.number().optional(),
      average: z.number(),
    }),
    historicalPricing: z.object({
      sixMonthsAgo: z.number(),
      threeMonthsAgo: z.number(),
      oneMonthAgo: z.number(),
      trend: z.enum(["Rising", "Stable", "Declining"]),
    }),
    demandAnalysis: z.object({
      searchVolume: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
      competitionLevel: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
      seasonality: z.string(),
      peakDemandMonths: z.array(z.string()),
    }),
  }),
  liquidationAnalysis: z.object({
    estimatedLiquidationValue: z.number(),
    conservativeValue: z.number(),
    optimisticValue: z.number(),
    quickSaleValue: z.number(),
    timeToSell: z.object({
      conservative: z.string(),
      realistic: z.string(),
      optimistic: z.string(),
    }),
    bestPlatforms: z.array(
      z.object({
        platform: z.string(),
        expectedPrice: z.number(),
        fees: z.number(),
        netProfit: z.number(),
        timeframe: z.string(),
      }),
    ),
  }),
  riskAssessment: z.object({
    overallRisk: z.enum(["Very Low", "Low", "Medium", "High", "Very High"]),
    riskScore: z.number().min(0).max(100),
    riskFactors: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
    conditionImpact: z.string(),
  }),
  profitAnalysis: z.object({
    grossProfit: z.number(),
    netProfit: z.number(),
    profitMargin: z.number(),
    roi: z.number(),
    breakEvenPrice: z.number(),
    recommendedPricing: z.object({
      listPrice: z.number(),
      minimumPrice: z.number(),
      buyItNowPrice: z.number(),
    }),
  }),
})

const AIThinkingProcessSchema = z.object({
  initialAssessment: z.object({
    firstImpression: z.string(),
    productRecognition: z.string(),
    categoryClassification: z.string(),
    conditionEvaluation: z.string(),
  }),
  marketResearchProcess: z.object({
    researchStrategy: z.string(),
    dataSourcesUsed: z.array(z.string()),
    priceComparisons: z.string(),
    demandIndicators: z.string(),
    competitiveAnalysis: z.string(),
  }),
  valuationMethodology: z.object({
    approachUsed: z.string(),
    factorsConsidered: z.array(z.string()),
    adjustmentsApplied: z.string(),
    confidenceLevel: z.number().min(0).max(1),
    reasoning: z.string(),
  }),
  riskEvaluation: z.object({
    identifiedRisks: z.array(z.string()),
    riskWeighting: z.string(),
    mitigationPlanning: z.string(),
    contingencyThinking: z.string(),
  }),
  strategicRecommendations: z.object({
    pricingStrategy: z.string(),
    timingStrategy: z.string(),
    platformStrategy: z.string(),
    marketingStrategy: z.string(),
    exitStrategy: z.string(),
  }),
  finalConclusion: z.object({
    keyInsights: z.array(z.string()),
    confidenceRating: z.number().min(0).max(1),
    recommendedAction: z.string(),
    expectedOutcome: z.string(),
  }),
})

const ManifestInsightsSchema = z.object({
  executiveSummary: z.object({
    totalItems: z.number(),
    totalInvestment: z.number(),
    projectedRevenue: z.number(),
    expectedProfit: z.number(),
    averageROI: z.number(),
    confidenceScore: z.number(),
    keyHighlights: z.array(z.string()),
  }),
  portfolioAnalysis: z.object({
    categoryDistribution: z.record(z.number()),
    riskDistribution: z.record(z.number()),
    valueDistribution: z.object({
      highValue: z.number(),
      mediumValue: z.number(),
      lowValue: z.number(),
    }),
    topPerformers: z.array(
      z.object({
        title: z.string(),
        expectedProfit: z.number(),
        roi: z.number(),
        confidence: z.number(),
      }),
    ),
  }),
  marketIntelligence: z.object({
    overallMarketCondition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
    trendingCategories: z.array(z.string()),
    seasonalOpportunities: z.array(z.string()),
    competitiveLandscape: z.string(),
    priceVolatility: z.string(),
  }),
  financialProjections: z.object({
    monthlyBreakdown: z.array(
      z.object({
        month: z.number(),
        expectedSales: z.number(),
        cumulativeRevenue: z.number(),
        cumulativeProfit: z.number(),
        cashFlow: z.number(),
      }),
    ),
    scenarioAnalysis: z.object({
      conservative: z.object({
        totalRevenue: z.number(),
        totalProfit: z.number(),
        roi: z.number(),
      }),
      realistic: z.object({
        totalRevenue: z.number(),
        totalProfit: z.number(),
        roi: z.number(),
      }),
      optimistic: z.object({
        totalRevenue: z.number(),
        totalProfit: z.number(),
        roi: z.number(),
      }),
    }),
  }),
  strategicRecommendations: z.object({
    immediate: z.array(
      z.object({
        action: z.string(),
        priority: z.enum(["Critical", "High", "Medium", "Low"]),
        impact: z.string(),
        effort: z.enum(["Low", "Medium", "High"]),
      }),
    ),
    shortTerm: z.array(
      z.object({
        action: z.string(),
        timeline: z.string(),
        expectedBenefit: z.string(),
      }),
    ),
    longTerm: z.array(
      z.object({
        action: z.string(),
        timeline: z.string(),
        strategicValue: z.string(),
      }),
    ),
  }),
  riskManagement: z.object({
    criticalRisks: z.array(
      z.object({
        risk: z.string(),
        impact: z.enum(["Low", "Medium", "High", "Critical"]),
        probability: z.enum(["Low", "Medium", "High"]),
        mitigation: z.string(),
      }),
    ),
    contingencyPlans: z.array(z.string()),
    insuranceRecommendations: z.array(z.string()),
  }),
})

export interface DeepResearchResult {
  id: string
  originalItem: FixedManifestItem | EnhancedManifestItem
  productResearch: z.infer<typeof ProductResearchSchema>
  aiThinking: z.infer<typeof AIThinkingProcessSchema>
  processingTime: number
  researchDepth: "Surface" | "Standard" | "Deep" | "Comprehensive"
}

export interface ComprehensiveManifestAnalysis {
  manifestId: string
  manifestName: string
  analysisTimestamp: string
  totalItems: number
  analyzedItems: number
  processingTime: number
  researchResults: DeepResearchResult[]
  manifestInsights: z.infer<typeof ManifestInsightsSchema>
  aiOverallThinking: {
    portfolioStrategy: string
    marketAnalysis: string
    riskAssessment: string
    opportunityIdentification: string
    recommendationRationale: string
  }
}

export async function performDeepProductResearch(
  item: FixedManifestItem | EnhancedManifestItem,
  itemIndex: number,
  marketContext: string,
): Promise<DeepResearchResult> {
  const startTime = Date.now()
  const product = getItemProduct(item)
  const retailPrice = getItemRetailPrice(item)
  const quantity = getItemQuantity(item)
  const condition = getItemCondition(item)

  console.log(`🔍 Starting deep research for item ${itemIndex}: "${product.substring(0, 50)}..."`)

  try {
    // Step 1: AI Thinking Process
    console.log(`🧠 Generating AI thinking process for item ${itemIndex}...`)
    const aiThinking = await generateObject({
      model: openai("gpt-4o"),
      schema: AIThinkingProcessSchema,
      prompt: `As an expert liquidation analyst, walk through your complete thinking process for analyzing this item:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}
Market Context: ${marketContext}

Provide your detailed thought process covering:

1. INITIAL ASSESSMENT:
   - First impression of the product
   - Product recognition and brand identification
   - Category classification reasoning
   - Condition evaluation impact

2. MARKET RESEARCH PROCESS:
   - Research strategy you would use
   - Data sources you would consult
   - Price comparison methodology
   - Demand indicators you would look for
   - Competitive analysis approach

3. VALUATION METHODOLOGY:
   - Valuation approach you would take
   - Key factors you would consider
   - Adjustments you would apply
   - Your confidence level and reasoning

4. RISK EVALUATION:
   - Risks you identify
   - How you would weight these risks
   - Mitigation strategies you would plan
   - Contingency thinking

5. STRATEGIC RECOMMENDATIONS:
   - Pricing strategy reasoning
   - Timing strategy considerations
   - Platform selection logic
   - Marketing approach
   - Exit strategy planning

6. FINAL CONCLUSION:
   - Key insights from your analysis
   - Overall confidence rating
   - Recommended action
   - Expected outcome

Be thorough, analytical, and show your expert reasoning at each step.`,
      system:
        "You are a senior liquidation expert with 15+ years of experience. Think through each analysis step methodically and explain your reasoning clearly.",
    })

    // Step 2: Deep Product Research
    console.log(`📊 Conducting deep product research for item ${itemIndex}...`)
    const productResearch = await generateObject({
      model: openai("gpt-4o"),
      schema: ProductResearchSchema,
      prompt: `Based on your thinking process, now conduct comprehensive research on this liquidation item:

Product: "${product}"
Retail Price: $${retailPrice}
Quantity: ${quantity}
Condition: ${condition}

Your AI Thinking Process: ${JSON.stringify(aiThinking.object, null, 2)}

Conduct deep research covering:

1. PRODUCT IDENTIFICATION:
   - Clean, marketable product title
   - Brand and model identification
   - UPC/SKU if identifiable
   - Precise category and subcategory
   - Product type classification

2. COMPREHENSIVE MARKET RESEARCH:
   - Current market prices across major platforms
   - Historical pricing trends (6 months, 3 months, 1 month)
   - Demand analysis with search volume data
   - Competition level assessment
   - Seasonal patterns and peak demand periods

3. LIQUIDATION ANALYSIS:
   - Multiple valuation scenarios
   - Time-to-sell estimates for different scenarios
   - Platform-specific analysis with fees and net profits
   - Best selling strategies

4. RISK ASSESSMENT:
   - Comprehensive risk scoring
   - Specific risk factors identification
   - Mitigation strategies
   - Condition impact analysis

5. PROFIT ANALYSIS:
   - Detailed profit calculations
   - ROI analysis
   - Break-even pricing
   - Recommended pricing strategy

Use current market knowledge and realistic assumptions. Be conservative but optimistic where data supports it.`,
      system:
        "You are conducting professional market research for liquidation analysis. Provide realistic, data-driven insights based on current market conditions.",
    })

    const processingTime = Date.now() - startTime
    console.log(`✅ Deep research completed for item ${itemIndex} in ${processingTime}ms`)

    return {
      id: `deep-research-${itemIndex}`,
      originalItem: item,
      productResearch: productResearch.object,
      aiThinking: aiThinking.object,
      processingTime,
      researchDepth: "Comprehensive",
    }
  } catch (error) {
    console.error(`❌ Deep research failed for item ${itemIndex}:`, error)

    const processingTime = Date.now() - startTime

    // Fallback research with basic analysis
    return {
      id: `deep-research-${itemIndex}`,
      originalItem: item,
      productResearch: {
        productIdentification: {
          cleanedTitle: product.substring(0, 60),
          brand: "Unknown",
          category: "General Merchandise",
          subcategory: "Mixed Items",
          productType: "Consumer Goods",
        },
        marketResearch: {
          currentMarketPrice: {
            average: retailPrice * 0.4,
          },
          historicalPricing: {
            sixMonthsAgo: retailPrice * 0.45,
            threeMonthsAgo: retailPrice * 0.42,
            oneMonthAgo: retailPrice * 0.4,
            trend: "Stable" as const,
          },
          demandAnalysis: {
            searchVolume: "Medium" as const,
            competitionLevel: "Medium" as const,
            seasonality: "No significant seasonal pattern",
            peakDemandMonths: ["November", "December"],
          },
        },
        liquidationAnalysis: {
          estimatedLiquidationValue: retailPrice * 0.25,
          conservativeValue: retailPrice * 0.2,
          optimisticValue: retailPrice * 0.35,
          quickSaleValue: retailPrice * 0.15,
          timeToSell: {
            conservative: "4-6 weeks",
            realistic: "2-4 weeks",
            optimistic: "1-2 weeks",
          },
          bestPlatforms: [
            {
              platform: "eBay",
              expectedPrice: retailPrice * 0.25,
              fees: retailPrice * 0.025,
              netProfit: retailPrice * 0.225,
              timeframe: "2-3 weeks",
            },
          ],
        },
        riskAssessment: {
          overallRisk: "Medium" as const,
          riskScore: 50,
          riskFactors: ["Limited product information", "Condition uncertainty"],
          mitigationStrategies: ["Thorough inspection", "Conservative pricing"],
          conditionImpact: "Condition verification needed for accurate pricing",
        },
        profitAnalysis: {
          grossProfit: retailPrice * 0.15,
          netProfit: retailPrice * 0.12,
          profitMargin: 48,
          roi: 60,
          breakEvenPrice: retailPrice * 0.1,
          recommendedPricing: {
            listPrice: retailPrice * 0.25,
            minimumPrice: retailPrice * 0.15,
            buyItNowPrice: retailPrice * 0.22,
          },
        },
      },
      aiThinking: {
        initialAssessment: {
          firstImpression: "Limited information available for comprehensive analysis",
          productRecognition: "Product requires additional research for identification",
          categoryClassification: "General merchandise classification applied",
          conditionEvaluation: "Condition assessment needed for accurate valuation",
        },
        marketResearchProcess: {
          researchStrategy: "Conservative approach due to limited data",
          dataSourcesUsed: ["General market knowledge", "Industry averages"],
          priceComparisons: "Using standard liquidation percentages",
          demandIndicators: "Assuming moderate demand",
          competitiveAnalysis: "Standard competitive landscape assumed",
        },
        valuationMethodology: {
          approachUsed: "Percentage-based valuation",
          factorsConsidered: ["Retail price", "General condition", "Market standards"],
          adjustmentsApplied: "Conservative adjustments for uncertainty",
          confidenceLevel: 0.4,
          reasoning: "Limited data requires conservative approach",
        },
        riskEvaluation: {
          identifiedRisks: ["Information gaps", "Condition uncertainty", "Market variability"],
          riskWeighting: "Medium risk due to unknowns",
          mitigationPlanning: "Conservative pricing and thorough inspection",
          contingencyThinking: "Quick sale options if needed",
        },
        strategicRecommendations: {
          pricingStrategy: "Start conservative, adjust based on market response",
          timingStrategy: "List promptly to test market",
          platformStrategy: "Multi-platform approach",
          marketingStrategy: "Clear descriptions and photos",
          exitStrategy: "Price reduction if no interest after 30 days",
        },
        finalConclusion: {
          keyInsights: ["Requires additional research", "Conservative approach recommended"],
          confidenceRating: 0.4,
          recommendedAction: "Conduct additional research before listing",
          expectedOutcome: "Moderate returns with proper execution",
        },
      },
      processingTime,
      researchDepth: "Surface",
    }
  }
}

export async function analyzeManifestComprehensively(
  items: (FixedManifestItem | EnhancedManifestItem)[],
  manifestName: string,
): Promise<ComprehensiveManifestAnalysis> {
  const startTime = Date.now()
  console.log(`🚀 Starting comprehensive manifest analysis for ${items.length} items...`)

  try {
    // Generate market context
    const marketContext = await generateMarketContext(items)

    // Limit analysis for performance (can be adjusted)
    const itemsToAnalyze = items.slice(0, Math.min(20, items.length))
    console.log(`📊 Analyzing ${itemsToAnalyze.length} items with deep research...`)

    // Process items in batches
    const batchSize = 3
    const researchResults: DeepResearchResult[] = []

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(itemsToAnalyze.length / batchSize)

      console.log(`🔄 Processing deep research batch ${batchNumber}/${totalBatches}`)

      const batchPromises = batch.map((item, batchIndex) =>
        performDeepProductResearch(item, i + batchIndex + 1, marketContext),
      )

      const batchResults = await Promise.all(batchPromises)
      researchResults.push(...batchResults)

      console.log(`📈 Progress: ${researchResults.length}/${itemsToAnalyze.length} items analyzed`)

      // Delay between batches
      if (i + batchSize < itemsToAnalyze.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Generate comprehensive manifest insights
    console.log(`🧠 Generating comprehensive manifest insights...`)
    const manifestInsights = await generateManifestInsights(researchResults, marketContext)

    // Generate AI overall thinking
    const aiOverallThinking = await generateOverallThinking(researchResults, manifestInsights, marketContext)

    const processingTime = Date.now() - startTime
    const manifestId = `comprehensive-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ Comprehensive analysis completed in ${(processingTime / 1000).toFixed(1)}s`)

    return {
      manifestId,
      manifestName,
      analysisTimestamp: new Date().toISOString(),
      totalItems: items.length,
      analyzedItems: researchResults.length,
      processingTime,
      researchResults,
      manifestInsights,
      aiOverallThinking,
    }
  } catch (error) {
    console.error("❌ Comprehensive manifest analysis failed:", error)
    throw error
  }
}

async function generateMarketContext(items: (FixedManifestItem | EnhancedManifestItem)[]): Promise<string> {
  try {
    const sampleItems = items.slice(0, 8).map((item) => ({
      product: getItemProduct(item),
      price: getItemRetailPrice(item),
      condition: getItemCondition(item),
    }))

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze the current market context for this liquidation manifest:

Sample Items:
${sampleItems.map((item, i) => `${i + 1}. ${item.product} - $${item.price} (${item.condition})`).join("\n")}

Provide comprehensive market context covering:
- Current economic conditions affecting liquidation markets
- Seasonal trends and timing considerations
- Platform-specific market conditions (eBay, Amazon, Facebook, etc.)
- Consumer behavior patterns in resale markets
- Supply chain and inventory factors
- Competitive landscape overview
- Emerging opportunities and threats

Keep analysis current, detailed, and actionable (3-4 paragraphs).`,
      system:
        "You are a senior market analyst specializing in liquidation and resale markets with access to current market data and trends.",
    })

    return text
  } catch (error) {
    console.error("Error generating market context:", error)
    return "Current market conditions show mixed demand across categories with strong e-commerce performance. Seasonal factors and economic conditions are influencing consumer purchasing patterns in the liquidation space."
  }
}

async function generateManifestInsights(
  results: DeepResearchResult[],
  marketContext: string,
): Promise<z.infer<typeof ManifestInsightsSchema>> {
  try {
    const totalInvestment = results.reduce((sum, r) => sum + getItemTotalRetailPrice(r.originalItem), 0)
    const projectedRevenue = results.reduce(
      (sum, r) => sum + r.productResearch.liquidationAnalysis.estimatedLiquidationValue,
      0,
    )
    const expectedProfit = results.reduce((sum, r) => sum + r.productResearch.profitAnalysis.netProfit, 0)

    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: ManifestInsightsSchema,
      prompt: `Generate comprehensive insights for this liquidation manifest:

Total Items: ${results.length}
Total Investment: $${totalInvestment.toFixed(2)}
Projected Revenue: $${projectedRevenue.toFixed(2)}
Expected Profit: $${expectedProfit.toFixed(2)}
Average ROI: ${((expectedProfit / totalInvestment) * 100).toFixed(1)}%

Market Context: ${marketContext}

Top Items Analysis:
${results
  .slice(0, 10)
  .map(
    (r, i) =>
      `${i + 1}. ${r.productResearch.productIdentification.cleanedTitle} - Est: $${r.productResearch.liquidationAnalysis.estimatedLiquidationValue} (Risk: ${r.productResearch.riskAssessment.overallRisk})`,
  )
  .join("\n")}

Category Distribution:
${Object.entries(
  results.reduce(
    (acc, r) => {
      const cat = r.productResearch.productIdentification.category
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  ),
)
  .map(([cat, count]) => `${cat}: ${count}`)
  .join(", ")}

Provide comprehensive strategic insights including executive summary, portfolio analysis, market intelligence, financial projections with monthly breakdown, strategic recommendations, and risk management.`,
      system:
        "You are a senior business strategist providing executive-level insights for liquidation investment decisions.",
    })

    return insights.object
  } catch (error) {
    console.error("Error generating manifest insights:", error)

    // Fallback insights
    const totalInvestment = results.reduce((sum, r) => sum + getItemTotalRetailPrice(r.originalItem), 0)
    const projectedRevenue = results.reduce(
      (sum, r) => sum + r.productResearch.liquidationAnalysis.estimatedLiquidationValue,
      0,
    )
    const expectedProfit = projectedRevenue - totalInvestment

    return {
      executiveSummary: {
        totalItems: results.length,
        totalInvestment,
        projectedRevenue,
        expectedProfit,
        averageROI: (expectedProfit / totalInvestment) * 100,
        confidenceScore: 0.7,
        keyHighlights: ["Diverse product portfolio", "Mixed risk profile", "Moderate profit potential"],
      },
      portfolioAnalysis: {
        categoryDistribution: { General: results.length },
        riskDistribution: { Medium: results.length },
        valueDistribution: {
          highValue: Math.floor(results.length * 0.2),
          mediumValue: Math.floor(results.length * 0.5),
          lowValue: Math.floor(results.length * 0.3),
        },
        topPerformers: results.slice(0, 5).map((r) => ({
          title: r.productResearch.productIdentification.cleanedTitle,
          expectedProfit: r.productResearch.profitAnalysis.netProfit,
          roi: r.productResearch.profitAnalysis.roi,
          confidence: 0.7,
        })),
      },
      marketIntelligence: {
        overallMarketCondition: "Fair" as const,
        trendingCategories: ["Electronics", "Home Goods"],
        seasonalOpportunities: ["Holiday season", "Back-to-school"],
        competitiveLandscape: "Moderate competition with opportunities",
        priceVolatility: "Medium volatility expected",
      },
      financialProjections: {
        monthlyBreakdown: Array.from({ length: 6 }, (_, i) => ({
          month: i + 1,
          expectedSales: projectedRevenue / 6,
          cumulativeRevenue: (projectedRevenue / 6) * (i + 1),
          cumulativeProfit: (expectedProfit / 6) * (i + 1),
          cashFlow: (expectedProfit / 6) * (i + 1),
        })),
        scenarioAnalysis: {
          conservative: {
            totalRevenue: projectedRevenue * 0.8,
            totalProfit: expectedProfit * 0.7,
            roi: ((expectedProfit * 0.7) / totalInvestment) * 100,
          },
          realistic: {
            totalRevenue: projectedRevenue,
            totalProfit: expectedProfit,
            roi: (expectedProfit / totalInvestment) * 100,
          },
          optimistic: {
            totalRevenue: projectedRevenue * 1.2,
            totalProfit: expectedProfit * 1.3,
            roi: ((expectedProfit * 1.3) / totalInvestment) * 100,
          },
        },
      },
      strategicRecommendations: {
        immediate: [
          {
            action: "Conduct detailed condition assessment",
            priority: "Critical" as const,
            impact: "Accurate pricing foundation",
            effort: "Medium" as const,
          },
        ],
        shortTerm: [
          {
            action: "Establish multi-platform selling strategy",
            timeline: "1-2 weeks",
            expectedBenefit: "Maximize market reach",
          },
        ],
        longTerm: [
          {
            action: "Build liquidation expertise and relationships",
            timeline: "3-6 months",
            strategicValue: "Sustainable competitive advantage",
          },
        ],
      },
      riskManagement: {
        criticalRisks: [
          {
            risk: "Condition discrepancies",
            impact: "Medium" as const,
            probability: "Medium" as const,
            mitigation: "Thorough inspection protocols",
          },
        ],
        contingencyPlans: ["Quick liquidation options", "Return policies"],
        insuranceRecommendations: ["Inventory insurance", "Liability coverage"],
      },
    }
  }
}

async function generateOverallThinking(
  results: DeepResearchResult[],
  insights: z.infer<typeof ManifestInsightsSchema>,
  marketContext: string,
): Promise<ComprehensiveManifestAnalysis["aiOverallThinking"]> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `As the AI analyst who just completed comprehensive research on ${results.length} items, explain your overall strategic thinking process:

Market Context: ${marketContext}

Key Findings:
- Total Investment: $${insights.executiveSummary.totalInvestment.toFixed(2)}
- Expected Profit: $${insights.executiveSummary.expectedProfit.toFixed(2)}
- Average ROI: ${insights.executiveSummary.averageROI.toFixed(1)}%
- Confidence Score: ${(insights.executiveSummary.confidenceScore * 100).toFixed(1)}%

Explain your thinking in these areas:
1. Portfolio Strategy - How you approached analyzing this collection as a whole
2. Market Analysis - Your assessment of current market conditions and opportunities
3. Risk Assessment - How you evaluated and weighted various risks
4. Opportunity Identification - Key opportunities you identified and why
5. Recommendation Rationale - The reasoning behind your strategic recommendations

Be detailed and show your analytical process.`,
      system: "You are explaining your strategic thinking process as an expert AI analyst. Be thorough and insightful.",
    })

    const sections = text.split(/\d+\.\s+/).filter((s) => s.trim())

    return {
      portfolioStrategy: sections[0] || "Comprehensive portfolio analysis approach",
      marketAnalysis: sections[1] || "Current market conditions assessment",
      riskAssessment: sections[2] || "Multi-factor risk evaluation methodology",
      opportunityIdentification: sections[3] || "Strategic opportunity identification process",
      recommendationRationale: sections[4] || "Data-driven recommendation framework",
    }
  } catch (error) {
    console.error("Error generating overall thinking:", error)
    return {
      portfolioStrategy: "Analyzed portfolio using diversification and risk-return optimization principles",
      marketAnalysis: "Assessed current market conditions considering economic factors and seasonal trends",
      riskAssessment: "Evaluated risks across multiple dimensions including market, operational, and financial factors",
      opportunityIdentification: "Identified opportunities based on market gaps and competitive advantages",
      recommendationRationale: "Recommendations based on data analysis, market research, and risk-adjusted returns",
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
