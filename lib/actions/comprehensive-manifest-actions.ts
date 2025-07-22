"use server"

import { parseEnhancedManifestCSV, validateManifestStructure } from "@/lib/utils/enhanced-manifest-parser"
import { parseFixedManifestCSV } from "@/lib/utils/fixed-manifest-parser"
import { analyzeManifestComprehensively, type ComprehensiveManifestAnalysis } from "@/lib/ai/deep-research-analysis"

// In-memory storage for demo - in production, use a database
const comprehensiveManifestStorage = new Map<string, ComprehensiveManifestAnalysis>()

export async function uploadComprehensiveManifest(formData: FormData) {
  console.log("🚀 Starting comprehensive manifest upload with deep AI research...")

  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    console.log(`📁 Processing file: ${file.name} (${file.size} bytes)`)

    // Read file content
    const content = await file.text()
    console.log(`📄 File content length: ${content.length} characters`)

    // Try to parse as enhanced manifest first, then fall back to fixed manifest
    let items
    try {
      console.log("🔍 Attempting to parse as enhanced manifest...")
      items = await parseEnhancedManifestCSV(content)
      console.log(`✅ Parsed as enhanced manifest: ${items.length} items`)
    } catch (enhancedError) {
      console.log("⚠️ Enhanced parsing failed, trying fixed manifest format...")
      try {
        items = await parseFixedManifestCSV(content)
        console.log(`✅ Parsed as fixed manifest: ${items.length} items`)
      } catch (fixedError) {
        throw new Error(
          `Failed to parse manifest in any supported format. Enhanced error: ${enhancedError}. Fixed error: ${fixedError}`,
        )
      }
    }

    // Validate structure if using enhanced format
    if (items.length > 0 && "description" in items[0]) {
      console.log("✅ Validating enhanced manifest structure...")
      const validation = await validateManifestStructure(items as any)
      if (!validation.isValid) {
        console.warn(`⚠️ Validation warnings: ${validation.errors.join(", ")}`)
      }
      console.log(`✅ Validation completed: ${validation.validItems}/${validation.totalItems} items valid`)
    }

    // Perform comprehensive AI analysis with deep research
    console.log("🤖 Starting comprehensive AI analysis with deep research...")
    const analysisResult = await analyzeManifestComprehensively(items, file.name)
    console.log("✅ Comprehensive AI analysis completed")

    // Store result
    comprehensiveManifestStorage.set(analysisResult.manifestId, analysisResult)
    console.log(`💾 Stored comprehensive manifest: ${analysisResult.manifestId}`)

    return {
      success: true,
      manifestId: analysisResult.manifestId,
      result: analysisResult,
    }
  } catch (error) {
    console.error("❌ Comprehensive manifest upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getComprehensiveManifestById(id: string): Promise<ComprehensiveManifestAnalysis> {
  try {
    const manifest = comprehensiveManifestStorage.get(id)
    if (!manifest) {
      throw new Error(`Comprehensive manifest not found: ${id}`)
    }
    return manifest
  } catch (error) {
    console.error("❌ Error getting comprehensive manifest:", error)
    throw error
  }
}

export async function getAllComprehensiveManifests(userId: string): Promise<ComprehensiveManifestAnalysis[]> {
  try {
    // In production, filter by userId
    const manifests = Array.from(comprehensiveManifestStorage.values())
    console.log(`📋 Retrieved ${manifests.length} comprehensive manifests for user ${userId}`)
    return manifests.sort((a, b) => new Date(b.analysisTimestamp).getTime() - new Date(a.analysisTimestamp).getTime())
  } catch (error) {
    console.error("❌ Error getting comprehensive manifests:", error)
    return []
  }
}

export async function deleteComprehensiveManifest(manifestId: string) {
  try {
    const deleted = comprehensiveManifestStorage.delete(manifestId)
    if (deleted) {
      console.log(`🗑️ Deleted comprehensive manifest: ${manifestId}`)
      return { success: true }
    } else {
      throw new Error(`Comprehensive manifest not found: ${manifestId}`)
    }
  } catch (error) {
    console.error("❌ Error deleting comprehensive manifest:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getComprehensiveManifestSummary(userId: string) {
  try {
    const manifests = await getAllComprehensiveManifests(userId)

    const summary = {
      totalManifests: manifests.length,
      totalItems: manifests.reduce((sum, m) => sum + m.totalItems, 0),
      totalInvestment: manifests.reduce((sum, m) => sum + m.manifestInsights.executiveSummary.totalInvestment, 0),
      totalProjectedRevenue: manifests.reduce(
        (sum, m) => sum + m.manifestInsights.executiveSummary.projectedRevenue,
        0,
      ),
      totalExpectedProfit: manifests.reduce((sum, m) => sum + m.manifestInsights.executiveSummary.expectedProfit, 0),
      averageROI: 0,
      averageConfidence: 0,
      totalProcessingTime: manifests.reduce((sum, m) => sum + m.processingTime, 0),
    }

    if (summary.totalInvestment > 0) {
      summary.averageROI = (summary.totalExpectedProfit / summary.totalInvestment) * 100
    }

    if (manifests.length > 0) {
      summary.averageConfidence =
        manifests.reduce((sum, m) => sum + m.manifestInsights.executiveSummary.confidenceScore, 0) / manifests.length
    }

    return summary
  } catch (error) {
    console.error("❌ Error getting comprehensive manifest summary:", error)
    return {
      totalManifests: 0,
      totalItems: 0,
      totalInvestment: 0,
      totalProjectedRevenue: 0,
      totalExpectedProfit: 0,
      averageROI: 0,
      averageConfidence: 0,
      totalProcessingTime: 0,
    }
  }
}

export async function reanalyzeComprehensiveManifest(manifestId: string) {
  try {
    console.log(`🔄 Re-analyzing comprehensive manifest: ${manifestId}`)

    const existingManifest = comprehensiveManifestStorage.get(manifestId)
    if (!existingManifest) {
      throw new Error(`Manifest not found: ${manifestId}`)
    }

    // Extract original items from the research results
    const originalItems = existingManifest.researchResults.map((result) => result.originalItem)

    // Perform new comprehensive analysis
    const newAnalysis = await analyzeManifestComprehensively(originalItems, existingManifest.manifestName)

    // Update storage with new analysis but keep original ID
    const updatedAnalysis = {
      ...newAnalysis,
      manifestId: existingManifest.manifestId, // Keep original ID
    }

    comprehensiveManifestStorage.set(manifestId, updatedAnalysis)

    console.log(`✅ Re-analysis completed for comprehensive manifest: ${manifestId}`)
    return {
      success: true,
      result: updatedAnalysis,
    }
  } catch (error) {
    console.error("❌ Comprehensive re-analysis failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
