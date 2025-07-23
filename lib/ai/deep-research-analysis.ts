"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { runManifestValuationAgent, type ManifestValuationInput } from "./manifest-valuation-agent"

// Comprehensive analysis schemas
const ExecutiveSummarySchema = z.object({
  totalInvestment: z.number(),
  expectedProfit: z.number(),
  averageROI: z.number(),
  confidenceScore: z.number().min(0).max(1),
  marketCondition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  keyHighlights: z.array(z.string()).max(6),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  recommendedAction: z.enum(["Strong Buy", "Buy", "Hold", "Pass"]),
})

const AIThinkingProcessSchema = z.object({
  initialAssessment: z.object({
    firstImpressions: z.string(),
    categoryDistribution: z.string(),
    brandRecognition: z.string(),
    pricePointAnalysis: z.string(),
  }),
  marketResearchProcess: z.object({
    researchStrategy: z.string(),
    dataSourcesUsed: z.array(z.string()),
    competitiveAnalysis: z.string(),
    demandAssessment: z.string(),
  }),
  valuationMethodology: z.object({
    approachUsed: z.string(),
    factorsConsidered: z.array(z.string()),
    adjustmentsApplied: z.string(),
    confidenceRationale: z.string(),
  }),
  riskEvaluation: z.object({
    identifiedRisks: z.array(z.string()),
    riskWeighting: z.string(),
    mitigationStrategies: z.array(z.string()),
  }),
  strategicRecommendations: z.object({
    pricingStrategy: z.string(),
    timingConsiderations: z.string(),
    channelRecommendations: z.array(z.string()),
    marketingApproach: z.string(),
  }),
  finalConclusion: z.object({
    keyInsights: z.array(z.string()),
    confidenceRating: z.number().min(0).max(1),
    recommendedActions: z.array(z.string()),
  }),
})

const MarketIntelligenceSchema = z.object({
  overallMarketCondition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  trendingCategories: z.array(
    z.object({
      category: z.string(),
      trend: z.enum(["Rising", "Stable", "Declining"]),
      confidence: z.number().min(0).max(1),
    }),
  ),
  seasonalFactors: z.array(z.string()),
  competitiveLandscape: z.string(),
  priceVolatility: z.enum(["Low", "Medium", "High"]),
})

const FinancialProjectionsSchema = z.object({
  monthlyProjections: z.array(
    z.object({
      month: z.number(),
      projectedSales: z.number(),
      cumulativeProfit: z.number(),
      inventoryRemaining: z.number(),
    }),
  ),
  scenarioAnalysis: z.object({
    conservative: z.object({ profit: z.number(), roi: z.number(), timeline: z.string() }),
    realistic: z.object({ profit: z.number(), roi: z.number(), timeline: z.string() }),
    optimistic: z.object({ profit: z.number(), roi: z.number(), timeline: z.string() }),
  }),
  breakEvenAnalysis: z.object({
    breakEvenPoint: z.number(),
    timeToBreakEven: z.string(),
    marginOfSafety: z.number(),
  }),
})

const StrategicRecommendationsSchema = z.object({
  immediate: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(["Critical", "High", "Medium"]),
      timeline: z.string(),
      expectedImpact: z.string(),
    }),
  ),
  shortTerm: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      timeline: z.string(),
      expectedImpact: z.string(),
    }),
  ),
  longTerm: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      timeline: z.string(),
      expectedImpact: z.string(),
    }),
  ),
})

const RiskAssessmentSchema = z.object({
  criticalRisks: z.array(
    z.object({
      risk: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
      probability: z.enum(["High", "Medium", "Low"]),
      mitigation: z.string(),
    }),
  ),
  operationalRisks: z.array(
    z.object({
      risk: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
      mitigation: z.string(),
    }),
  ),
  marketRisks: z.array(
    z.object({
      risk: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
      mitigation: z.string(),
    }),
  ),
})

const ComprehensiveAnalysisSchema = z.object({
  manifestId: z.string(),
  fileName: z.string(),
  uploadDate: z.string(),
  processingTime: z.number(),
  validItems: z.number(),
  totalRetailValue: z.number(),
  manifestInsights: z.object({
    executiveSummary: ExecutiveSummarySchema,
    aiThinkingProcess: AIThinkingProcessSchema,
    marketIntelligence: MarketIntelligenceSchema,
    financialProjections: FinancialProjectionsSchema,
    strategicRecommendations: StrategicRecommendationsSchema,
    riskAssessment: RiskAssessmentSchema,
  }),
  valuationAgentResults: z.any(), // The raw output from the valuation agent
})

