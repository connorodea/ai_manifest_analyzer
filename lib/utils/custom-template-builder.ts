"use server"

import { z } from "zod"

export const FieldTypeSchema = z.enum(["text", "number", "date", "select", "boolean", "email", "url", "phone"])

export const CustomFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Field name is required"),
  description: z.string().optional(),
  type: FieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select fields
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
    })
    .optional(),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
})

export const CustomTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  fields: z.array(CustomFieldSchema).min(1, "At least one field is required"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
})

export type FieldType = z.infer<typeof FieldTypeSchema>
export type CustomField = z.infer<typeof CustomFieldSchema>
export type CustomTemplate = z.infer<typeof CustomTemplateSchema>

export const FIELD_TYPE_OPTIONS: Array<{ value: FieldType; label: string; description: string }> = [
  {
    value: "text",
    label: "Text",
    description: "Single line text input for names, descriptions, etc.",
  },
  {
    value: "number",
    label: "Number",
    description: "Numeric values like prices, quantities, measurements",
  },
  {
    value: "date",
    label: "Date",
    description: "Date values in YYYY-MM-DD format",
  },
  {
    value: "select",
    label: "Dropdown",
    description: "Predefined list of options (e.g., conditions, categories)",
  },
  {
    value: "boolean",
    label: "Yes/No",
    description: "True/false values for binary choices",
  },
  {
    value: "email",
    label: "Email",
    description: "Email addresses with validation",
  },
  {
    value: "url",
    label: "URL",
    description: "Web addresses and links",
  },
  {
    value: "phone",
    label: "Phone",
    description: "Phone numbers with formatting",
  },
]

export const TEMPLATE_CATEGORIES = [
  "Retail & E-commerce",
  "Liquidation & Wholesale",
  "Automotive",
  "Clothing & Fashion",
  "Electronics",
  "Home & Garden",
  "Books & Media",
  "Jewelry & Accessories",
  "Industrial Equipment",
  "Medical Supplies",
  "Food & Beverage",
  "Sports & Recreation",
  "Art & Collectibles",
  "Custom Category",
]

export function generateCustomTemplateCSV(template: CustomTemplate, includeExamples = false): string {
  const headers = template.fields.map((field) => field.name)

  if (!includeExamples) {
    return headers.map((header) => `"${header}"`).join(",")
  }

  // Generate example rows based on field types
  const exampleRows: string[][] = []
  for (let i = 0; i < 3; i++) {
    const row = template.fields.map((field) => generateExampleValue(field, i))
    exampleRows.push(row)
  }

  const allRows = [headers, ...exampleRows]
  return allRows
    .map((row) =>
      row
        .map((cell) => {
          if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
            return `"${cell.replace(/"/g, '""')}"`
          }
          return `"${cell}"`
        })
        .join(","),
    )
    .join("\n")
}

function generateExampleValue(field: CustomField, index: number): string {
  if (field.defaultValue) return field.defaultValue

  switch (field.type) {
    case "text":
      if (field.name.toLowerCase().includes("name")) {
        return ["Product A", "Product B", "Product C"][index] || "Sample Product"
      }
      if (field.name.toLowerCase().includes("description")) {
        return (
          [
            "High-quality product with excellent features",
            "Premium item with advanced functionality",
            "Standard product with reliable performance",
          ][index] || "Sample description"
        )
      }
      if (field.name.toLowerCase().includes("brand")) {
        return ["Brand A", "Brand B", "Brand C"][index] || "Sample Brand"
      }
      return `Sample ${field.name}`

    case "number":
      if (field.name.toLowerCase().includes("price") || field.name.toLowerCase().includes("cost")) {
        return ["99.99", "149.99", "199.99"][index] || "99.99"
      }
      if (field.name.toLowerCase().includes("quantity")) {
        return ["1", "5", "10"][index] || "1"
      }
      return ["100", "200", "300"][index] || "100"

    case "date":
      const dates = ["2024-01-15", "2024-02-20", "2024-03-10"]
      return dates[index] || "2024-01-01"

    case "select":
      if (field.options && field.options.length > 0) {
        return field.options[index % field.options.length]
      }
      return "Option 1"

    case "boolean":
      return ["Yes", "No", "Yes"][index] || "Yes"

    case "email":
      return ["example1@company.com", "example2@company.com", "example3@company.com"][index] || "example@company.com"

    case "url":
      return ["https://example1.com", "https://example2.com", "https://example3.com"][index] || "https://example.com"

    case "phone":
      return ["(555) 123-4567", "(555) 234-5678", "(555) 345-6789"][index] || "(555) 123-4567"

    default:
      return `Sample ${field.name}`
  }
}

