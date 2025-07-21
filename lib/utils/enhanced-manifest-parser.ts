"use server"

export interface EnhancedManifestItem {
  id: string
  product: string
  quantity: number
  retailPrice: number
  condition: string
  category?: string
  brand?: string
  model?: string
  totalRetailPrice: number
  rawData: Record<string, string>
}

export interface ManifestValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  totalItems: number
  validItems: number
}

export async function parseEnhancedManifestCSV(content: string): Promise<EnhancedManifestItem[]> {
  try {
    console.log("📋 Starting enhanced manifest parsing...")
    console.log(`📋 Content length: ${content.length} characters`)

    const lines = content.split("\n").filter((line) => line.trim())
    console.log(`📋 Found ${lines.length} lines in CSV`)

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row")
    }

    // Parse headers - expected: Product, Quantity, Retail Price, Total Retail Price, Condition
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("📋 Detected headers:", headers)

    // Log first few lines for debugging
    console.log("📋 First 3 lines:")
    lines.slice(0, 3).forEach((line, index) => {
      console.log(`  Line ${index}: ${line.substring(0, 100)}...`)
    })

    const items: EnhancedManifestItem[] = []

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = await parseCSVLine(lines[i])

        if (values.length < 3) {
          console.log(`⚠️ Skipping incomplete row ${i}: only ${values.length} columns`)
          continue // Skip incomplete rows
        }

        // Create raw data object
        const rawData: Record<string, string> = {}
        headers.forEach((header, index) => {
          rawData[header] = values[index] || ""
        })

        // Extract and clean data based on the schema
        const product = (values[0] || "").trim()
        const quantityStr = (values[1] || "1").trim()
        const retailPriceStr = (values[2] || "0").trim()
        const totalRetailPriceStr = (values[3] || "0").trim()
        const condition = (values[4] || "Unknown").trim()

        // Skip items without valid product description
        if (!product || product.length < 5) {
          console.log(`⚠️ Skipping row ${i}: invalid product description`)
          continue
        }

        // Parse numeric values
        const quantity = Number.parseInt(quantityStr) || 1
        const retailPrice = await parsePrice(retailPriceStr)
        const totalRetailPrice = await parsePrice(totalRetailPriceStr)

        const category = await extractCategory(product)
        const brand = await extractBrand(product)

        const item: EnhancedManifestItem = {
          id: `item-${i}-${Date.now()}`,
          product: product.trim(),
          quantity,
          retailPrice,
          condition: condition || "Unknown",
          category,
          brand,
          totalRetailPrice: totalRetailPrice || retailPrice * quantity,
          rawData,
        }

        items.push(item)

        // Log first few items for verification
        if (i <= 3) {
          console.log(`📋 Parsed item ${i}:`, {
            product: item.product.substring(0, 50) + "...",
            quantity: item.quantity,
            retailPrice: item.retailPrice,
            totalRetailPrice: item.totalRetailPrice,
            condition: item.condition,
            category: item.category,
            brand: item.brand,
          })
        }
      } catch (rowError) {
        console.error(`❌ Error parsing row ${i}:`, rowError)
        continue // Skip problematic rows
      }
    }

    console.log(`✅ Parsed ${items.length} valid items from enhanced manifest`)

    if (items.length === 0) {
      throw new Error("No valid items could be parsed from the CSV file. Please check the file format.")
    }

    return items
  } catch (error) {
    console.error("❌ Error parsing enhanced manifest CSV:", error)
    throw new Error(`Failed to parse manifest: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function parseCSVLine(line: string): Promise<string[]> {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"' && (i === 0 || line[i - 1] === ",")) {
      inQuotes = true
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ",")) {
      inQuotes = false
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result.map((v) => v.replace(/^"|"$/g, ""))
}

async function parsePrice(priceStr: string): Promise<number> {
  if (!priceStr) return 0

  // Remove currency symbols, commas, spaces, and extract numeric value
  const cleanPrice = priceStr.replace(/[$,\s]/g, "").replace(/[^\d.-]/g, "")
  const price = Number.parseFloat(cleanPrice) || 0

  return Math.max(0, price) // Ensure non-negative
}

async function extractCategory(description: string): Promise<string | undefined> {
  const categories = {
    electronics: ["phone", "laptop", "tablet", "tv", "computer", "headphones", "speaker", "camera"],
    clothing: ["shirt", "pants", "dress", "shoes", "jacket", "coat", "hat", "jeans"],
    home: ["furniture", "chair", "table", "lamp", "bed", "sofa", "kitchen", "bathroom"],
    toys: ["toy", "game", "puzzle", "doll", "action figure", "lego", "board game"],
    sports: ["fitness", "exercise", "sports", "gym", "outdoor", "bike", "ball"],
    beauty: ["makeup", "skincare", "perfume", "cosmetics", "beauty", "hair"],
    auto: ["car", "automotive", "tire", "engine", "vehicle", "motorcycle"],
    books: ["book", "novel", "textbook", "magazine", "journal", "manual"],
  }

  const lowerDesc = description.toLowerCase()

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  return "Other"
}

async function extractBrand(description: string): Promise<string | undefined> {
  const brands = [
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
  ]

  const lowerDesc = description.toLowerCase()

  for (const brand of brands) {
    if (lowerDesc.includes(brand)) {
      return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }

  return undefined
}

async function extractCondition(description: string): Promise<string | undefined> {
  const conditions = ["new", "used", "refurbished", "open box", "damaged", "excellent", "good", "fair", "poor"]
  const lowerDesc = description.toLowerCase()

  for (const condition of conditions) {
    if (lowerDesc.includes(condition)) {
      return condition.charAt(0).toUpperCase() + condition.slice(1)
    }
  }

  return undefined
}

export async function validateManifestStructure(items: EnhancedManifestItem[]): Promise<ManifestValidation> {
  const errors: string[] = []
  const warnings: string[] = []
  let validItems = 0

  if (items.length === 0) {
    errors.push("No valid items found in manifest")
    return {
      isValid: false,
      errors,
      warnings,
      totalItems: 0,
      validItems: 0,
    }
  }

  for (const item of items) {
    let itemValid = true

    // Check required fields
    if (!item.product || item.product.trim().length < 3) {
      errors.push(`Item ${item.id}: Product description too short or missing`)
      itemValid = false
    }

    if (item.retailPrice <= 0) {
      errors.push(`Item ${item.id}: Invalid retail price`)
      itemValid = false
    }

    if (item.quantity <= 0) {
      warnings.push(`Item ${item.id}: Invalid quantity, defaulting to 1`)
    }

    // Check for suspicious data
    if (item.retailPrice > 10000) {
      warnings.push(`Item ${item.id}: Very high retail price ($${item.retailPrice})`)
    }

    if (itemValid) {
      validItems++
    }
  }

  // Overall validation
  const validationRate = validItems / items.length
  if (validationRate < 0.8) {
    warnings.push(`Low validation rate: ${(validationRate * 100).toFixed(1)}% of items are valid`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalItems: items.length,
    validItems,
  }
}

export async function enhanceManifestItems(items: EnhancedManifestItem[]): Promise<EnhancedManifestItem[]> {
  console.log(`🔧 Enhancing ${items.length} manifest items...`)

  return items.map((item) => ({
    ...item,
    // Add any additional enhancements here
    category: item.category || "Other",
    condition: item.condition || "Unknown",
  }))
}