export type ComprehensiveAnalysisResult = z.infer<typeof ComprehensiveAnalysisSchema>

export async function performComprehensiveAnalysis(
  csvContent: string,
  fileName: string,
  options: {
    buyPctMsrp?: number
    feePct?: number
    shipPct?: number
    scenarioSalePcts?: number[]
  } = {},
): Promise<ComprehensiveAnalysisResult> {
  const startTime = Date.now()
  console.log("🚀 Starting comprehensive manifest analysis...")

  try {
    // Step 1: Run the core valuation agent
    const valuationInput: ManifestValuationInput = {
      manifest_csv: csvContent,
      buy_pct_msrp: options.buyPctMsrp || 0.1,
      fee_pct: options.feePct || 0.12,
      ship_pct: options.shipPct || 0.05,
      scenario_sale_pcts: options.scenarioSalePcts || [0.25, 0.3, 0.35],
      inbound_freight_est: 250,
      min_units_for_brand: 3,
    }

    console.log("🤖 Running valuation agent...")
    const valuationResults = await runManifestValuationAgent(valuationInput)

    // Step 2: Generate comprehensive insights using AI
    console.log("🧠 Generating comprehensive insights...")
    const manifestInsights = await generateComprehensiveInsights(valuationResults, csvContent)

    const processingTime = Date.now() - startTime
    const manifestId = `comprehensive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log(`✅ Comprehensive analysis completed in ${processingTime}ms`)

    return {
      manifestId,
      fileName,
      uploadDate: new Date().toISOString(),
      processingTime,
      validItems: valuationResults.manifest_snapshot.total_unique_skus,
      totalRetailValue: valuationResults.manifest_snapshot.aggregate_msrp,
      manifestInsights,
      valuationAgentResults: valuationResults,
    }
  } catch (error) {
    console.error("❌ Comprehensive analysis failed:", error)
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function generateComprehensiveInsights(valuationResults: any, csvContent: string) {
  console.log("🔍 Generating executive summary...")
  const executiveSummary = await generateExecutiveSummary(valuationResults)

  console.log("🧠 Generating AI thinking process...")
  const aiThinkingProcess = await generateAIThinkingProcess(valuationResults, csvContent)

  console.log("📊 Generating market intelligence...")
  const marketIntelligence = await generateMarketIntelligence(valuationResults)

  console.log("💰 Generating financial projections...")
  const financialProjections = await generateFinancialProjections(valuationResults)

  console.log("🎯 Generating strategic recommendations...")
  const strategicRecommendations = await generateStrategicRecommendations(valuationResults)

  console.log("⚠️ Generating risk assessment...")
  const riskAssessment = await generateRiskAssessment(valuationResults)

  return {
    executiveSummary,
    aiThinkingProcess,
    marketIntelligence,
    financialProjections,
    strategicRecommendations,
    riskAssessment,
  }
}

async function generateExecutiveSummary(valuationResults: any) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: ExecutiveSummarySchema,
    prompt: `Generate an executive summary for this liquidation manifest analysis:

Manifest Overview:
- Total SKUs: ${valuationResults.manifest_snapshot.total_unique_skus}
- Total Units: ${valuationResults.manifest_snapshot.total_units}
- Total MSRP: $${valuationResults.manifest_snapshot.aggregate_msrp}
- Purchase Cost: $${valuationResults.manifest_snapshot.purchase_cost}

Profit Scenarios:
${valuationResults.profit_scenarios
  .map(
    (s: any) =>
      `- ${(s.sale_pct_msrp * 100).toFixed(0)}% MSRP: $${s.net_profit} profit (${(s.roc * 100).toFixed(0)}% ROI)`,
  )
  .join("\n")}

Top Brands:
${valuationResults.brand_market_comps
  .slice(0, 5)
  .map((b: any) => `- ${b.brand}: ${b.unit_count} units (${(b.resale_pct_msrp_est * 100).toFixed(0)}% resale est.)`)
  .join("\n")}

Agent Verdict: ${valuationResults.verdict}

Provide a comprehensive executive summary with key metrics, market assessment, and strategic recommendations.`,
    system: "You are a senior liquidation analyst providing executive-level insights for investment decisions.",
  })

  return result.object
}

async function generateAIThinkingProcess(valuationResults: any, csvContent: string) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: AIThinkingProcessSchema,
    prompt: `Provide a detailed AI thinking process for analyzing this liquidation manifest:

Raw Data Preview:
${csvContent.split("\n").slice(0, 10).join("\n")}

Analysis Results:
- Verdict: ${valuationResults.verdict}
- ROI Range: ${Math.min(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}% - ${Math.max(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}%
- Brand Count: ${valuationResults.brand_market_comps.length}

Show the complete thought process from initial assessment through final recommendations, including:
1. First impressions and categorization
2. Market research methodology
3. Valuation approach and confidence factors
4. Risk identification and weighting
5. Strategic recommendations development
6. Final conclusions and action items

Be transparent about reasoning, assumptions, and confidence levels.`,
    system:
      "You are an AI system explaining your analytical thought process in detail for transparency and educational purposes.",
  })

  return result.object
}

async function generateMarketIntelligence(valuationResults: any) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: MarketIntelligenceSchema,
    prompt: `Analyze current market conditions for this liquidation manifest:

Brand Portfolio:
${valuationResults.brand_market_comps
  .map((b: any) => `- ${b.brand}: ${b.unit_count} units, ${(b.resale_pct_msrp_est * 100).toFixed(0)}% resale potential`)
  .join("\n")}

Operational Notes:
${valuationResults.operational_notes.join("\n")}

Provide comprehensive market intelligence including:
- Overall market condition assessment
- Category trends and opportunities
- Seasonal factors affecting sales
- Competitive landscape analysis
- Price volatility assessment

Focus on actionable market insights for liquidation success.`,
    system: "You are a market intelligence analyst specializing in secondary markets and liquidation channels.",
  })

  return result.object
}

async function generateFinancialProjections(valuationResults: any) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: FinancialProjectionsSchema,
    prompt: `Create detailed financial projections for this liquidation manifest:

Investment: $${valuationResults.manifest_snapshot.purchase_cost}
Total Inventory Value: $${valuationResults.manifest_snapshot.aggregate_msrp}

Profit Scenarios:
${valuationResults.profit_scenarios
  .map(
    (s: any) =>
      `- ${(s.sale_pct_msrp * 100).toFixed(0)}% MSRP: $${s.net_profit} profit (${(s.roc * 100).toFixed(0)}% ROI)`,
  )
  .join("\n")}

Generate:
1. Monthly sales projections (12 months)
2. Conservative/Realistic/Optimistic scenarios
3. Break-even analysis with timeline
4. Cash flow considerations

Base projections on typical liquidation sell-through rates and market conditions.`,
    system: "You are a financial analyst specializing in liquidation investment modeling and cash flow projections.",
  })

  return result.object
}

async function generateStrategicRecommendations(valuationResults: any) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: StrategicRecommendationsSchema,
    prompt: `Develop strategic recommendations for this liquidation manifest:

Verdict: ${valuationResults.verdict}
ROI Range: ${Math.min(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}% - ${Math.max(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}%

Top Brands:
${valuationResults.brand_market_comps
  .slice(0, 5)
  .map((b: any) => `- ${b.brand}: ${b.unit_count} units`)
  .join("\n")}

Operational Considerations:
${valuationResults.operational_notes.join("\n")}

Provide actionable recommendations in three timeframes:
1. Immediate (0-30 days): Critical actions for acquisition/setup
2. Short-term (1-6 months): Operational and sales execution
3. Long-term (6+ months): Portfolio optimization and scaling

Prioritize by impact and feasibility.`,
    system: "You are a liquidation strategy consultant providing actionable recommendations for profit maximization.",
  })

  return result.object
}

async function generateRiskAssessment(valuationResults: any) {
  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: RiskAssessmentSchema,
    prompt: `Conduct comprehensive risk assessment for this liquidation manifest:

Investment: $${valuationResults.manifest_snapshot.purchase_cost}
Expected ROI: ${Math.min(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}% - ${Math.max(...valuationResults.profit_scenarios.map((s: any) => s.roc * 100)).toFixed(0)}%

Brand Mix:
${valuationResults.brand_market_comps
  .map((b: any) => `- ${b.brand}: ${b.unit_count} units (${(b.resale_pct_msrp_est * 100).toFixed(0)}% est. resale)`)
  .join("\n")}

Operational Notes:
${valuationResults.operational_notes.join("\n")}

Identify and assess:
1. Critical risks that could significantly impact profitability
2. Operational risks in handling, storage, and fulfillment
3. Market risks including demand, competition, and pricing

For each risk, provide impact level, probability, and specific mitigation strategies.`,
    system: "You are a risk management specialist focusing on liquidation and resale business risks.",
  })

  return result.object
}
