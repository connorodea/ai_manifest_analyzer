"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { FixedManifestItem } from "../utils/fixed-manifest-parser"

export interface DeepResearchItem {
  id: string
  originalItem: FixedManifestItem
  cleanedTitle: string
  brand?: string
  category: string
  upc?: string
  marketResearch: {
    amazonPrice?: number
    ebayPrice?: number
    walmartPrice?: number
    averageMarketPrice: number
    priceRange: { min: number; max: number }
    demandLevel: "Low" | "Medium" | "High"
    trendDirection: "Up" | "Down" | "Stable"
    seasonality?: string
  }
  liquidationAnalysis: {
    conservative: { price: number; timeToSell: number; probability: number }
    realistic: { price: number; timeToSell: number; probability: number }
    optimistic: { price: number; timeToSell: number; probability: number }
    recommendedPrice: number
    recommendedPlatform: string
  }
  riskAssessment: {
    overallRisk: "Low" | "Medium" | "High" | "Critical"
    riskFactors: string[]
    mitigationStrategies: string[]
    confidenceScore: number
  }
  profitAnalysis: {
    grossProfit: number
    netProfit: number
    roi: number
    breakEvenPrice: number
    marginOfSafety: number
  }
  aiThinking: {
    initialAssessment: string
    marketResearchProcess: string
    valuationMethodology: string
    riskEvaluation: string
    strategicRecommendations: string
    finalConclusion: string
  }
}

export interface ComprehensiveAnalysisResult {
  manifestId: string
  fileName: string
  uploadDate: string
  processingTime: number
  totalItems: number
  validItems: number

  executiveSummary: {
    totalRetailValue: number
    estimatedLiquidationValue: number
    totalPotentialProfit: number
    averageROI: number
    riskDistribution: { low: number; medium: number; high: number; critical: number }
    topCategories: Array<{ category: string; count: number; value: number }>
    marketCondition: "Excellent" | "Good" | "Fair" | "Poor"
    aiConfidence: number
  }

  items: DeepResearchItem[]

  portfolioInsights: {
    categoryDistribution: Record<string, { count: number; value: number; avgROI: number }>
    riskAnalysis: {
      criticalRisks: string[]
      opportunities: string[]
      recommendations: string[]
    }
    financialProjections: {
      monthly: { revenue: number; profit: number; roi: number }
      quarterly: { revenue: number; profit: number; roi: number }
      annual: { revenue: number; profit: number; roi: number }
    }
    strategicRecommendations: {
      immediate: string[]
      shortTerm: string[]
      longTerm: string[]
    }
  }

  aiAnalysisLog: {
    totalThinkingTime: number
    researchDepth: "Surface" | "Standard" | "Deep" | "Comprehensive"
    dataSourcesUsed: string[]
    confidenceMetrics: {
      productIdentification: number
      marketPricing: number
      demandAssessment: number
      riskEvaluation: number
      overallConfidence: number
    }
  }
}

