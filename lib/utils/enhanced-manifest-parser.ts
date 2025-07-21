"use server"

export interface EnhancedManifestItem {
  product: string
  quantity: number
  retailPrice: number
  totalRetailPrice: number
  condition: string
  rawData: Record<string, string>
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
        const values = parseCSVLine(lines[i])

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
        const retailPrice = parsePrice(retailPriceStr)
        const totalRetailPrice = parsePrice(totalRetailPriceStr)

        const item: EnhancedManifestItem = {
          product: product.trim(),
          quantity,
          retailPrice,
          totalRetailPrice,
          condition: condition || "Unknown",
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

function parseCSVLine(line: string): string[] {
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

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0

  // Remove currency symbols, commas, spaces, and extract numeric value
  const cleanPrice = priceStr.replace(/[$,\s]/g, "").replace(/[^\d.-]/g, "")
  const price = Number.parseFloat(cleanPrice) || 0

  return Math.max(0, price) // Ensure non-negative
}

export function validateManifestStructure(items: EnhancedManifestItem[]): {
  isValid: boolean
  issues: string[]
  stats: {
    totalItems: number
    itemsWithPrices: number
    itemsWithCondition: number
    averageRetailPrice: number
    totalRetailValue: number
  }
} {
  const issues: string[] = []

  if (items.length === 0) {
    issues.push("No valid items found in manifest")
    return {
      isValid: false,
      issues,
      stats: {
        totalItems: 0,
        itemsWithPrices: 0,
        itemsWithCondition: 0,
        averageRetailPrice: 0,
        totalRetailValue: 0,
      },
    }
  }

  const itemsWithPrices = items.filter((item) => item.retailPrice > 0).length
  const itemsWithCondition = items.filter((item) => item.condition && item.condition !== "Unknown").length
  const totalRetailValue = items.reduce(
    (sum, item) => sum + (item.totalRetailPrice || item.retailPrice * item.quantity),
    0,
  )
  const averageRetailPrice = items.reduce((sum, item) => sum + item.retailPrice, 0) / items.length

  if (itemsWithPrices < items.length * 0.5) {
    issues.push("More than 50% of items are missing retail prices")
  }

  if (itemsWithCondition < items.length * 0.3) {
    issues.push("More than 70% of items are missing condition information")
  }

  return {
    isValid: issues.length === 0,
    issues,
    stats: {
      totalItems: items.length,
      itemsWithPrices,
      itemsWithCondition,
      averageRetailPrice,
      totalRetailValue,
    },
  }
}
