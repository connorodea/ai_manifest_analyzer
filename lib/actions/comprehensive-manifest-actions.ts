"use server"

import { parseFixedManifestCSV, validateManifestStructure } from "../utils/fixed-manifest-parser"
import { performDeepResearchAnalysis, type ComprehensiveAnalysisResult } from "../ai/deep-research-analysis"

// In-memory storage for demo - in production, use a database
const comprehensiveManifestStorage = new Map<string, ComprehensiveAnalysisResult>()

export async function uploadComprehensiveManifest(formData: FormData) {
  console.log("🚀 Starting comprehensive manifest upload...")

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
    console.log("🔍 Parsing comprehensive manifest...")
    const items = await parseFixedManifestCSV(content)
    console.log(`✅ Parsed ${items.length} items`)

    // Validate structure
    console.log("✅ Validating manifest structure...")
    const validation = validateManifestStructure(items)

    if (!validation.isValid) {
      throw new Error(`Manifest validation failed: ${validation.issues.join(", ")}`)
    }

    console.log(`✅ Validation passed: ${validation.itemCount} items valid`)

    // Perform comprehensive AI analysis with deep research
    console.log("🤖 Starting comprehensive AI analysis with deep research...")
    const analysisResult = await performDeepResearchAnalysis(items, file.name)
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

export async function getComprehensiveManifestById(id: string): Promise<ComprehensiveAnalysisResult> {
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

export async function getAllComprehensiveManifests(userId: string): Promise<ComprehensiveAnalysisResult[]> {
  try {
    // In production, filter by userId
    const manifests = Array.from(comprehensiveManifestStorage.values())
    console.log(`📋 Retrieved ${manifests.length} comprehensive manifests for user ${userId}`)
    return manifests
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
      totalValue: manifests.reduce((sum, m) => sum + m.executiveSummary.totalRetailValue, 0),
      totalProfit: manifests.reduce((sum, m) => sum + m.executiveSummary.totalPotentialProfit, 0),
      averageROI: 0,
      averageConfidence: 0,
    }

    if (summary.totalValue > 0) {
      summary.averageROI = (summary.totalProfit / summary.totalValue) * 100
    }

    if (manifests.length > 0) {
      summary.averageConfidence =
        manifests.reduce((sum, m) => sum + m.executiveSummary.aiConfidence, 0) / manifests.length
    }

    return summary
  } catch (error) {
    console.error("❌ Error getting comprehensive manifest summary:", error)
    return {
      totalManifests: 0,
      totalItems: 0,
      totalValue: 0,
      totalProfit: 0,
      averageROI: 0,
      averageConfidence: 0,
    }
  }
}
