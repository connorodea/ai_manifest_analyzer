"use server"

import { performComprehensiveAnalysis, type ComprehensiveAnalysisResult } from "@/lib/ai/deep-research-analysis"

// In-memory storage for demo - in production, use a database
const comprehensiveStorage = new Map<string, ComprehensiveAnalysisResult>()

export async function uploadComprehensiveManifest(formData: FormData) {
  try {
    console.log("🚀 Starting comprehensive manifest upload...")

    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    console.log(`📁 Processing file: ${file.name} (${file.size} bytes)`)

    // Read file content
    const content = await file.text()
    console.log(`📄 File content length: ${content.length} characters`)

    // Perform comprehensive analysis
    const analysis = await performComprehensiveAnalysis(content, file.name)

    // Store the analysis
    comprehensiveStorage.set(analysis.manifestId, analysis)

    console.log(`✅ Comprehensive analysis completed and stored: ${analysis.manifestId}`)

    return {
      success: true,
      result: analysis,
    }
  } catch (error) {
    console.error("❌ Comprehensive upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function getComprehensiveManifestById(id: string): Promise<ComprehensiveAnalysisResult> {
  try {
    const analysis = comprehensiveStorage.get(id)
    if (!analysis) {
      throw new Error("Comprehensive analysis not found")
    }

    return analysis
  } catch (error) {
    console.error("Error getting comprehensive manifest:", error)
    throw error
  }
}

export async function getAllComprehensiveManifests(userId = "demo_user") {
  try {
    const userAnalyses = Array.from(comprehensiveStorage.values())
      .filter(() => true) // In production, filter by userId
      .map((analysis) => ({
        id: analysis.manifestId,
        fileName: analysis.fileName,
        uploadDate: analysis.uploadDate,
        processingTime: analysis.processingTime,
        validItems: analysis.validItems,
        totalRetailValue: analysis.totalRetailValue,
        expectedProfit: analysis.manifestInsights.executiveSummary.expectedProfit,
        averageROI: analysis.manifestInsights.executiveSummary.averageROI,
        recommendedAction: analysis.manifestInsights.executiveSummary.recommendedAction,
        confidenceScore: analysis.manifestInsights.executiveSummary.confidenceScore,
      }))
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

    return userAnalyses
  } catch (error) {
    console.error("Error getting all comprehensive manifests:", error)
    return []
  }
}

export async function deleteComprehensiveManifest(manifestId: string): Promise<boolean> {
  try {
    const deleted = comprehensiveStorage.delete(manifestId)
    console.log(`🗑️ Comprehensive manifest ${manifestId} ${deleted ? "deleted" : "not found"}`)
    return deleted
  } catch (error) {
    console.error("Error deleting comprehensive manifest:", error)
    return false
  }
}
