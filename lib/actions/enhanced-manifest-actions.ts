"use server"

import { parseEnhancedManifestCSV, validateManifestStructure } from "@/lib/utils/enhanced-manifest-parser"
import {
  analyzeComprehensiveManifest,
  type ComprehensiveManifestAnalysisResult,
} from "@/lib/ai/enhanced-analysis-service"

// In-memory storage for demo - in production, use a database
const enhancedManifestStorage = new Map<string, ComprehensiveManifestAnalysisResult>()

export async function uploadEnhancedManifest(formData: FormData) {
  console.log("🚀 Starting enhanced manifest upload with deep AI analysis...")

  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    console.log(`📁 Processing file: ${file.name} (${file.size} bytes)`)

    // Read file content
    const content = await file.text()
    console.log(`📄 File content length: ${content.length} characters`)

    // Parse manifest
    console.log("🔍 Parsing enhanced manifest...")
    const items = await parseEnhancedManifestCSV(content)
    console.log(`✅ Parsed ${items.length} items`)

    // Validate structure
    console.log("✅ Validating manifest structure...")
    const validation = await validateManifestStructure(items)

    if (!validation.isValid) {
      throw new Error(`Manifest validation failed: ${validation.errors.join(", ")}`)
    }

    console.log(`✅ Validation passed: ${validation.validItems}/${validation.totalItems} items valid`)

    // Perform comprehensive AI analysis with thinking process
    console.log("🤖 Starting comprehensive AI analysis with thinking process...")
    const analysisResult = await analyzeComprehensiveManifest(items, file.name)
    console.log("✅ Comprehensive AI analysis completed")

    // Store result
    enhancedManifestStorage.set(analysisResult.manifestId, analysisResult)
    console.log(`💾 Stored enhanced manifest: ${analysisResult.manifestId}`)

    return {
      success: true,
      manifestId: analysisResult.manifestId,
      result: analysisResult,
    }
  } catch (error) {
    console.error("❌ Enhanced manifest upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getEnhancedManifestById(id: string): Promise<ComprehensiveManifestAnalysisResult> {
  try {
    const manifest = enhancedManifestStorage.get(id)
    if (!manifest) {
      throw new Error(`Enhanced manifest not found: ${id}`)
    }
    return manifest
  } catch (error) {
    console.error("❌ Error getting enhanced manifest:", error)
    throw error
  }
}

export async function getAllEnhancedManifests(userId: string): Promise<ComprehensiveManifestAnalysisResult[]> {
  try {
    // In production, filter by userId
    const manifests = Array.from(enhancedManifestStorage.values())
    console.log(`📋 Retrieved ${manifests.length} enhanced manifests for user ${userId}`)
    return manifests
  } catch (error) {
    console.error("❌ Error getting enhanced manifests:", error)
    return []
  }
}

export async function deleteEnhancedManifest(manifestId: string) {
  try {
    const deleted = enhancedManifestStorage.delete(manifestId)
    if (deleted) {
      console.log(`🗑️ Deleted enhanced manifest: ${manifestId}`)
      return { success: true }
    } else {
      throw new Error(`Enhanced manifest not found: ${manifestId}`)
    }
  } catch (error) {
    console.error("❌ Error deleting enhanced manifest:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getEnhancedManifestSummary(userId: string) {
  try {
    const manifests = await getAllEnhancedManifests(userId)

    const summary = {
      totalManifests: manifests.length,
      totalItems: manifests.reduce((sum, m) => sum + m.totalItems, 0),
      totalValue: manifests.reduce((sum, m) => sum + m.totalRetailValue, 0),
      totalProfit: manifests.reduce((sum, m) => sum + m.totalPotentialProfit, 0),
      averageROI: 0,
      averageConfidence: 0,
      processingTime: manifests.reduce((sum, m) => sum + m.processingTime, 0),
    }

    if (summary.totalValue > 0) {
      summary.averageROI = (summary.totalProfit / summary.totalValue) * 100
    }

    if (manifests.length > 0) {
      summary.averageConfidence = manifests.reduce((sum, m) => sum + m.summary.confidenceScore, 0) / manifests.length
    }

    return summary
  } catch (error) {
    console.error("❌ Error getting enhanced manifest summary:", error)
    return {
      totalManifests: 0,
      totalItems: 0,
      totalValue: 0,
      totalProfit: 0,
      averageROI: 0,
      averageConfidence: 0,
      processingTime: 0,
    }
  }
}

export async function reanalyzeManifest(manifestId: string) {
  try {
    console.log(`🔄 Re-analyzing manifest: ${manifestId}`)

    const existingManifest = enhancedManifestStorage.get(manifestId)
    if (!existingManifest) {
      throw new Error(`Manifest not found: ${manifestId}`)
    }

    // Extract original items from the analysis results
    const originalItems = existingManifest.analysisResults.map((result) => result.originalItem)

    // Perform new comprehensive analysis
    const newAnalysis = await analyzeComprehensiveManifest(originalItems, existingManifest.manifestName)

    // Update storage with new analysis but keep original ID
    const updatedAnalysis = {
      ...newAnalysis,
      manifestId: existingManifest.manifestId, // Keep original ID
    }

    enhancedManifestStorage.set(manifestId, updatedAnalysis)

    console.log(`✅ Re-analysis completed for manifest: ${manifestId}`)
    return {
      success: true,
      result: updatedAnalysis,
    }
  } catch (error) {
    console.error("❌ Re-analysis failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
