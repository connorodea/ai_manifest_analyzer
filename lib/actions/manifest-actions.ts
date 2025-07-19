"use server"

import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/session"
import { analyzeManifestWithAI, type ManifestAnalysisResult } from "@/lib/ai/analysis-service"

// In-memory storage for demo - in production, use a database
const manifestStorage = new Map<string, ManifestAnalysisResult>()

export async function uploadManifest(formData: FormData) {
  try {
    // Verify user is authenticated
    const session = await verifySession()

    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as string

    if (!file || !name || !content) {
      throw new Error("Missing required fields")
    }

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ]

    if (!validTypes.includes(type)) {
      throw new Error("Unsupported file type. Please upload a CSV, Excel, or PDF file.")
    }

    console.log(`Starting AI analysis for manifest: ${name} (User: ${session.userId})`)

    // Perform real AI analysis
    const analysisResult = await analyzeManifestWithAI(content, type, name)

    // Store the analysis result
    manifestStorage.set(analysisResult.manifestId, analysisResult)

    console.log(`Analysis completed for manifest: ${analysisResult.manifestId}`)

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
    console.error("Error uploading and analyzing manifest:", error)
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
    name: "AI Analyzed Manifest",
    status: "completed",
    totalItems: manifest.totalItems,
    estimatedValue: manifest.estimatedTotalValue,
    createdAt: new Date().toISOString(),
    confidence: manifest.aiConfidenceScore,
    analysisResult: manifest,
  }
}

export async function getManifestItems(manifestId: string) {
  const manifest = manifestStorage.get(manifestId)

  if (!manifest) {
    return []
  }

  return manifest.items.map((item) => ({
    id: item.id,
    title: item.aiGeneratedTitle,
    category: item.category,
    condition: item.condition,
    estimatedValue: item.estimatedValue,
    marketValue: item.marketValueHigh,
    riskScore: item.riskScore,
    brand: item.brand,
    model: item.model,
    originalDescription: item.originalDescription,
    riskFactors: item.riskFactors,
    aiReasoning: item.aiReasoning,
  }))
}

export async function getManifestAnalysis(manifestId: string): Promise<ManifestAnalysisResult | null> {
  return manifestStorage.get(manifestId) || null
}

export async function getAllManifests(userId: string) {
  // In a real app, filter by userId from database
  const manifests = Array.from(manifestStorage.values()).map((manifest) => ({
    id: manifest.manifestId,
    name: `AI Analyzed Manifest ${manifest.manifestId.split("-")[1]}`,
    status: "completed",
    totalItems: manifest.totalItems,
    estimatedValue: manifest.estimatedTotalValue,
    createdAt: new Date().toISOString(),
    confidence: manifest.aiConfidenceScore,
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
