export async function parseCSV(content: string): Promise<any[]> {
  try {
    const lines = content.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row")
    }

    // Handle CSV parsing with proper quote handling
    const parseCSVLine = (line: string): string[] => {
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
      return result
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.replace(/"/g, "").toLowerCase())
    const items = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]).map((v) => v.replace(/"/g, ""))
      const item: any = {}

      headers.forEach((header, index) => {
        item[header] = values[index] || ""
      })

      // Ensure we have a description field - try multiple common column names
      if (!item.description) {
        item.description =
          item.item || item.product || item.name || item.title || item["product name"] || item["item description"] || ""
      }

      // Only add items that have some description
      if (item.description && item.description.trim()) {
        items.push(item)
      }
    }

    if (items.length === 0) {
      throw new Error("No valid items found in CSV file. Please ensure your CSV has a description column.")
    }

    return items
  } catch (error) {
    console.error("Error parsing CSV:", error)
    throw new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function parseExcel(buffer: ArrayBuffer): Promise<any[]> {
  // In a real implementation, we would use a library like xlsx to parse Excel files
  throw new Error("Excel parsing not implemented in this demo")
}

export async function parsePDF(buffer: ArrayBuffer): Promise<any[]> {
  // In a real implementation, we would use OCR to extract text from PDF files
  throw new Error("PDF parsing not implemented in this demo")
}
