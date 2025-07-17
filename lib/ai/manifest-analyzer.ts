"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { parseCSV } from "@/lib/utils/file-parsers"
import { cleanDescription } from "@/lib/utils/text-processors"
import { categorizeItem, extractBrandModel } from "@/lib/ai/categorization"
import { estimateValue, assessRisk } from "@/lib/ai/valuation"
import { generateInsights } from "@/lib/ai/insights"

export interface ManifestItem {
  id: string
  rowNumber: number
  originalDescription: string
  cleanedDescription: string
  aiGeneratedTitle: string
  category: string
  subcategory: string
  brand: string
  model: string
  condition: string
  estimatedValue: number
  marketValueLow: number
  marketValueHigh: number
  marketScore: number
  demandScore: number
  riskScore: number
  authenticityScore: number
  seasonalityFactor: number
  riskFactors: string[]
  comparableSales: any[]
}

export interface ManifestAnalysis {
  manifestId: string
  totalItems: number
  estimatedTotalValue: number
  processingTime: number
  aiConfidenceScore: number
  categoryBreakdown: Record<string, number>
  riskBreakdown: {
    lowRisk: number
    mediumRisk: number
    highRisk: number
  }
  insights: {
    summary: string
    opportunities: string[]
    risks: string[]
    marketTrends: string[]
    recommendations: string[]
  }
}

export async function analyzeManifest(fileContent: string, fileType: string): Promise<ManifestAnalysis> {
  const startTime = Date.now()

  // Parse the file based on its type
  let rawItems: any[] = []
  if (fileType === "text/csv") {
    rawItems = await parseCSV(fileContent)
  } else {
    // Handle other file types (Excel, PDF) in a real implementation
    throw new Error("Unsupported file type")
  }

  // Process each item through the AI pipeline
  const processedItems: ManifestItem[] = []
  const categoryBreakdown: Record<string, number> = {}
  let totalValue = 0
  let lowRisk = 0
  let mediumRisk = 0
  let highRisk = 0

  for (let i = 0; i < rawItems.length; i++) {
    const rawItem = rawItems[i]

    // Clean the description
    const cleanedDescription = await cleanDescription(rawItem.description)

    // Categorize the item
    const { category, subcategory, confidence } = await categorizeItem(cleanedDescription)

    // Extract brand and model
    const { brand, model } = await extractBrandModel(cleanedDescription, category)

    // Estimate value
    const {
      estimatedValue,
      marketValueLow,
      marketValueHigh,
      marketScore,
      demandScore,
      seasonalityFactor,
      comparableSales,
    } = await estimateValue(cleanedDescription, category, brand, model, rawItem.condition)

    // Assess risk
    const { riskScore, authenticityScore, riskFactors } = await assessRisk(
      cleanedDescription,
      category,
      brand,
      model,
      estimatedValue,
    )

    // Generate AI title
    const aiGeneratedTitle = await generateItemTitle(cleanedDescription, brand, model, category)

    // Create the processed item
    const processedItem: ManifestItem = {
      id: `item-${i + 1}`,
      rowNumber: i + 1,
      originalDescription: rawItem.description,
      cleanedDescription,
      aiGeneratedTitle,
      category,
      subcategory,
      brand,
      model,
      condition: rawItem.condition || "Unknown",
      estimatedValue,
      marketValueLow,
      marketValueHigh,
      marketScore,
      demandScore,
      riskScore,
      authenticityScore,
      seasonalityFactor,
      riskFactors,
      comparableSales,
    }

    // Update statistics
    processedItems.push(processedItem)
    totalValue += estimatedValue

    // Update category breakdown
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1

    // Update risk breakdown
    if (riskScore < 30) {
      lowRisk++
    } else if (riskScore < 70) {
      mediumRisk++
    } else {
      highRisk++
    }
  }

  // Generate insights
  const insights = await generateInsights(processedItems)

  // Calculate processing time
  const processingTime = Date.now() - startTime

  // Calculate AI confidence score (simplified)
  const aiConfidenceScore = 0.92 // In a real app, this would be calculated based on various factors

  return {
    manifestId: `manifest-${Math.random().toString(36).substring(2, 10)}`,
    totalItems: processedItems.length,
    estimatedTotalValue: totalValue,
    processingTime,
    aiConfidenceScore,
    categoryBreakdown,
    riskBreakdown: {
      lowRisk,
      mediumRisk,
      highRisk,
    },
    insights,
  }
}

async function generateItemTitle(description: string, brand: string, model: string, category: string): Promise<string> {
  // In a real app, we would use a more sophisticated approach
  // For now, we'll use a simple template
  if (brand && model) {
    return `${brand} ${model}`
  } else if (brand) {
    return `${brand} ${category}`
  } else {
    // Use AI to generate a title
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a concise, descriptive product title (max 10 words) for this item: "${description}". Category: ${category}`,
        system: "You are a product listing specialist who creates clear, accurate titles for e-commerce products.",
      })

      return text.trim()
    } catch (error) {
      console.error("Error generating item title:", error)
      return description.substring(0, 100)
    }
  }
}
