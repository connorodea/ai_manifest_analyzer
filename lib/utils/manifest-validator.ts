"use server"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ManifestItem {
  brand: string
  description: string
  msrp: number
  qty: number
  condition?: string
  category?: string
}

export function validateManifestStructure(items: ManifestItem[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!items || items.length === 0) {
    errors.push("No items found in manifest")
    return { isValid: false, errors, warnings }
  }

  // Check each item
  items.forEach((item, index) => {
    const rowNum = index + 1

    // Required fields validation
    if (!item.brand || item.brand.trim() === "") {
      errors.push(`Row ${rowNum}: Missing brand`)
    }

    if (!item.description || item.description.trim() === "") {
      errors.push(`Row ${rowNum}: Missing description`)
    }

    if (typeof item.msrp !== "number" || item.msrp <= 0) {
      errors.push(`Row ${rowNum}: Invalid MSRP (${item.msrp})`)
    }

    if (typeof item.qty !== "number" || item.qty <= 0 || !Number.isInteger(item.qty)) {
      errors.push(`Row ${rowNum}: Invalid quantity (${item.qty})`)
    }

    // Warnings for data quality
    if (item.msrp > 10000) {
      warnings.push(`Row ${rowNum}: Unusually high MSRP ($${item.msrp})`)
    }

    if (item.qty > 100) {
      warnings.push(`Row ${rowNum}: High quantity (${item.qty})`)
    }

    if (item.brand === "Unknown" || item.brand.toLowerCase().includes("generic")) {
      warnings.push(`Row ${rowNum}: Unknown or generic brand`)
    }
  })

  // Summary validations
  const totalValue = items.reduce((sum, item) => sum + item.msrp * item.qty, 0)
  if (totalValue === 0) {
    errors.push("Total manifest value is zero")
  }

  const uniqueBrands = new Set(items.map((item) => item.brand)).size
  if (uniqueBrands === 1) {
    warnings.push("All items are from the same brand")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateCSVStructure(headers: string[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const requiredHeaders = ["brand", "description", "msrp", "qty"]
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim())

  // Check for required headers
  for (const required of requiredHeaders) {
    const found = normalizedHeaders.some(
      (header) => header.includes(required) || (required === "qty" && (header.includes("quantity") || header === "q")),
    )

    if (!found) {
      errors.push(`Missing required column: ${required}`)
    }
  }

  // Check for duplicate headers
  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index)

  if (duplicates.length > 0) {
    warnings.push(`Duplicate headers found: ${duplicates.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function sanitizeManifestData(items: ManifestItem[]): ManifestItem[] {
  return items
    .filter((item) => item.brand && item.description && item.msrp > 0 && item.qty > 0)
    .map((item) => ({
      ...item,
      brand: item.brand.trim(),
      description: item.description.trim(),
      msrp: Math.round(item.msrp * 100) / 100, // Round to 2 decimal places
      qty: Math.floor(item.qty), // Ensure integer
      condition: item.condition?.trim() || "Unknown",
      category: item.category?.trim() || "Other",
    }))
}
