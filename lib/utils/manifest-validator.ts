"use server"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  validItems: number
  totalItems: number
  totalValue: number
}

export async function validateManifestStructure(items: any[]): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []
  let validItems = 0
  let totalValue = 0

  if (!items || items.length === 0) {
    errors.push("No items found in manifest")
    return {
      isValid: false,
      errors,
      warnings,
      validItems: 0,
      totalItems: 0,
      totalValue: 0,
    }
  }

  items.forEach((item, index) => {
    let itemValid = true

    // Check required fields
    if (!item.product || typeof item.product !== "string" || !item.product.trim()) {
      errors.push(`Row ${index + 1}: Missing or invalid product name`)
      itemValid = false
    }

    if (!item.retailPrice || typeof item.retailPrice !== "number" || item.retailPrice <= 0) {
      errors.push(`Row ${index + 1}: Missing or invalid retail price`)
      itemValid = false
    }

    if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
      errors.push(`Row ${index + 1}: Missing or invalid quantity`)
      itemValid = false
    }

    // Check optional fields and add warnings
    if (!item.condition || typeof item.condition !== "string") {
      warnings.push(`Row ${index + 1}: Missing condition information`)
    }

    if (itemValid) {
      validItems++
      totalValue += item.totalRetailPrice || item.retailPrice * item.quantity
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validItems,
    totalItems: items.length,
    totalValue,
  }
}

export async function validateCSVStructure(headers: string[], rows: string[][]): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for required headers
  const requiredHeaders = ["product", "price", "quantity"]
  const headerLower = headers.map((h) => h.toLowerCase())

  const missingHeaders = requiredHeaders.filter((required) => !headerLower.some((header) => header.includes(required)))

  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(", ")}`)
  }

  // Check row consistency
  const inconsistentRows = rows.filter((row) => row.length !== headers.length)
  if (inconsistentRows.length > 0) {
    warnings.push(`${inconsistentRows.length} rows have inconsistent column counts`)
  }

  // Check for empty rows
  const emptyRows = rows.filter((row) => row.every((cell) => !cell.trim()))
  if (emptyRows.length > 0) {
    warnings.push(`Found ${emptyRows.length} empty rows`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validItems: rows.length - inconsistentRows.length - emptyRows.length,
    totalItems: rows.length,
    totalValue: 0, // Will be calculated during parsing
  }
}
