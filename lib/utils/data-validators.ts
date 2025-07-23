"use server"

import { z } from "zod"

// Core validation schemas
export const PriceSchema = z.number().min(0, "Price must be non-negative").max(1000000, "Price seems unreasonably high")

export const QuantitySchema = z
  .number()
  .int()
  .min(1, "Quantity must be at least 1")
  .max(10000, "Quantity seems unreasonably high")

export const DescriptionSchema = z
  .string()
  .min(3, "Description must be at least 3 characters")
  .max(500, "Description too long")

export const BrandSchema = z.string().min(1, "Brand name cannot be empty").max(100, "Brand name too long").optional()

export const CategorySchema = z.string().min(1, "Category cannot be empty").max(50, "Category name too long").optional()

export const ConditionSchema = z
  .enum(["New", "Used", "Refurbished", "Open Box", "Damaged", "Unknown"], {
    errorMap: () => ({ message: "Condition must be one of: New, Used, Refurbished, Open Box, Damaged, Unknown" }),
  })
  .optional()

// Enhanced manifest item schema with comprehensive validation
export const ValidatedManifestItemSchema = z.object({
  id: z.string().optional(),
  description: DescriptionSchema,
  brand: BrandSchema,
  category: CategorySchema,
  condition: ConditionSchema,
  quantity: QuantitySchema,
  price: PriceSchema,
  retailPrice: PriceSchema.optional(),
  totalPrice: PriceSchema.optional(),
  upc: z
    .string()
    .regex(/^\d{12}$/, "UPC must be 12 digits")
    .optional()
    .or(z.literal("")),
  sku: z.string().min(1, "SKU cannot be empty").max(50, "SKU too long").optional(),
  location: z.string().max(100, "Location too long").optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export type ValidatedManifestItem = z.infer<typeof ValidatedManifestItemSchema>

// Validation result types
export interface ValidationError {
  type: "error" | "warning" | "info"
  field: string
  message: string
  value?: any
  rowIndex?: number
  suggestion?: string
}

export interface ValidationSummary {
  isValid: boolean
  totalItems: number
  validItems: number
  invalidItems: number
  errors: ValidationError[]
  warnings: ValidationError[]
  suggestions: string[]
  dataQualityScore: number
}

// Business logic validators
export class ManifestValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []

  validateItem(item: any, rowIndex: number): ValidatedManifestItem | null {
    try {
      // Schema validation
      const validatedItem = ValidatedManifestItemSchema.parse(item)

      // Business logic validation
      this.validateBusinessRules(validatedItem, rowIndex)

      return validatedItem
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          this.errors.push({
            type: "error",
            field: err.path.join("."),
            message: err.message,
            value: err.code === "invalid_type" ? item[err.path[0]] : undefined,
            rowIndex,
            suggestion: this.getSuggestionForError(err),
          })
        })
      }
      return null
    }
  }

  private validateBusinessRules(item: ValidatedManifestItem, rowIndex: number) {
    // Price consistency checks
    if (item.retailPrice && item.retailPrice < item.price) {
      this.warnings.push({
        type: "warning",
        field: "retailPrice",
        message: "Retail price is lower than cost price",
        rowIndex,
        suggestion: "Verify pricing data - retail price should typically be higher than cost",
      })
    }

    // Total price calculation check
    const expectedTotal = item.price * item.quantity
    if (item.totalPrice && Math.abs(item.totalPrice - expectedTotal) > 0.01) {
      this.warnings.push({
        type: "warning",
        field: "totalPrice",
        message: `Total price (${item.totalPrice}) doesn't match price × quantity (${expectedTotal})`,
        rowIndex,
        suggestion: "Recalculate total price or verify individual price and quantity",
      })
    }

    // Description quality checks
    if (item.description.length < 10) {
      this.warnings.push({
        type: "warning",
        field: "description",
        message: "Description is very short and may lack detail",
        rowIndex,
        suggestion: "Consider adding more descriptive details for better analysis",
      })
    }

    // Brand consistency
    if (item.brand && item.brand.toLowerCase() === item.brand) {
      this.warnings.push({
        type: "warning",
        field: "brand",
        message: "Brand name appears to be all lowercase",
        rowIndex,
        suggestion: "Consider proper capitalization for brand names",
      })
    }

    // High-value item checks
    if (item.price > 1000) {
      this.warnings.push({
        type: "info",
        field: "price",
        message: "High-value item detected",
        rowIndex,
        suggestion: "Verify pricing for high-value items and consider additional security measures",
      })
    }

    // Quantity reasonableness
    if (item.quantity > 100) {
      this.warnings.push({
        type: "warning",
        field: "quantity",
        message: "Very high quantity detected",
        rowIndex,
        suggestion: "Verify quantity is correct - consider bulk handling procedures",
      })
    }
  }

  private getSuggestionForError(error: z.ZodIssue): string {
    switch (error.code) {
      case "too_small":
        if (error.type === "string") {
          return `Minimum length is ${error.minimum} characters`
        }
        return `Minimum value is ${error.minimum}`
      case "too_big":
        if (error.type === "string") {
          return `Maximum length is ${error.maximum} characters`
        }
        return `Maximum value is ${error.maximum}`
      case "invalid_type":
        return `Expected ${error.expected}, got ${error.received}`
      case "invalid_enum_value":
        return `Valid options are: ${error.options.join(", ")}`
      default:
        return "Please check the data format"
    }
  }

  getValidationSummary(totalItems: number, validItems: number): ValidationSummary {
    const invalidItems = totalItems - validItems
    const dataQualityScore = totalItems > 0 ? (validItems / totalItems) * 100 : 0

    // Generate suggestions based on common issues
    const suggestions = this.generateSuggestions()

    return {
      isValid: this.errors.length === 0 && validItems > 0,
      totalItems,
      validItems,
      invalidItems,
      errors: this.errors,
      warnings: this.warnings,
      suggestions,
      dataQualityScore: Math.round(dataQualityScore * 100) / 100,
    }
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = []

    // Error-based suggestions
    const errorTypes = new Set(this.errors.map((e) => e.field))
    if (errorTypes.has("description")) {
      suggestions.push("Ensure all items have detailed product descriptions")
    }
    if (errorTypes.has("price")) {
      suggestions.push("Verify all prices are valid positive numbers")
    }
    if (errorTypes.has("quantity")) {
      suggestions.push("Check that all quantities are positive integers")
    }

    // Warning-based suggestions
    const warningTypes = new Set(this.warnings.map((w) => w.field))
    if (warningTypes.has("retailPrice")) {
      suggestions.push("Review pricing structure - retail prices should typically exceed cost prices")
    }
    if (warningTypes.has("totalPrice")) {
      suggestions.push("Verify total price calculations for accuracy")
    }

    // General suggestions
    if (this.warnings.length > this.errors.length * 2) {
      suggestions.push("Consider reviewing data entry processes to improve consistency")
    }

    return suggestions
  }

  reset() {
    this.errors = []
    this.warnings = []
  }
}

