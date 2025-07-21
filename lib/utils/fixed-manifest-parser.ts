"use server"

export interface FixedManifestItem {
  product: string
  retailPrice: number
  quantity: number
  condition: string
  totalRetailPrice: number
  rowNumber: number
}

export interface ManifestValidation {
  isValid: boolean
  issues: string[]
  itemCount: number
  totalValue: number
}

export async function parseManifestCSVFixed(content: string): Promise<FixedManifestItem[]> {
  console.log("🔧 FIXED CSV PARSER - Starting parse...")
  console.log(`📄 Content length: ${content.length} characters`)

  try {
    // Clean and normalize the content
    const cleanContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim()

    if (!cleanContent) {
      throw new Error("Empty file content")
    }

    const lines = cleanContent.split("\n").filter((line) => line.trim())
    console.log(`📋 Found ${lines.length} lines`)

    if (lines.length < 2) {
      throw new Error("File must have at least a header and one data row")
    }

    // Parse header
    const headerLine = lines[0]
    const headers = parseCSVLine(headerLine)
    console.log(`📊 Headers: ${headers.join(", ")}`)

    // Map headers to expected fields (case-insensitive)
    const headerMap = mapHeaders(headers)
    console.log(`🗺️ Header mapping:`, headerMap)

    const items: FixedManifestItem[] = []

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const values = parseCSVLine(line)
        const item = parseItemFromRow(values, headerMap, i + 1)
        if (item) {
          items.push(item)
        }
      } catch (error) {
        console.warn(`⚠️ Skipping row ${i + 1}: ${error instanceof Error ? error.message : "Parse error"}`)
      }
    }

    console.log(`✅ Successfully parsed ${items.length} items`)
    return items
  } catch (error) {
    console.error("❌ CSV parsing failed:", error)
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""))
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ""))
  return result
}

function mapHeaders(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}

  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().trim()

    // Product/Description mapping
    if (
      normalized.includes("product") ||
      normalized.includes("description") ||
      normalized.includes("item") ||
      normalized.includes("title")
    ) {
      map.product = index
    }
    // Price mapping
    else if (
      normalized.includes("retail") &&
      (normalized.includes("price") || normalized.includes("cost") || normalized.includes("value"))
    ) {
      map.retailPrice = index
    } else if (normalized.includes("price") && !normalized.includes("total")) {
      map.retailPrice = index
    }
    // Quantity mapping
    else if (normalized.includes("quantity") || normalized.includes("qty") || normalized === "q") {
      map.quantity = index
    }
    // Condition mapping
    else if (normalized.includes("condition") || normalized.includes("state")) {
      map.condition = index
    }
    // Total price mapping
    else if (normalized.includes("total") && normalized.includes("price")) {
      map.totalRetailPrice = index
    }
  })

  return map
}

function parseItemFromRow(
  values: string[],
  headerMap: Record<string, number>,
  rowNumber: number,
): FixedManifestItem | null {
  try {
    // Extract product name
    const product = values[headerMap.product]?.trim() || ""
    if (!product) {
      throw new Error("Missing product name")
    }

    // Extract and parse retail price
    const retailPriceStr = values[headerMap.retailPrice]?.trim() || "0"
    const retailPrice = parsePrice(retailPriceStr)

    // Extract quantity
    const quantityStr = values[headerMap.quantity]?.trim() || "1"
    const quantity = Number.parseInt(quantityStr) || 1

    // Extract condition
    const condition = values[headerMap.condition]?.trim() || "Unknown"

    // Calculate or extract total retail price
    let totalRetailPrice: number
    if (headerMap.totalRetailPrice !== undefined) {
      const totalStr = values[headerMap.totalRetailPrice]?.trim() || "0"
      totalRetailPrice = parsePrice(totalStr)
    } else {
      totalRetailPrice = retailPrice * quantity
    }

    return {
      product,
      retailPrice,
      quantity,
      condition,
      totalRetailPrice,
      rowNumber,
    }
  } catch (error) {
    console.warn(`Row ${rowNumber} parse error:`, error)
    return null
  }
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0

  // Remove currency symbols, commas, and extra spaces
  const cleaned = priceStr
    .replace(/[$£€¥₹]/g, "")
    .replace(/,/g, "")
    .trim()

  const price = Number.parseFloat(cleaned)
  return isNaN(price) ? 0 : price
}

export function validateFixedManifestStructure(items: FixedManifestItem[]): ManifestValidation {
  const issues: string[] = []
  let totalValue = 0

  if (items.length === 0) {
    issues.push("No items found in manifest")
  }

  items.forEach((item, index) => {
    if (!item.product.trim()) {
      issues.push(`Row ${index + 1}: Missing product name`)
    }
    if (item.retailPrice <= 0) {
      issues.push(`Row ${index + 1}: Invalid retail price`)
    }
    if (item.quantity <= 0) {
      issues.push(`Row ${index + 1}: Invalid quantity`)
    }

    totalValue += item.totalRetailPrice
  })

  return {
    isValid: issues.length === 0,
    issues,
    itemCount: items.length,
    totalValue,
  }
}
