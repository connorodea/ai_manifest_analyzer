"use server"
import type { EnhancedManifestAnalysisResult } from "@/lib/ai/enhanced-manifest-analyzer"
import type { SimpleManifestAnalysisResult } from "@/lib/ai/simple-analysis-service"
import {
  uploadManifestFixed,
  getFixedManifestById,
  getFixedManifestItems,
  getFixedManifestAnalysis,
  getAllFixedManifests,
} from "@/lib/actions/fixed-manifest-actions"

// In-memory storage for demo - in production, use a database
const manifestStorage = new Map<string, EnhancedManifestAnalysisResult | SimpleManifestAnalysisResult>()

// Replace the existing functions with calls to the fixed versions:
export async function uploadManifest(formData: FormData) {
  return uploadManifestFixed(formData)
}

export async function getManifestById(id: string) {
  return getFixedManifestById(id)
}

export async function getManifestItems(manifestId: string) {
  return getFixedManifestItems(manifestId)
}

export async function getManifestAnalysis(manifestId: string) {
  return getFixedManifestAnalysis(manifestId)
}

export async function getAllManifests(userId: string) {
  return getAllFixedManifests(userId)
}

// Additional helper functions for manifest management
export async function deleteManifest(manifestId: string): Promise<boolean> {
  try {
    manifestStorage.delete(manifestId)
    console.log(`🗑️ Deleted manifest: ${manifestId}`)
    return true
  } catch (error) {
    console.error("❌ Error deleting manifest:", error)
    return false
  }
}

export async function updateManifestName(manifestId: string, newName: string): Promise<boolean> {
  try {
    const manifest = manifestStorage.get(manifestId)
    if (manifest) {
      manifest.manifestName = newName
      manifestStorage.set(manifestId, manifest)
      console.log(`✏️ Updated manifest name: ${manifestId} -> ${newName}`)
      return true
    }
    return false
  } catch (error) {
    console.error("❌ Error updating manifest name:", error)
    return false
  }
}

export async function getManifestSummary(userId: string) {
  try {
    const manifests = await getAllManifests(userId)

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
    console.error("❌ Error getting manifest summary:", error)
    return {
      totalManifests: 0,
      totalItems: 0,
      totalValue: 0,
      totalProfit: 0,
      averageROI: 0,
    }
  }
}
