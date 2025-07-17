export async function parseCSV(content: string): Promise<any[]> {
  const lines = content.split("\n").filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const items = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
    const item: any = {}

    headers.forEach((header, index) => {
      item[header.toLowerCase()] = values[index] || ""
    })

    // Ensure we have a description field
    if (!item.description && (item.item || item.product || item.name)) {
      item.description = item.item || item.product || item.name
    }

    if (item.description) {
      items.push(item)
    }
  }

  return items
}

export async function parseExcel(buffer: ArrayBuffer): Promise<any[]> {
  // In a real implementation, we would use a library like xlsx to parse Excel files
  throw new Error("Excel parsing not implemented in this demo")
}

export async function parsePDF(buffer: ArrayBuffer): Promise<any[]> {
  // In a real implementation, we would use OCR to extract text from PDF files
  throw new Error("PDF parsing not implemented in this demo")
}