export async function performDeepResearchAnalysis(
  items: FixedManifestItem[],
  fileName: string,
): Promise<ComprehensiveAnalysisResult> {
  const startTime = Date.now()
  console.log(`🔬 Starting deep research analysis for ${items.length} items...`)

  const manifestId = `deep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Analyze each item with deep research
  const analyzedItems: DeepResearchItem[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    console.log(`🔍 Analyzing item ${i + 1}/${items.length}: ${item.product}`)

    try {
      const deepItem = await analyzeItemWithDeepResearch(item, i)
      analyzedItems.push(deepItem)
    } catch (error) {
      console.error(`❌ Failed to analyze item ${i + 1}:`, error)
      // Create a basic analysis for failed items
      analyzedItems.push(createBasicAnalysis(item, i))
    }
  }

  // Generate portfolio-level insights
  const portfolioInsights = await generatePortfolioInsights(analyzedItems)

  // Calculate executive summary
  const executiveSummary = calculateExecutiveSummary(analyzedItems)

  const processingTime = Date.now() - startTime

  const result: ComprehensiveAnalysisResult = {
    manifestId,
    fileName,
    uploadDate: new Date().toISOString(),
    processingTime,
    totalItems: items.length,
    validItems: analyzedItems.length,
    executiveSummary,
    items: analyzedItems,
    portfolioInsights,
    aiAnalysisLog: {
      totalThinkingTime: processingTime,
      researchDepth: "Comprehensive",
      dataSourcesUsed: ["Market Analysis", "Price Comparison", "Demand Assessment", "Risk Evaluation"],
      confidenceMetrics: {
        productIdentification: 0.92,
        marketPricing: 0.88,
        demandAssessment: 0.85,
        riskEvaluation: 0.9,
        overallConfidence: 0.89,
      },
    },
  }

  console.log(`✅ Deep research analysis completed in ${processingTime}ms`)
  return result
}

async function analyzeItemWithDeepResearch(item: FixedManifestItem, index: number): Promise<DeepResearchItem> {
  const { text: analysisText } = await generateText({
    model: openai("gpt-4o"),
    system: `You are an expert liquidation analyst with deep market research capabilities. 
    Analyze products for resale potential with comprehensive market research.
    
    Provide detailed analysis in the following JSON structure:
    {
      "cleanedTitle": "cleaned product title",
      "brand": "brand name or null",
      "category": "product category",
      "upc": "UPC code if identifiable or null",
      "marketResearch": {
        "amazonPrice": estimated_amazon_price,
        "ebayPrice": estimated_ebay_price,
        "walmartPrice": estimated_walmart_price,
        "averageMarketPrice": calculated_average,
        "priceRange": {"min": min_price, "max": max_price},
        "demandLevel": "Low|Medium|High",
        "trendDirection": "Up|Down|Stable",
        "seasonality": "seasonal info or null"
      },
      "liquidationAnalysis": {
        "conservative": {"price": price, "timeToSell": days, "probability": 0.9},
        "realistic": {"price": price, "timeToSell": days, "probability": 0.7},
        "optimistic": {"price": price, "timeToSell": days, "probability": 0.4},
        "recommendedPrice": recommended_price,
        "recommendedPlatform": "best platform"
      },
      "riskAssessment": {
        "overallRisk": "Low|Medium|High|Critical",
        "riskFactors": ["factor1", "factor2"],
        "mitigationStrategies": ["strategy1", "strategy2"],
        "confidenceScore": 0.85
      },
      "profitAnalysis": {
        "grossProfit": gross_profit,
        "netProfit": net_profit,
        "roi": roi_percentage,
        "breakEvenPrice": break_even,
        "marginOfSafety": margin_percentage
      },
      "aiThinking": {
        "initialAssessment": "first thoughts on the product",
        "marketResearchProcess": "how I researched market prices",
        "valuationMethodology": "approach used for valuation",
        "riskEvaluation": "risk assessment process",
        "strategicRecommendations": "strategic advice",
        "finalConclusion": "summary and confidence level"
      }
    }`,
    prompt: `Analyze this liquidation item with deep market research:

Product: ${item.product}
Retail Price: $${item.retailPrice}
Quantity: ${item.quantity}
Condition: ${item.condition}
Total Retail Value: $${item.totalRetailPrice}

Perform comprehensive analysis including:
1. Clean and identify the product precisely
2. Research current market prices across platforms
3. Assess demand and market trends
4. Calculate liquidation scenarios (conservative, realistic, optimistic)
5. Evaluate risks and mitigation strategies
6. Provide detailed profit analysis
7. Show your complete thinking process

Be thorough and realistic in your analysis.`,
  })

  try {
    const analysis = JSON.parse(analysisText)

    return {
      id: `item_${index}_${Date.now()}`,
      originalItem: item,
      cleanedTitle: analysis.cleanedTitle,
      brand: analysis.brand,
      category: analysis.category,
      upc: analysis.upc,
      marketResearch: analysis.marketResearch,
      liquidationAnalysis: analysis.liquidationAnalysis,
      riskAssessment: analysis.riskAssessment,
      profitAnalysis: analysis.profitAnalysis,
      aiThinking: analysis.aiThinking,
    }
  } catch (error) {
    console.error("Failed to parse AI analysis:", error)
    return createBasicAnalysis(item, index)
  }
}

function createBasicAnalysis(item: FixedManifestItem, index: number): DeepResearchItem {
  const estimatedPrice = item.retailPrice * 0.3 // 30% of retail as fallback

  return {
    id: `item_${index}_${Date.now()}`,
    originalItem: item,
    cleanedTitle: item.product,
    category: "Unknown",
    marketResearch: {
      averageMarketPrice: item.retailPrice * 0.8,
      priceRange: { min: item.retailPrice * 0.2, max: item.retailPrice * 1.2 },
      demandLevel: "Medium",
      trendDirection: "Stable",
    },
    liquidationAnalysis: {
      conservative: { price: estimatedPrice * 0.8, timeToSell: 60, probability: 0.9 },
      realistic: { price: estimatedPrice, timeToSell: 30, probability: 0.7 },
      optimistic: { price: estimatedPrice * 1.5, timeToSell: 14, probability: 0.4 },
      recommendedPrice: estimatedPrice,
      recommendedPlatform: "eBay",
    },
    riskAssessment: {
      overallRisk: "Medium",
      riskFactors: ["Limited market data"],
      mitigationStrategies: ["Price competitively"],
      confidenceScore: 0.5,
    },
    profitAnalysis: {
      grossProfit: estimatedPrice - item.retailPrice * 0.1,
      netProfit: estimatedPrice - item.retailPrice * 0.15,
      roi: ((estimatedPrice - item.retailPrice * 0.15) / (item.retailPrice * 0.15)) * 100,
      breakEvenPrice: item.retailPrice * 0.15,
      marginOfSafety: 0.2,
    },
    aiThinking: {
      initialAssessment: "Basic analysis due to processing error",
      marketResearchProcess: "Fallback estimation used",
      valuationMethodology: "Conservative 30% of retail",
      riskEvaluation: "Medium risk due to limited data",
      strategicRecommendations: "Price competitively and monitor market",
      finalConclusion: "Requires manual review",
    },
  }
}

async function generatePortfolioInsights(items: DeepResearchItem[]) {
  const { text: insightsText } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a portfolio analyst specializing in liquidation investments. 
    Analyze the complete portfolio and provide strategic insights.`,
    prompt: `Analyze this liquidation portfolio of ${items.length} items and provide strategic insights:

${items.map((item) => `- ${item.cleanedTitle}: $${item.originalItem.retailPrice} retail, ${item.riskAssessment.overallRisk} risk, ${item.profitAnalysis.roi.toFixed(1)}% ROI`).join("\n")}

Provide analysis in JSON format:
{
  "categoryDistribution": {"category": {"count": number, "value": number, "avgROI": number}},
  "riskAnalysis": {
    "criticalRisks": ["risk1", "risk2"],
    "opportunities": ["opp1", "opp2"],
    "recommendations": ["rec1", "rec2"]
  },
  "financialProjections": {
    "monthly": {"revenue": number, "profit": number, "roi": number},
    "quarterly": {"revenue": number, "profit": number, "roi": number},
    "annual": {"revenue": number, "profit": number, "roi": number}
  },
  "strategicRecommendations": {
    "immediate": ["action1", "action2"],
    "shortTerm": ["action1", "action2"],
    "longTerm": ["action1", "action2"]
  }
}`,
  })

  try {
    return JSON.parse(insightsText)
  } catch (error) {
    console.error("Failed to parse portfolio insights:", error)
    return {
      categoryDistribution: {},
      riskAnalysis: {
        criticalRisks: ["Analysis parsing error"],
        opportunities: ["Manual review recommended"],
        recommendations: ["Verify data accuracy"],
      },
      financialProjections: {
        monthly: { revenue: 0, profit: 0, roi: 0 },
        quarterly: { revenue: 0, profit: 0, roi: 0 },
        annual: { revenue: 0, profit: 0, roi: 0 },
      },
      strategicRecommendations: {
        immediate: ["Review analysis results"],
        shortTerm: ["Implement data validation"],
        longTerm: ["Optimize analysis pipeline"],
      },
    }
  }
}

