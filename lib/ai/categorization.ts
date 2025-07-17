"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Main categories for the system
const MAIN_CATEGORIES = [
  "Electronics",
  "Clothing & Accessories",
  "Home & Garden",
  "Toys & Games",
  "Sports & Outdoors",
  "Health & Beauty",
  "Automotive",
  "Books & Media",
  "Industrial Equipment",
  "Other",
]

export async function categorizeItem(description: string): Promise<{
  category: string
  subcategory: string
  confidence: number
}> {
  try {
    // Use AI to categorize the item
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Categorize this product description into one of these categories: ${MAIN_CATEGORIES.join(", ")}.

Product description: "${description}"

Respond with a JSON object containing:
- category: the main category
- subcategory: a more specific subcategory
- confidence: a confidence score from 0 to 1

Example response:
{
  "category": "Electronics",
  "subcategory": "Smartphones",
  "confidence": 0.95
}`,
      system: "You are an expert product categorization system. Always respond with valid JSON.",
    })

    const result = JSON.parse(text)

    // Validate the category is in our list
    if (!MAIN_CATEGORIES.includes(result.category)) {
      result.category = "Other"
    }

    return {
      category: result.category,
      subcategory: result.subcategory || result.category,
      confidence: result.confidence || 0.8,
    }
  } catch (error) {
    console.error("Error categorizing item:", error)

    // Fallback to simple keyword matching
    const lowerDesc = description.toLowerCase()

    if (lowerDesc.includes("phone") || lowerDesc.includes("laptop") || lowerDesc.includes("tv")) {
      return { category: "Electronics", subcategory: "Electronics", confidence: 0.6 }
    } else if (lowerDesc.includes("shirt") || lowerDesc.includes("pants") || lowerDesc.includes("shoes")) {
      return { category: "Clothing & Accessories", subcategory: "Clothing", confidence: 0.6 }
    } else {
      return { category: "Other", subcategory: "Other", confidence: 0.3 }
    }
  }
}

export async function extractBrandModel(
  description: string,
  category: string,
): Promise<{
  brand: string
  model: string
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extract the brand and model from this product description.

Product description: "${description}"
Category: ${category}

Respond with a JSON object containing:
- brand: the brand name (or empty string if not found)
- model: the model name/number (or empty string if not found)

Example response:
{
  "brand": "Apple",
  "model": "iPhone 13 Pro"
}`,
      system: "You are an expert at extracting product information. Always respond with valid JSON.",
    })

    const result = JSON.parse(text)

    return {
      brand: result.brand || "",
      model: result.model || "",
    }
  } catch (error) {
    console.error("Error extracting brand/model:", error)
    return { brand: "", model: "" }
  }
}
