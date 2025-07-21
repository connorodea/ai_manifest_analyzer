"use server"

import {
  parseEnhancedManifestCSV,
  validateManifestStructure,
  type EnhancedManifestItem,
} from "@/lib/utils/enhanced-manifest-parser"
import {
  performEnhancedDeepResearch,
  generateEnhancedManifestInsights,
  type DeepAnalysisResult,
} from "@/lib/ai/enhanced-deep-research"

export interface EnhancedManifestAnalysisResult {
  manifestId: string
  manifestName: string
  totalItems: number
  totalRetailValue: number
  totalLiquidationValue: number
  totalPotentialProfit: number
  processingTime: number
  analysisResults: DeepAnalysisResult[]
  strategicInsights: any // Will be typed from the schema
  manifestValidation: {
    isValid: boolean
    issues: string[]
    stats: any
  }
  summary: {
    averageItemValue: number
    averageProfit: number
    averageMargin: number
    expectedROI: number
    highValueItems: number
    fastMovingItems: number
    riskDistribution: {
      low: number
      medium: number
      high: number
    }
    categoryBreakdown: Record<string, number>
  }
}

export async function analyzeEnhancedManifestWithDeepResearch(
  fileContent: string,
  fileType: string,
  manifestName: string,
): Promise<EnhancedManifestAnalysisResult> {
  const startTime = Date.now()
  console.log(`🚀 Starting ENHANCED DEEP RESEARCH ANALYSIS for manifest: ${manifestName}`)

  try {
    // Parse the manifest with the enhanced parser
    let parsedItems: EnhancedManifestItem[] = []

    console.log(`📋 File type detected: ${fileType}`)
    console.log(`📋 File content length: ${fileContent.length} characters`)
    console.log(`📋 File content preview: ${fileContent.substring(0, 100)}...`)

    // More flexible file type checking
    if (fileType === "text/csv" || fileType.includes("csv") || fileContent.includes(",")) {
      console.log(`📋 Processing as CSV file`)
      parsedItems = await parseEnhancedManifestCSV(fileContent)
    } else {
      console.log(`❌ Unsupported file type: ${fileType}`)
      throw new Error(`Currently only CSV files are supported for enhanced deep analysis. Detected type: ${fileType}`)
    }

    if (parsedItems.length === 0) {
      throw new Error("No valid items found in the manifest file")
    }

    // Validate manifest structure and quality
    const validation = validateManifestStructure(parsedItems)
    console.log(`📊 Manifest validation:`, validation.isValid ? "PASSED" : "ISSUES FOUND")
    if (validation.issues.length > 0) {
      console.log(`⚠️ Validation issues:`, validation.issues)
    }

    console.log(`📊 Found ${parsedItems.length} items for enhanced deep research analysis`)
    console.log(`💰 Total retail value: $${validation.stats.totalRetailValue.toFixed(2)}`)

    // Process items with enhanced deep research (smaller batches for API limits)
    const batchSize = 2 // Very small batches for deep research to respect API limits
    const analysisResults: DeepAnalysisResult[] = []

    // Limit to first 20 items for demo to avoid excessive API usage
    const itemsToAnalyze = parsedItems.slice(0, Math.min(20, parsedItems.length))
    console.log(`🔬 Analyzing first ${itemsToAnalyze.length} items with deep research...`)

    for (let i = 0; i < itemsToAnalyze.length; i += batchSize) {
      const batch = itemsToAnalyze.slice(i, i + batchSize)
      console.log(
        `🔬 Processing enhanced deep research batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(itemsToAnalyze.length / batchSize)}`,
      )

      const batchPromises = batch.map((item, batchIndex) => performEnhancedDeepResearch(item, i + batchIndex + 1))

      const batchResults = await Promise.all(batchPromises)
      analysisResults.push(...batchResults)

      // Longer delay for deep research to respect API limits
      if (i + batchSize < itemsToAnalyze.length) {
        console.log(`⏳ Waiting 3 seconds before next enhanced deep research batch...`)
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }

    console.log(`🧠 Generating comprehensive strategic insights...`)

    // Generate enhanced strategic insights
    const strategicInsights = await generateEnhancedManifestInsights(analysisResults)

    // Calculate comprehensive summary statistics
    const totalRetailValue = analysisResults.reduce((sum, result) => sum + result.originalItem.totalRetailPrice, 0)
    const totalLiquidationValue = analysisResults.reduce(
      (sum, result) => sum + result.deepAnalysis.marketAnalysis.liquidationEstimate,
      0,
    )
    const totalPotentialProfit = analysisResults.reduce(
      (sum, result) => sum + result.deepAnalysis.profitabilityProjection.estimatedProfit,
      0,
    )

    const highValueItems = analysisResults.filter(
      (result) => result.deepAnalysis.marketAnalysis.liquidationEstimate > 100,
    ).length

    const fastMovingItems = analysisResults.filter(
      (result) =>
        result.deepAnalysis.marketAnalysis.salesVelocity === "Fast" ||
        result.deepAnalysis.marketAnalysis.salesVelocity === "Very Fast",
    ).length

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

    const categoryBreakdown = analysisResults.reduce(
      (acc, result) => {
        const category = result.deepAnalysis.productIdentification.category
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const processingTime = Date.now() - startTime
    const manifestId = `enhanced-manifest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    console.log(`✅ ENHANCED DEEP ANALYSIS COMPLETED in ${processingTime}ms`)
    console.log(`💰 Total Retail Value: $${totalRetailValue.toFixed(2)}`)
    console.log(`📈 Total Liquidation Value: $${totalLiquidationValue.toFixed(2)}`)
    console.log(`🎯 Total Potential Profit: $${totalPotentialProfit.toFixed(2)}`)
    console.log(`📊 Expected ROI: ${((totalPotentialProfit / totalLiquidationValue) * 100).toFixed(1)}%`)

    return {
      manifestId,
      manifestName,
      totalItems: analysisResults.length,
      totalRetailValue,
      totalLiquidationValue,
      totalPotentialProfit,
      processingTime,
      analysisResults,
      strategicInsights,
      manifestValidation: validation,
      summary: {
        averageItemValue: totalLiquidationValue / analysisResults.length,
        averageProfit: totalPotentialProfit / analysisResults.length,
        averageMargin: (totalPotentialProfit / totalLiquidationValue) * 100,
        expectedROI: (totalPotentialProfit / totalLiquidationValue) * 100,
        highValueItems,
        fastMovingItems,
        riskDistribution,
        categoryBreakdown,
      },
    }
  } catch (error) {
    console.error("❌ Enhanced deep research analysis failed:", error)
    throw new Error(`Enhanced deep analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
