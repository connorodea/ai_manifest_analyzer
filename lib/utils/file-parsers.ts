"use server"

export interface ParsedFileData {
  headers: string[]
  rows: string[][]
  totalRows: number
  fileType: string
  encoding?: string
}

export async function parseCSVFile(content: string): Promise<ParsedFileData> {
  try {
    console.log(`📄 Parsing CSV content (${content.length} characters)...`)

    // Split into lines and filter empty ones
    const lines = content.split(/\r?\n/).filter((line) => line.trim())

    if (lines.length === 0) {
      throw new Error("CSV file is empty")
    }

    // Parse header row
    const headers = parseCSVLine(lines[0])
    console.log(`📋 Found ${headers.length} headers:`, headers)

    // Parse data rows
    const rows: string[][] = []
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCSVLine(lines[i])
        if (row.length > 0 && row.some((cell) => cell.trim())) {
          rows.push(row)
        }
      } catch (error) {
        console.warn(`⚠️ Skipping malformed row ${i + 1}:`, error)
      }
    }

    console.log(`✅ Parsed ${rows.length} data rows from CSV`)

    return {
      headers,
      rows,
      totalRows: rows.length,
      fileType: "csv",
    }
  } catch (error) {
    console.error("❌ CSV parsing failed:", error)
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
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

  // Clean up quoted fields
  return result.map((field) => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1).replace(/""/g, '"')
    }
    return field
  })
}

export async function parseExcelFile(content: string): Promise<ParsedFileData> {
  // Note: This is a placeholder for Excel parsing
  // In a real implementation, you'd use a library like xlsx
  throw new Error("Excel file parsing not implemented yet")
}

export async function parsePDFFile(content: string): Promise<ParsedFileData> {
  // Note: This is a placeholder for PDF parsing
  // In a real implementation, you'd use a library like pdf-parse
  throw new Error("PDF file parsing not implemented yet")
}

export async function detectFileType(filename: string, content: string): Promise<string> {
  const extension = filename.toLowerCase().split(".").pop()

  switch (extension) {
    case "csv":
      return "csv"
    case "xlsx":
    case "xls":
      return "excel"
    case "pdf":
      return "pdf"
    case "txt":
      return "text"
    default:
      // Try to detect based on content
      if (content.includes(",") && content.includes("\n")) {
        return "csv"
      }
      return "unknown"
  }
}

export async function validateFileStructure(
  data: ParsedFileData,
  expectedHeaders?: string[],
): Promise<{
  isValid: boolean
  issues: string[]
  suggestions: string[]
}> {
  const issues: string[] = []
  const suggestions: string[] = []

  // Check if file has data
  if (data.totalRows === 0) {
    issues.push("File contains no data rows")
    return { isValid: false, issues, suggestions }
  }

  // Check header count
  if (data.headers.length === 0) {
    issues.push("File has no headers")
  } else if (data.headers.length < 2) {
    issues.push("File should have at least 2 columns")
    suggestions.push("Ensure your file has product description and price columns")
  }

  // Check for empty headers
  const emptyHeaders = data.headers.filter((h) => !h.trim())
  if (emptyHeaders.length > 0) {
    issues.push(`Found ${emptyHeaders.length} empty header(s)`)
    suggestions.push("All columns should have descriptive headers")
  }

  // Check row consistency
  const inconsistentRows = data.rows.filter((row) => row.length !== data.headers.length)
  if (inconsistentRows.length > 0) {
    issues.push(`${inconsistentRows.length} rows have inconsistent column counts`)
    suggestions.push("Ensure all rows have the same number of columns as headers")
  }

  // Check for expected headers if provided
  if (expectedHeaders) {
    const missingHeaders = expectedHeaders.filter(
      (expected) => !data.headers.some((header) => header.toLowerCase().includes(expected.toLowerCase())),
    )

    if (missingHeaders.length > 0) {
      issues.push(`Missing expected headers: ${missingHeaders.join(", ")}`)
      suggestions.push("Ensure your file includes columns for product description and pricing")
    }
  }

  // Check data quality
  const emptyRows = data.rows.filter((row) => row.every((cell) => !cell.trim()))
  if (emptyRows.length > 0) {
    issues.push(`Found ${emptyRows.length} completely empty rows`)
    suggestions.push("Remove empty rows from your file")
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  }
}

export async function extractSampleData(
  data: ParsedFileData,
  sampleSize = 5,
): Promise<{
  headers: string[]
  sampleRows: string[][]
  totalRows: number
}> {
  return {
    headers: data.headers,
    sampleRows: data.rows.slice(0, sampleSize),
    totalRows: data.totalRows,
  }
}
