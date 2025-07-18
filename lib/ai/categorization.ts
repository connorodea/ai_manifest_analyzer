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
  if (!description || description.trim().length === 0) {
    return { category: "Other", subcategory: "Other", confidence: 0.1 }
  }

  try {
    // Use AI to categorize the item
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Categorize this product description into one of these categories: ${MAIN_CATEGORIES.join(", ")}.

Product description: "${description}"

Respond with ONLY a JSON object containing:
- category: the main category
- subcategory: a more specific subcategory
- confidence: a confidence score from 0 to 1

Example response:
{"category": "Electronics", "subcategory": "Smartphones", "confidence": 0.95}`,
      system:
        "You are an expert product categorization system. Always respond with valid JSON only, no additional text.",
    })

    // Clean the response to ensure it's valid JSON
    const cleanedText = text.trim().replace(/```json|```/g, "")
    const result = JSON.parse(cleanedText)

    // Validate the category is in our list
    if (!MAIN_CATEGORIES.includes(result.category)) {
      result.category = "Other"
    }

    return {
      category: result.category || "Other",
      subcategory: result.subcategory || result.category || "Other",
      confidence: Math.min(Math.max(result.confidence || 0.8, 0), 1),
    }
  } catch (error) {
    console.error("Error categorizing item:", error)

    // Fallback to simple keyword matching
    const lowerDesc = description.toLowerCase()

    if (lowerDesc.includes("phone") || lowerDesc.includes("iphone") || lowerDesc.includes("android")) {
      return { category: "Electronics", subcategory: "Smartphones", confidence: 0.7 }
    } else if (lowerDesc.includes("laptop") || lowerDesc.includes("computer") || lowerDesc.includes("macbook")) {
      return { category: "Electronics", subcategory: "Computers", confidence: 0.7 }
    } else if (lowerDesc.includes("tv") || lowerDesc.includes("television") || lowerDesc.includes("monitor")) {
      return { category: "Electronics", subcategory: "TVs & Displays", confidence: 0.7 }
    } else if (lowerDesc.includes("shirt") || lowerDesc.includes("pants") || lowerDesc.includes("jeans")) {
      return { category: "Clothing & Accessories", subcategory: "Clothing", confidence: 0.6 }
    } else if (lowerDesc.includes("shoes") || lowerDesc.includes("sneakers") || lowerDesc.includes("boots")) {
      return { category: "Clothing & Accessories", subcategory: "Footwear", confidence: 0.6 }
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
  if (!description || description.trim().length === 0) {
    return { brand: "", model: "" }
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extract the brand and model from this product description.

Product description: "${description}"
Category: ${category}

Respond with ONLY a JSON object containing:
- brand: the brand name (or empty string if not found)
- model: the model name/number (or empty string if not found)

Example response:
{"brand": "Apple", "model": "iPhone 13 Pro"}`,
      system:
        "You are an expert at extracting product information. Always respond with valid JSON only, no additional text.",
    })

    const cleanedText = text.trim().replace(/```json|```/g, "")
    const result = JSON.parse(cleanedText)

    return {
      brand: result.brand || "",
      model: result.model || "",
    }
  } catch (error) {
    console.error("Error extracting brand/model:", error)

    // Simple fallback extraction
    const lowerDesc = description.toLowerCase()
    let brand = ""
    const model = ""

    // Common brand detection
    const brands = ["apple", "samsung", "sony", "nike", "adidas", "dell", "hp", "lenovo", "lg", "panasonic"]
    for (const b of brands) {
      if (lowerDesc.includes(b)) {
        brand = b.charAt(0).toUpperCase() + b.slice(1)
        break
      }
    }

    return { brand, model }
  }
}
