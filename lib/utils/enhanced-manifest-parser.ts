"use server"

import { z } from "zod"
import { ManifestValidator, type ValidationSummary, validateCSVStructure } from "./data-validators"

// Enhanced manifest item schema
export const EnhancedManifestItemSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  retailPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  upc: z.string().optional(),
  sku: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export type EnhancedManifestItem = z.infer<typeof EnhancedManifestItemSchema> & {
  id: string
  totalRetailPrice: number
  rawData: Record<string, string>
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  totalItems: number
  validItems: number
  invalidItems: number
}

export interface ManifestValidation extends ValidationSummary {
  fileValidation: {
    isValid: boolean
    errors: string[]
    warnings: string[]
    metadata: {
      totalLines: number
      headerCount: number
      estimatedRows: number
      fileSize: number
    }
  }
}

export async function parseEnhancedManifestCSV(content: string): Promise<EnhancedManifestItem[]> {
  console.log("📋 Starting enhanced manifest parsing with comprehensive validation...")
  console.log(`📋 Content length: ${content.length} characters`)

  try {
    // First, validate file structure
    const fileValidation = await validateCSVStructure(content)
    if (!fileValidation.isValid) {
      throw new Error(`File validation failed: ${fileValidation.errors.join(", ")}`)
    }

    const lines = content.split(/\r?\n/).filter((line) => line.trim())
    console.log(`📋 Found ${lines.length} lines in CSV`)

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row")
    }

    // Parse headers with enhanced mapping
    const headers = parseCSVLine(lines[0])
    console.log("📋 Detected headers:", headers)

    // Enhanced header mapping with multiple variations
    const headerMap = createHeaderMap(headers)
    console.log("📋 Header mapping:", headerMap)

    // Validate required columns exist
    const requiredFields = ["description", "quantity", "price"]
    const missingFields = requiredFields.filter((field) => headerMap[field] === -1)

    if (missingFields.length > 0) {
      throw new Error(`Missing required columns: ${missingFields.join(", ")}. Available headers: ${headers.join(", ")}`)
    }

    const validator = new ManifestValidator()
    const items: EnhancedManifestItem[] = []
    let processedRows = 0

    // Process each data row with comprehensive validation
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i])

        if (values.length === 0 || values.every((v) => !v.trim())) {
          console.log(`⚠️ Skipping empty row ${i}`)
          continue
        }

        // Create raw data object
        const rawData: Record<string, string> = {}
        headers.forEach((header, index) => {
          rawData[header] = values[index] || ""
        })

        // Extract data using header mapping
        const rawItem = extractItemData(values, headerMap, rawData, i)

        // Validate the item
        const validatedItem = validator.validateItem(rawItem, i)

        if (validatedItem) {
          const enhancedItem: EnhancedManifestItem = {
            ...validatedItem,
            id: `item-${i}-${Date.now()}`,
            totalRetailPrice: (validatedItem.retailPrice || validatedItem.price) * validatedItem.quantity,
            rawData,
          }

          items.push(enhancedItem)
          processedRows++

          // Log first few items for verification
          if (i <= 3) {
            console.log(`📋 Parsed and validated item ${i}:`, {
              description: enhancedItem.description.substring(0, 50) + "...",
              quantity: enhancedItem.quantity,
              price: enhancedItem.price,
              brand: enhancedItem.brand,
              category: enhancedItem.category,
              condition: enhancedItem.condition,
            })
          }
        }
      } catch (rowError) {
        console.error(`❌ Error processing row ${i}:`, rowError)
        // Continue processing other rows
      }
    }

    console.log(`✅ Successfully parsed ${items.length} valid items from ${processedRows} processed rows`)

    if (items.length === 0) {
      throw new Error(
        "No valid items could be parsed from the CSV file. Please check the file format and data quality.",
      )
    }

    return items
  } catch (error) {
    console.error("❌ Error parsing enhanced manifest CSV:", error)
    throw new Error(`Failed to parse manifest: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function createHeaderMap(headers: string[]): Record<string, number> {
  const headerMap: Record<string, number> = {
    description: -1,
    quantity: -1,
    price: -1,
    brand: -1,
    category: -1,
    condition: -1,
    retailPrice: -1,
    upc: -1,
    sku: -1,
    location: -1,
    notes: -1,
  }

  // Enhanced header variations mapping
  const variations: Record<string, string[]> = {
    description: ["description", "product", "item", "title", "name", "desc", "product_name", "item_name"],
    quantity: ["quantity", "qty", "count", "amount", "units", "pieces", "pcs"],
    price: ["price", "cost", "value", "unit_price", "item_price", "unit_cost"],
    brand: ["brand", "manufacturer", "make", "mfg", "brand_name"],
    category: ["category", "type", "class", "group", "dept", "department"],
    condition: ["condition", "state", "status", "grade"],
    retailPrice: ["retail", "retail_price", "msrp", "list_price", "suggested_price", "rrp"],
    upc: ["upc", "barcode", "ean", "gtin"],
    sku: ["sku", "part_number", "item_code", "product_code"],
    location: ["location", "warehouse", "bin", "shelf", "zone"],
    notes: ["notes", "comments", "remarks", "description_2", "additional_info"],
  }

  // Find matching headers
  Object.entries(variations).forEach(([field, fieldVariations]) => {
    const headerIndex = headers.findIndex((header) =>
      fieldVariations.some((variation) => header.toLowerCase().trim().includes(variation.toLowerCase())),
    )
    headerMap[field] = headerIndex
  })

  return headerMap
}

function extractItemData(
  values: string[],
  headerMap: Record<string, number>,
  rawData: Record<string, string>,
  rowIndex: number,
): any {
  const cleanValue = (value: string) => value?.trim().replace(/^"|"$/g, "") || ""

  // Extract required fields
  const description = cleanValue(values[headerMap.description] || "")
  const quantityStr = cleanValue(values[headerMap.quantity] || "1")
  const priceStr = cleanValue(values[headerMap.price] || "0")

  // Extract optional fields
  const brand = headerMap.brand >= 0 ? cleanValue(values[headerMap.brand]) : undefined
  const category = headerMap.category >= 0 ? cleanValue(values[headerMap.category]) : undefined
  const condition = headerMap.condition >= 0 ? cleanValue(values[headerMap.condition]) : "Unknown"
  const retailPriceStr = headerMap.retailPrice >= 0 ? cleanValue(values[headerMap.retailPrice]) : undefined
  const upc = headerMap.upc >= 0 ? cleanValue(values[headerMap.upc]) : undefined
  const sku = headerMap.sku >= 0 ? cleanValue(values[headerMap.sku]) : undefined
  const location = headerMap.location >= 0 ? cleanValue(values[headerMap.location]) : undefined
  const notes = headerMap.notes >= 0 ? cleanValue(values[headerMap.notes]) : undefined

  // Parse numeric values with enhanced error handling
  const quantity = parseNumericValue(quantityStr, "quantity", rowIndex)
  const price = parseNumericValue(priceStr, "price", rowIndex)
  const retailPrice = retailPriceStr ? parseNumericValue(retailPriceStr, "retailPrice", rowIndex) : undefined

  return {
    description,
    quantity,
    price,
    brand: brand || undefined,
    category: category || undefined,
    condition: normalizeCondition(condition),
    retailPrice,
    upc: upc || undefined,
    sku: sku || undefined,
    location: location || undefined,
    notes: notes || undefined,
  }
}

function parseNumericValue(value: string, fieldName: string, rowIndex: number): number {
  if (!value) return fieldName === "quantity" ? 1 : 0

  // Remove currency symbols, commas, and other non-numeric characters
  const cleanValue = value.replace(/[$,\s€£¥]/g, "").replace(/[^\d.-]/g, "")

  if (!cleanValue) return fieldName === "quantity" ? 1 : 0

  const parsed = fieldName === "quantity" ? Number.parseInt(cleanValue) : Number.parseFloat(cleanValue)

  if (isNaN(parsed)) {
    console.warn(`⚠️ Row ${rowIndex}: Invalid ${fieldName} value "${value}", using default`)
    return fieldName === "quantity" ? 1 : 0
  }

  return Math.max(0, parsed) // Ensure non-negative
}

function normalizeCondition(condition: string): string {
  if (!condition) return "Unknown"

  const normalized = condition.toLowerCase().trim()

  // Map common variations to standard conditions
  const conditionMap: Record<string, string> = {
    new: "New",
    "brand new": "New",
    unused: "New",
    used: "Used",
    "pre-owned": "Used",
    "second hand": "Used",
    refurbished: "Refurbished",
    refurb: "Refurbished",
    renewed: "Refurbished",
    "open box": "Open Box",
    opened: "Open Box",
    damaged: "Damaged",
    broken: "Damaged",
    defective: "Damaged",
    excellent: "Used",
    good: "Used",
    fair: "Used",
    poor: "Damaged",
  }

  return conditionMap[normalized] || "Unknown"
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
        continue
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }

    i++
  }

  // Add the last field
  result.push(current.trim())

  return result
}

export async function validateManifestStructure(items: EnhancedManifestItem[]): Promise<ManifestValidation> {
  console.log("🔍 Performing comprehensive manifest validation...")

  const validator = new ManifestValidator()
  let validItems = 0

  // Re-validate all items to get comprehensive validation results
  items.forEach((item, index) => {
    const validatedItem = validator.validateItem(item, index + 1)
    if (validatedItem) {
      validItems++
    }
  })

  const validationSummary = validator.getValidationSummary(items.length, validItems)

  // Add file-level validation (mock for parsed items)
  const fileValidation = {
    isValid: true,
    errors: [],
    warnings: [],
    metadata: {
      totalLines: items.length + 1, // +1 for header
      headerCount: Object.keys(items[0]?.rawData || {}).length,
      estimatedRows: items.length,
      fileSize: 0, // Not available after parsing
    },
  }

  console.log(`✅ Validation complete: ${validationSummary.dataQualityScore}% data quality score`)

  return {
    ...validationSummary,
    fileValidation,
  }
}

export async function enhanceManifestItems(items: EnhancedManifestItem[]): Promise<EnhancedManifestItem[]> {
  console.log(`🔧 Enhancing ${items.length} manifest items with additional processing...`)

  return items.map((item) => ({
    ...item,
    // Ensure all required fields have defaults
    category: item.category || categorizeFromDescription(item.description),
    condition: item.condition || "Unknown",
    brand: item.brand || extractBrandFromDescription(item.description),
  }))
}

function categorizeFromDescription(description: string): string {
  const desc = description.toLowerCase()

  const categories: Record<string, string[]> = {
    Electronics: ["phone", "laptop", "tablet", "tv", "computer", "headphones", "speaker", "camera", "electronic"],
    Clothing: ["shirt", "pants", "dress", "shoes", "jacket", "coat", "hat", "jeans", "clothing", "apparel"],
    "Home & Garden": ["furniture", "chair", "table", "lamp", "bed", "sofa", "kitchen", "bathroom", "garden"],
    "Toys & Games": ["toy", "game", "puzzle", "doll", "action figure", "lego", "board game", "gaming"],
    "Sports & Outdoors": ["fitness", "exercise", "sports", "gym", "outdoor", "bike", "ball", "athletic"],
    "Beauty & Health": ["makeup", "skincare", "perfume", "cosmetics", "beauty", "hair", "health", "wellness"],
    Automotive: ["car", "automotive", "tire", "engine", "vehicle", "motorcycle", "auto"],
    "Books & Media": ["book", "novel", "textbook", "magazine", "journal", "manual", "dvd", "cd"],
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => desc.includes(keyword))) {
      return category
    }
  }

  return "Other"
}

function extractBrandFromDescription(description: string): string | undefined {
  const desc = description.toLowerCase()

  const commonBrands = [
    "apple",
    "samsung",
    "sony",
    "lg",
    "nike",
    "adidas",
    "microsoft",
    "google",
    "amazon",
    "dell",
    "hp",
    "lenovo",
    "canon",
    "nikon",
    "bose",
    "beats",
    "ford",
    "toyota",
    "honda",
    "bmw",
    "mercedes",
    "audi",
    "volkswagen",
  ]

  for (const brand of commonBrands) {
    if (desc.includes(brand)) {
      return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }

  return undefined
}
