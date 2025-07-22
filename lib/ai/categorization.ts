"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const CategorySchema = z.object({
  category: z.string(),
  subcategory: z.string().optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  tags: z.array(z.string()),
})

const BrandExtractionSchema = z.object({
  brand: z.string().optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export type CategoryResult = z.infer<typeof CategorySchema>
export type BrandResult = z.infer<typeof BrandExtractionSchema>

export async function categorizeProduct(description: string): Promise<CategoryResult> {
  try {
    console.log(`🏷️ Categorizing product: ${description.substring(0, 50)}...`)

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: CategorySchema,
      prompt: `Categorize this product description:

"${description}"

Assign it to one of these main categories:
- Electronics (phones, computers, TVs, gaming, audio, cameras, etc.)
- Clothing & Accessories (apparel, shoes, jewelry, bags, etc.)
- Home & Garden (furniture, decor, kitchen, tools, outdoor, etc.)
- Toys & Games (children's toys, board games, video games, etc.)
- Sports & Outdoors (fitness, sports equipment, outdoor gear, etc.)
- Beauty & Health (cosmetics, skincare, vitamins, health products, etc.)
- Books & Media (books, DVDs, CDs, magazines, etc.)
- Automotive (car parts, accessories, tools, etc.)
- Other (anything that doesn't fit the above categories)

Also provide:
- A more specific subcategory if applicable
- Confidence level (0-1) in the categorization
- Brief reasoning for the categorization
- Relevant tags that describe the product`,

      system:
        "You are a product categorization expert. Analyze product descriptions and assign accurate categories based on the content.",
    })

    console.log(`✅ Categorization completed: ${result.object.category}`)
    return result.object
  } catch (error) {
    console.error(`❌ Categorization failed:`, error)

    // Fallback categorization
    return {
      category: "Other",
      subcategory: undefined,
      confidence: 0.3,
      reasoning: "Categorization failed - assigned to Other category",
      tags: ["uncategorized"],
    }
  }
}

export async function extractBrand(description: string): Promise<BrandResult> {
  try {
    console.log(`🏢 Extracting brand from: ${description.substring(0, 50)}...`)

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: BrandExtractionSchema,
      prompt: `Extract the brand name from this product description:

"${description}"

Look for:
- Well-known brand names (Apple, Samsung, Nike, etc.)
- Store brands (Great Value, Kirkland, etc.)
- Generic indicators (no brand, unbranded, generic)

Provide:
- The brand name if clearly identifiable (or null if no brand found)
- Confidence level (0-1) in the brand identification
- Brief reasoning for the identification`,

      system: "You are a brand identification expert. Extract brand names accurately from product descriptions.",
    })

    console.log(`✅ Brand extraction completed: ${result.object.brand || "No brand found"}`)
    return result.object
  } catch (error) {
    console.error(`❌ Brand extraction failed:`, error)

    return {
      brand: undefined,
      confidence: 0.3,
      reasoning: "Brand extraction failed",
    }
  }
}

export async function batchCategorizeProducts(descriptions: string[]): Promise<CategoryResult[]> {
  console.log(`🏷️ Starting batch categorization for ${descriptions.length} products...`)

  const results: CategoryResult[] = []
  const batchSize = 5

  for (let i = 0; i < descriptions.length; i += batchSize) {
    const batch = descriptions.slice(i, i + batchSize)
    console.log(
      `📊 Processing categorization batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(descriptions.length / batchSize)}`,
    )

    const batchPromises = batch.map((description) => categorizeProduct(description))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Small delay between batches
    if (i + batchSize < descriptions.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  console.log(`✅ Batch categorization completed`)
  return results
}

export async function getCategoryInsights(categories: CategoryResult[]): Promise<{
  topCategories: Array<{ category: string; count: number; percentage: number }>
  averageConfidence: number
  categoryDistribution: Record<string, number>
  recommendations: string[]
}> {
  try {
    const categoryCount = categories.reduce(
      (acc, cat) => {
        acc[cat.category] = (acc[cat.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const totalItems = categories.length
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / totalItems) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    const averageConfidence = categories.reduce((sum, cat) => sum + cat.confidence, 0) / totalItems

    const recommendations = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        recommendations: z.array(z.string()),
      }),
      prompt: `Analyze this category distribution and provide strategic recommendations:

Category Distribution:
${topCategories.map((cat) => `- ${cat.category}: ${cat.count} items (${cat.percentage.toFixed(1)}%)`).join("\n")}

Average Categorization Confidence: ${(averageConfidence * 100).toFixed(1)}%
Total Items: ${totalItems}

Provide 3-5 strategic recommendations for optimizing this product mix for liquidation sales.`,

      system: "You are a liquidation strategist. Provide actionable recommendations based on category analysis.",
    })

    return {
      topCategories,
      averageConfidence,
      categoryDistribution: categoryCount,
      recommendations: recommendations.object.recommendations,
    }
  } catch (error) {
    console.error("❌ Category insights generation failed:", error)

    const categoryCount = categories.reduce(
      (acc, cat) => {
        acc[cat.category] = (acc[cat.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const totalItems = categories.length
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / totalItems) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      topCategories,
      averageConfidence: categories.reduce((sum, cat) => sum + cat.confidence, 0) / totalItems,
      categoryDistribution: categoryCount,
      recommendations: ["Category analysis incomplete - manual review recommended"],
    }
  }
}
