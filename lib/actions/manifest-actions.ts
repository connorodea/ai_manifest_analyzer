"use server"

import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/session"
import {
  analyzeEnhancedManifestWithDeepResearch,
  type EnhancedManifestAnalysisResult,
} from "@/lib/ai/enhanced-manifest-analyzer"

// In-memory storage for demo - in production, use a database
const manifestStorage = new Map<string, EnhancedManifestAnalysisResult>()

export async function uploadManifest(formData: FormData) {
  try {
    // Verify user is authenticated
    const session = await verifySession()

    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as string

    console.log(`📤 Upload request received:`)
    console.log(`   - File name: ${file?.name}`)
    console.log(`   - Manifest name: ${name}`)
    console.log(`   - File type: ${type}`)
    console.log(`   - Content length: ${content?.length} characters`)
    console.log(`   - User: ${session.userId}`)

    if (!file || !name || !content) {
      throw new Error("Missing required fields")
    }

    // More flexible file type validation
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ]

    const isCSV = type === "text/csv" || type.includes("csv") || file.name.toLowerCase().endsWith(".csv")

    if (!validTypes.includes(type) && !isCSV) {
      console.log(`❌ Invalid file type: ${type}`)
      throw new Error("Unsupported file type. Please upload a CSV, Excel, or PDF file.")
    }

    // Override type detection for CSV files
    const finalType = isCSV ? "text/csv" : type
    console.log(`📋 Final file type for processing: ${finalType}`)

    console.log(`🚀 Starting ENHANCED DEEP RESEARCH ANALYSIS for manifest: ${name}`)

    // Perform enhanced deep research analysis
    const analysisResult = await analyzeEnhancedManifestWithDeepResearch(content, finalType, name)

    // Store the analysis result
    manifestStorage.set(analysisResult.manifestId, analysisResult)

    console.log(`✅ Enhanced deep analysis completed for manifest: ${analysisResult.manifestId}`)
    console.log(`📊 Analysis Summary:`)
    console.log(`   - Items Analyzed: ${analysisResult.totalItems}`)
    console.log(`   - Total Retail Value: $${analysisResult.totalRetailValue.toFixed(2)}`)
    console.log(`   - Total Liquidation Value: $${analysisResult.totalLiquidationValue.toFixed(2)}`)
    console.log(`   - Total Potential Profit: $${analysisResult.totalPotentialProfit.toFixed(2)}`)
    console.log(`   - Expected ROI: ${analysisResult.summary.expectedROI.toFixed(1)}%`)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/manifests")

    return {
      success: true,
      id: analysisResult.manifestId,
      name,
      status: "completed",
      analysisResult,
    }
  } catch (error) {
    console.error("❌ Error uploading and analyzing manifest:", error)
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload and analyze manifest",
    }
  }
}

export async function getManifestById(id: string) {
  // Get from storage
  const manifest = manifestStorage.get(id)

  if (!manifest) {
    // Return mock data if not found (for demo purposes)
    return {
      id,
      name: "Sample Manifest",
      status: "completed",
      totalItems: 0,
      estimatedValue: 0,
      createdAt: new Date().toISOString(),
      confidence: 0,
    }
  }

  return {
    id: manifest.manifestId,
    name: manifest.manifestName,
    status: "completed",
    totalItems: manifest.totalItems,
    estimatedValue: manifest.totalLiquidationValue,
    createdAt: new Date().toISOString(),
    confidence: 0.95, // High confidence for enhanced deep research
    analysisResult: manifest,
  }
}

export async function getManifestItems(manifestId: string) {
  const manifest = manifestStorage.get(manifestId)

  if (!manifest) {
    return []
  }

  return manifest.analysisResults.map((result) => ({
    id: result.id,
    title: result.deepAnalysis.productIdentification.cleanedProductName,
    category: result.deepAnalysis.productIdentification.category,
    condition: result.originalItem.condition,
    estimatedValue: result.deepAnalysis.marketAnalysis.liquidationEstimate,
    marketValue: result.deepAnalysis.marketAnalysis.currentMarketPrice,
    riskScore: result.deepAnalysis.riskAssessment.overallRiskScore,
    brand: result.deepAnalysis.productIdentification.brand,
    model: result.deepAnalysis.productIdentification.model,
    originalDescription: result.originalItem.product,
    riskFactors: result.deepAnalysis.riskAssessment.riskFactors,
    aiReasoning: {
      categorization: `Enhanced deep research analysis - ${result.deepAnalysis.confidence.analysisConfidence * 100}% confidence`,
      valuation: `Market analysis: ${result.deepAnalysis.marketAnalysis.marketDemandLevel} demand, ${result.deepAnalysis.marketAnalysis.competitionLevel} competition`,
      risk: result.deepAnalysis.riskAssessment.riskFactors.join(", "),
    },
    deepResearch: result.deepAnalysis, // Include full deep research data
    profitProjection: result.deepAnalysis.profitabilityProjection,
    sellingRecommendations: result.deepAnalysis.sellingRecommendations,
  }))
}

export async function getManifestAnalysis(manifestId: string): Promise<any> {
  const manifest = manifestStorage.get(manifestId)

  if (!manifest) {
    return null
  }

  // Transform the enhanced analysis result to match the expected interface
  return {
    manifestId: manifest.manifestId,
    totalItems: manifest.totalItems,
    estimatedTotalValue: manifest.totalLiquidationValue,
    processingTime: manifest.processingTime,
    aiConfidenceScore: 0.95,
    categoryBreakdown: manifest.summary.categoryBreakdown,
    riskBreakdown: manifest.summary.riskDistribution,
    insights: {
      summary: manifest.strategicInsights.executiveSummary,
      opportunities: manifest.strategicInsights.topOpportunities.map((opp: any) => opp.actionPlan),
      risks: manifest.strategicInsights.riskAnalysis.majorRisks,
      marketTrends: manifest.strategicInsights.marketTrends.map((trend: any) => trend.trend),
      recommendations: manifest.strategicInsights.strategicRecommendations.immediateActions,
      profitabilityScore: Math.round(manifest.summary.expectedROI),
    },
    enhancedData: manifest, // Include full enhanced analysis
  }
}

export async function getAllManifests(userId: string) {
  // In a real app, filter by userId from database
  const manifests = Array.from(manifestStorage.values()).map((manifest) => ({
    id: manifest.manifestId,
    name: manifest.manifestName,
    status: "completed",
    totalItems: manifest.totalItems,
    estimatedValue: manifest.totalLiquidationValue,
    createdAt: new Date().toISOString(),
    confidence: 0.95, // High confidence for enhanced deep research
  }))

  // Add some mock manifests if storage is empty for demo purposes
  if (manifests.length === 0) {
    return [
      {
        id: "demo-manifest-1",
        name: "Sample Electronics Pallet",
        status: "completed",
        totalItems: 45,
        estimatedValue: 8750.25,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        confidence: 0.89,
      },
      {
        id: "demo-manifest-2",
        name: "Home Goods Returns Lot",
        status: "completed",
        totalItems: 78,
        estimatedValue: 12340.5,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        confidence: 0.92,
      },
    ]
  }

  return manifests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
