"use server"

import { parseEnhancedManifestCSV, validateManifestStructure } from "@/lib/utils/enhanced-manifest-parser"
import { analyzeSimpleManifest } from "@/lib/ai/simple-analysis-service"
import { performDeepResearch, type EnhancedManifestResult } from "@/lib/ai/deep-research-enhanced-service"

// In-memory storage for demo - in production, use a database
const enhancedManifestStorage = new Map<string, EnhancedManifestResult>()

export async function uploadEnhancedManifest(formData: FormData) {
  console.log("🚀 Starting enhanced manifest upload...")

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

    // Perform AI analysis
    console.log("🤖 Starting AI analysis...")
    const analysisResult = await analyzeSimpleManifest(items, file.name)
    console.log("✅ AI analysis completed")

    // Perform deep research
    console.log("🔬 Starting deep research...")
    const enhancedResult = await performDeepResearch(analysisResult)
    console.log("✅ Deep research completed")

    // Store result
    enhancedManifestStorage.set(enhancedResult.manifestId, enhancedResult)
    console.log(`💾 Stored enhanced manifest: ${enhancedResult.manifestId}`)

    return {
      success: true,
      manifestId: enhancedResult.manifestId,
      result: enhancedResult,
    }
  } catch (error) {
    console.error("❌ Enhanced manifest upload failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getEnhancedManifestById(id: string) {
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

export async function getAllEnhancedManifests(userId: string) {
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
      researchInsights: manifests.reduce((sum, m) => sum + m.deepResearch.recommendations.length, 0),
    }

    if (summary.totalValue > 0) {
      summary.averageROI = (summary.totalProfit / summary.totalValue) * 100
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
      researchInsights: 0,
    }
  }
}
