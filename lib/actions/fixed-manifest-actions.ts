"use server"

import { parseFixedManifestCSV, validateManifestStructure } from "../utils/fixed-manifest-parser"
import { analyzeSimpleManifest, type SimpleManifestAnalysisResult } from "../ai/simple-analysis-service"

// In-memory storage for demo - in production, use a database
const fixedManifestStorage = new Map<string, SimpleManifestAnalysisResult>()

export async function uploadManifestFixed(formData: FormData) {
  console.log("🚀 Starting fixed manifest upload...")

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
    console.log("🔍 Parsing fixed manifest...")
    const items = await parseFixedManifestCSV(content)
    console.log(`✅ Parsed ${items.length} items`)

    // Validate structure
    console.log("✅ Validating manifest structure...")
    const validation = validateManifestStructure(items)

    if (!validation.isValid) {
      throw new Error(`Manifest validation failed: ${validation.issues.join(", ")}`)
    }

    console.log(`✅ Validation passed: ${validation.itemCount} items valid`)

    // Perform AI analysis
    console.log("🤖 Starting AI analysis...")
    const analysisResult = await analyzeSimpleManifest(items, file.name)
    console.log("✅ AI analysis completed")

    // Store result
    fixedManifestStorage.set(analysisResult.manifestId, analysisResult)
    console.log(`💾 Stored fixed manifest: ${analysisResult.manifestId}`)

    return {
      success: true,
      manifestId: analysisResult.manifestId,
      result: analysisResult,
    }
  } catch (error) {
    console.error("❌ Fixed manifest upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function uploadFixedManifest(formData: FormData) {
  return uploadManifestFixed(formData)
}

export async function getFixedManifestItems(id: string) {
  try {
    const manifest = fixedManifestStorage.get(id)
    if (!manifest) {
      throw new Error(`Fixed manifest not found: ${id}`)
    }
    return manifest.items || []
  } catch (error) {
    console.error("❌ Error getting fixed manifest items:", error)
    return []
  }
}

export async function getFixedManifestAnalysis(id: string) {
  try {
    const manifest = fixedManifestStorage.get(id)
    if (!manifest) {
      throw new Error(`Fixed manifest not found: ${id}`)
    }
    return manifest
  } catch (error) {
    console.error("❌ Error getting fixed manifest analysis:", error)
    throw error
  }
}

export async function getFixedManifestById(id: string): Promise<SimpleManifestAnalysisResult> {
  try {
    const manifest = fixedManifestStorage.get(id)
    if (!manifest) {
      throw new Error(`Fixed manifest not found: ${id}`)
    }
    return manifest
  } catch (error) {
    console.error("❌ Error getting fixed manifest:", error)
    throw error
  }
}

export async function getAllFixedManifests(userId: string): Promise<SimpleManifestAnalysisResult[]> {
  try {
    // In production, filter by userId
    const manifests = Array.from(fixedManifestStorage.values())
    console.log(`📋 Retrieved ${manifests.length} fixed manifests for user ${userId}`)
    return manifests
  } catch (error) {
    console.error("❌ Error getting fixed manifests:", error)
    return []
  }
}

export async function deleteFixedManifest(manifestId: string) {
  try {
    const deleted = fixedManifestStorage.delete(manifestId)
    if (deleted) {
      console.log(`🗑️ Deleted fixed manifest: ${manifestId}`)
      return { success: true }
    } else {
      throw new Error(`Fixed manifest not found: ${manifestId}`)
    }
  } catch (error) {
    console.error("❌ Error deleting fixed manifest:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getFixedManifestSummary(userId: string) {
  try {
    const manifests = await getAllFixedManifests(userId)

    const summary = {
      totalManifests: manifests.length,
      totalItems: manifests.reduce((sum, m) => sum + m.totalItems, 0),
      totalValue: manifests.reduce((sum, m) => sum + m.totalRetailValue, 0),
      totalProfit: manifests.reduce((sum, m) => sum + m.totalPotentialProfit, 0),
      averageROI: 0,
    }

    if (summary.totalValue > 0) {
      summary.averageROI = (summary.totalProfit / summary.totalValue) * 100
    }

    return summary
  } catch (error) {
    console.error("❌ Error getting fixed manifest summary:", error)
    return {
      totalManifests: 0,
      totalItems: 0,
      totalValue: 0,
      totalProfit: 0,
      averageROI: 0,
    }
  }
}
