"use server"

// Re-export from enhanced parser for backward compatibility
export {
  parseEnhancedManifestCSV,
  validateManifestStructure,
  type EnhancedManifestItem,
  type ManifestValidation,
} from "./enhanced-manifest-parser"

export interface ParsedManifestItem {
  price: number
  description: string
  quantity?: number
  condition?: string
  category?: string
  brand?: string
  model?: string
  rawData: Record<string, string>
}

export async function parseManifestCSV(content: string): Promise<ParsedManifestItem[]> {
  try {
    const lines = content.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row")
    }

    // Parse headers
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("📋 Detected headers:", headers)

    const items: ParsedManifestItem[] = []

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])

      if (values.length < 2) continue // Skip incomplete rows

      // Create raw data object
      const rawData: Record<string, string> = {}
      headers.forEach((header, index) => {
        rawData[header] = values[index] || ""
      })

      // Extract price (first column based on your schema)
      const priceStr = values[0]?.replace(/[^0-9.-]/g, "") || "0"
      const price = Number.parseFloat(priceStr) || 0

      // Extract description (second column based on your schema)
      const description = values[1] || ""

      // Skip items without valid description
      if (!description.trim() || description.length < 5) {
        continue
      }

      // Extract additional fields if available
      const quantity = extractQuantity(description)
      const condition = extractCondition(description)

      const item: ParsedManifestItem = {
        price,
        description: description.trim(),
        quantity,
        condition,
        rawData,
      }

      items.push(item)
    }

    console.log(`✅ Parsed ${items.length} valid items from manifest`)
    return items
  } catch (error) {
    console.error("❌ Error parsing manifest CSV:", error)
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

function extractQuantity(description: string): number | undefined {
  const qtyMatch = description.match(/(?:qty|quantity|count|pcs?|pieces?)\s*:?\s*(\d+)/i)
  return qtyMatch ? Number.parseInt(qtyMatch[1]) : undefined
}

function extractCondition(description: string): string | undefined {
  const conditions = ["new", "used", "refurbished", "open box", "damaged", "excellent", "good", "fair", "poor"]
  const lowerDesc = description.toLowerCase()

  for (const condition of conditions) {
    if (lowerDesc.includes(condition)) {
      return condition.charAt(0).toUpperCase() + condition.slice(1)
    }
  }

  return undefined
}