export function generateCustomTemplateDocumentation(template: CustomTemplate): string {
  const requiredFields = template.fields.filter((f) => f.required)
  const optionalFields = template.fields.filter((f) => !f.required)

  return `# ${template.name}

${template.description || "Custom template for data collection"}

**Category:** ${template.category}
**Created:** ${template.createdAt.toLocaleDateString()}
**Fields:** ${template.fields.length} total (${requiredFields.length} required, ${optionalFields.length} optional)

## Template Overview

${template.tags.length > 0 ? `**Tags:** ${template.tags.join(", ")}` : ""}

## Required Fields (${requiredFields.length})

${requiredFields
  .map(
    (field) => `
### ${field.name}
- **Type:** ${field.type}
- **Description:** ${field.description || "No description provided"}
${field.validation ? `- **Validation:** ${JSON.stringify(field.validation, null, 2)}` : ""}
${field.options ? `- **Options:** ${field.options.join(", ")}` : ""}
${field.helpText ? `- **Help:** ${field.helpText}` : ""}
`,
  )
  .join("")}

## Optional Fields (${optionalFields.length})

${optionalFields
  .map(
    (field) => `
### ${field.name}
- **Type:** ${field.type}
- **Description:** ${field.description || "No description provided"}
${field.validation ? `- **Validation:** ${JSON.stringify(field.validation, null, 2)}` : ""}
${field.options ? `- **Options:** ${field.options.join(", ")}` : ""}
${field.helpText ? `- **Help:** ${field.helpText}` : ""}
`,
  )
  .join("")}

## Usage Instructions

1. Download the CSV template
2. Fill in the required fields for each row
3. Optional fields can be left blank if not applicable
4. Follow the validation rules for each field type
5. Upload the completed CSV for analysis

## Field Type Reference

- **Text:** Single line text input
- **Number:** Numeric values (integers or decimals)
- **Date:** Date in YYYY-MM-DD format
- **Dropdown:** Select from predefined options
- **Yes/No:** Boolean values (Yes/No, True/False, 1/0)
- **Email:** Valid email address format
- **URL:** Valid web address starting with http:// or https://
- **Phone:** Phone number in standard format

---

*This is a custom template. Please ensure all data follows the specified formats for best results.*
`
}

export function validateCustomTemplate(template: Partial<CustomTemplate>): {
  isValid: boolean
  errors: string[]
} {
  try {
    CustomTemplateSchema.parse(template)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
      }
    }
    return { isValid: false, errors: ["Unknown validation error"] }
  }
}

export function duplicateTemplate(template: CustomTemplate, newName: string): CustomTemplate {
  return {
    ...template,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: newName,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function createFieldFromPreset(preset: string): CustomField {
  const presets: Record<string, Partial<CustomField>> = {
    "product-name": {
      name: "Product Name",
      description: "Name or description of the product",
      type: "text",
      required: true,
      validation: { minLength: 3, maxLength: 200 },
      placeholder: "Enter product name",
    },
    brand: {
      name: "Brand",
      description: "Product brand or manufacturer",
      type: "text",
      required: false,
      validation: { maxLength: 100 },
      placeholder: "Enter brand name",
    },
    condition: {
      name: "Condition",
      description: "Product condition",
      type: "select",
      required: true,
      options: ["New", "Like New", "Very Good", "Good", "Fair", "Poor"],
    },
    quantity: {
      name: "Quantity",
      description: "Number of units",
      type: "number",
      required: true,
      validation: { min: 1, max: 10000 },
      placeholder: "Enter quantity",
    },
    price: {
      name: "Price",
      description: "Price per unit",
      type: "number",
      required: true,
      validation: { min: 0 },
      placeholder: "Enter price",
    },
    category: {
      name: "Category",
      description: "Product category",
      type: "text",
      required: false,
      placeholder: "Enter category",
    },
    sku: {
      name: "SKU",
      description: "Stock Keeping Unit identifier",
      type: "text",
      required: false,
      validation: { maxLength: 50 },
      placeholder: "Enter SKU",
    },
    date: {
      name: "Date",
      description: "Date field",
      type: "date",
      required: false,
      placeholder: "YYYY-MM-DD",
    },
  }

  const preset_data = presets[preset] || {}
  return {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: preset_data.name || "New Field",
    description: preset_data.description || "",
    type: preset_data.type || "text",
    required: preset_data.required || false,
    options: preset_data.options || [],
    validation: preset_data.validation || {},
    defaultValue: preset_data.defaultValue || "",
    placeholder: preset_data.placeholder || "",
    helpText: preset_data.helpText || "",
  }
}