// File-level validators
export async function validateCSVStructure(content: string): Promise<{
  isValid: boolean
  errors: string[]
  warnings: string[]
  metadata: {
    totalLines: number
    headerCount: number
    estimatedRows: number
    fileSize: number
  }
}> {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic file checks
  if (!content || content.trim().length === 0) {
    errors.push("File is empty")
    return {
      isValid: false,
      errors,
      warnings,
      metadata: { totalLines: 0, headerCount: 0, estimatedRows: 0, fileSize: 0 },
    }
  }

  const lines = content.split(/\r?\n/)
  const nonEmptyLines = lines.filter((line) => line.trim())

  if (nonEmptyLines.length < 2) {
    errors.push("File must contain at least a header row and one data row")
  }

  // Header validation
  if (nonEmptyLines.length > 0) {
    const header = nonEmptyLines[0]
    const headerColumns = header.split(",").map((h) => h.trim())

    if (headerColumns.length < 3) {
      errors.push("CSV should have at least 3 columns (description, quantity, price)")
    }

    // Check for required columns
    const requiredColumns = ["description", "quantity", "price"]
    const headerLower = headerColumns.map((h) => h.toLowerCase())

    requiredColumns.forEach((required) => {
      if (!headerLower.some((h) => h.includes(required) || h.includes(required.substring(0, 3)))) {
        errors.push(`Missing required column: ${required}`)
      }
    })

    // Check for empty headers
    const emptyHeaders = headerColumns.filter((h) => !h.trim())
    if (emptyHeaders.length > 0) {
      warnings.push(`Found ${emptyHeaders.length} empty header(s)`)
    }

    // Check for duplicate headers
    const duplicateHeaders = headerColumns.filter((h, i) => headerColumns.indexOf(h) !== i)
    if (duplicateHeaders.length > 0) {
      warnings.push(`Found duplicate headers: ${duplicateHeaders.join(", ")}`)
    }
  }

  // Data consistency checks
  if (nonEmptyLines.length > 1) {
    const headerColumnCount = nonEmptyLines[0].split(",").length
    let inconsistentRows = 0

    for (let i = 1; i < Math.min(nonEmptyLines.length, 100); i++) {
      // Check first 100 rows
      const rowColumnCount = nonEmptyLines[i].split(",").length
      if (rowColumnCount !== headerColumnCount) {
        inconsistentRows++
      }
    }

    if (inconsistentRows > 0) {
      warnings.push(`${inconsistentRows} rows have inconsistent column counts`)
    }
  }

  // File size warnings
  const fileSizeKB = content.length / 1024
  if (fileSizeKB > 5000) {
    // 5MB
    warnings.push("Large file detected - processing may take longer")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      totalLines: lines.length,
      headerCount: nonEmptyLines.length > 0 ? nonEmptyLines[0].split(",").length : 0,
      estimatedRows: nonEmptyLines.length - 1,
      fileSize: content.length,
    },
  }
}