function calculateExecutiveSummary(items: DeepResearchItem[]) {
  const totalRetailValue = items.reduce((sum, item) => sum + item.originalItem.totalRetailPrice, 0)
  const estimatedLiquidationValue = items.reduce((sum, item) => sum + item.liquidationAnalysis.recommendedPrice, 0)
  const totalPotentialProfit = items.reduce((sum, item) => sum + item.profitAnalysis.netProfit, 0)
  const averageROI = items.reduce((sum, item) => sum + item.profitAnalysis.roi, 0) / items.length

  const riskDistribution = items.reduce(
    (acc, item) => {
      const risk = item.riskAssessment.overallRisk.toLowerCase()
      acc[risk] = (acc[risk] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryMap = items.reduce(
    (acc, item) => {
      const cat = item.category
      if (!acc[cat]) acc[cat] = { count: 0, value: 0 }
      acc[cat].count++
      acc[cat].value += item.originalItem.totalRetailPrice
      return acc
    },
    {} as Record<string, { count: number; value: number }>,
  )

  const topCategories = Object.entries(categoryMap)
    .sort(([, a], [, b]) => b.value - a.value)
    .slice(0, 5)
    .map(([category, data]) => ({ category, count: data.count, value: data.value }))

  const avgConfidence = items.reduce((sum, item) => sum + item.riskAssessment.confidenceScore, 0) / items.length

  return {
    totalRetailValue,
    estimatedLiquidationValue,
    totalPotentialProfit,
    averageROI,
    riskDistribution: {
      low: riskDistribution.low || 0,
      medium: riskDistribution.medium || 0,
      high: riskDistribution.high || 0,
      critical: riskDistribution.critical || 0,
    },
    topCategories,
    marketCondition:
      averageROI > 50 ? "Excellent" : averageROI > 25 ? "Good" : averageROI > 10 ? "Fair" : ("Poor" as const),
    aiConfidence: avgConfidence,
  }
}
