"use server"

export interface ParsedCSVData {
  headers: string[]
  rows: string[][]
}

export async function parseCSV(content: string): Promise<ParsedCSVData> {
  console.log("📄 Parsing CSV content...")

  try {
    // Clean and normalize the content
    const cleanContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim()

    if (!cleanContent) {
      throw new Error("Empty CSV content")
    }

    const lines = cleanContent.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("CSV must have at least header and one data row")
    }

    // Parse header
    const headers = parseCSVLine(lines[0])

    // Parse data rows
    const rows: string[][] = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line) {
        rows.push(parseCSVLine(line))
      }
    }

    console.log(`✅ Parsed ${rows.length} data rows with ${headers.length} columns`)

    return {
      headers,
      rows,
    }
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

export function validateCSVHeaders(headers: string[], requiredHeaders: string[]): boolean {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim())

  return requiredHeaders.every((required) =>
    normalizedHeaders.some((header) => header.includes(required.toLowerCase())),
  )
}

export function findColumnIndex(headers: string[], columnName: string): number {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim())
  const normalizedColumn = columnName.toLowerCase()

  return normalizedHeaders.findIndex((header) => header.includes(normalizedColumn))
}