// Data quality analyzer
export function analyzeDataQuality(items: ValidatedManifestItem[]): {
  overallScore: number
  completenessScore: number
  consistencyScore: number
  accuracyScore: number
  insights: string[]
} {
  if (items.length === 0) {
    return {
      overallScore: 0,
      completenessScore: 0,
      consistencyScore: 0,
      accuracyScore: 0,
      insights: ["No valid items to analyze"],
    }
  }

  // Completeness analysis
  const completenessMetrics = {
    hasDescription: items.filter((i) => i.description && i.description.length > 10).length,
    hasBrand: items.filter((i) => i.brand && i.brand.trim()).length,
    hasCategory: items.filter((i) => i.category && i.category.trim()).length,
    hasCondition: items.filter((i) => i.condition && i.condition !== "Unknown").length,
    hasRetailPrice: items.filter((i) => i.retailPrice && i.retailPrice > 0).length,
  }

  const completenessScore =
    ((completenessMetrics.hasDescription / items.length) * 0.4 +
      (completenessMetrics.hasBrand / items.length) * 0.2 +
      (completenessMetrics.hasCategory / items.length) * 0.2 +
      (completenessMetrics.hasCondition / items.length) * 0.1 +
      (completenessMetrics.hasRetailPrice / items.length) * 0.1) *
    100

  // Consistency analysis
  const brands = new Set(items.map((i) => i.brand).filter(Boolean))
  const categories = new Set(items.map((i) => i.category).filter(Boolean))
  const conditions = new Set(items.map((i) => i.condition).filter(Boolean))

  const consistencyScore = Math.min(
    100,
    (brands.size < items.length * 0.8 ? 100 : 50) * 0.4 +
      (categories.size < items.length * 0.5 ? 100 : 50) * 0.4 +
      (conditions.size <= 6 ? 100 : 50) * 0.2,
  )

  // Accuracy analysis (based on reasonable values)
  const accuracyMetrics = {
    reasonablePrices: items.filter((i) => i.price > 0 && i.price < 10000).length,
    reasonableQuantities: items.filter((i) => i.quantity > 0 && i.quantity < 1000).length,
    consistentTotals: items.filter((i) => !i.totalPrice || Math.abs(i.totalPrice - i.price * i.quantity) < 0.01).length,
  }

  const accuracyScore =
    ((accuracyMetrics.reasonablePrices / items.length) * 0.4 +
      (accuracyMetrics.reasonableQuantities / items.length) * 0.3 +
      (accuracyMetrics.consistentTotals / items.length) * 0.3) *
    100

  const overallScore = completenessScore * 0.4 + consistencyScore * 0.3 + accuracyScore * 0.3

  // Generate insights
  const insights: string[] = []

  if (completenessScore < 70) {
    insights.push("Data completeness could be improved - consider adding more detailed product information")
  }
  if (consistencyScore < 70) {
    insights.push(
      "Data consistency issues detected - review brand names, categories, and conditions for standardization",
    )
  }
  if (accuracyScore < 70) {
    insights.push("Data accuracy concerns found - verify prices, quantities, and calculations")
  }
  if (overallScore >= 90) {
    insights.push("Excellent data quality - ready for comprehensive analysis")
  } else if (overallScore >= 70) {
    insights.push("Good data quality with minor improvements possible")
  } else {
    insights.push("Data quality needs improvement before optimal analysis results")
  }

  return {
    overallScore: Math.round(overallScore),
    completenessScore: Math.round(completenessScore),
    consistencyScore: Math.round(consistencyScore),
    accuracyScore: Math.round(accuracyScore),
    insights,
  }
}
