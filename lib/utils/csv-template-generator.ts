"use server"

export interface TemplateField {
  name: string
  description: string
  required: boolean
  dataType: "string" | "number" | "date" | "enum"
  enumValues?: string[]
  example?: string
  validation?: string
}

export interface CSVTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: TemplateField[]
  exampleData: Record<string, any>[]
}

export const CSV_TEMPLATES: CSVTemplate[] = [
  {
    id: "retail-standard",
    name: "Standard Retail Manifest",
    description: "General retail merchandise with standard fields",
    category: "Retail & E-commerce",
    fields: [
      {
        name: "Product",
        description: "Product name or description",
        required: true,
        dataType: "string",
        example: "Apple iPhone 14 Pro 128GB Space Black",
        validation: "Minimum 10 characters, descriptive",
      },
      {
        name: "Brand",
        description: "Product brand or manufacturer",
        required: false,
        dataType: "string",
        example: "Apple",
        validation: "Brand name as it appears on product",
      },
      {
        name: "Model",
        description: "Product model number or variant",
        required: false,
        dataType: "string",
        example: "iPhone 14 Pro",
        validation: "Specific model identifier",
      },
      {
        name: "SKU",
        description: "Stock Keeping Unit identifier",
        required: false,
        dataType: "string",
        example: "APL-IP14P-128-SB",
        validation: "Unique product identifier",
      },
      {
        name: "Condition",
        description: "Product condition",
        required: true,
        dataType: "enum",
        enumValues: ["New", "Like New", "Very Good", "Good", "Fair", "Poor", "For Parts"],
        example: "Like New",
        validation: "Must be one of the predefined values",
      },
      {
        name: "Quantity",
        description: "Number of units",
        required: true,
        dataType: "number",
        example: "1",
        validation: "Positive integer",
      },
      {
        name: "Retail Price",
        description: "Original retail price per unit",
        required: true,
        dataType: "number",
        example: "999.00",
        validation: "Positive number, no currency symbols",
      },
      {
        name: "Cost",
        description: "Your cost per unit (optional)",
        required: false,
        dataType: "number",
        example: "450.00",
        validation: "Positive number, no currency symbols",
      },
      {
        name: "Category",
        description: "Product category",
        required: false,
        dataType: "string",
        example: "Electronics > Mobile Phones",
        validation: "Use > to separate subcategories",
      },
      {
        name: "UPC",
        description: "Universal Product Code",
        required: false,
        dataType: "string",
        example: "194252707890",
        validation: "12-digit barcode number",
      },
    ],
    exampleData: [
      {
        Product: "Apple iPhone 14 Pro 128GB Space Black",
        Brand: "Apple",
        Model: "iPhone 14 Pro",
        SKU: "APL-IP14P-128-SB",
        Condition: "Like New",
        Quantity: 1,
        "Retail Price": 999.0,
        Cost: 450.0,
        Category: "Electronics > Mobile Phones",
        UPC: "194252707890",
      },
      {
        Product: 'Samsung 65" QLED 4K Smart TV',
        Brand: "Samsung",
        Model: "QN65Q70A",
        SKU: "SAM-Q70A-65",
        Condition: "New",
        Quantity: 2,
        "Retail Price": 1299.99,
        Cost: 650.0,
        Category: "Electronics > TVs",
        UPC: "887276458472",
      },
      {
        Product: "Nike Air Max 270 Running Shoes Size 10",
        Brand: "Nike",
        Model: "Air Max 270",
        SKU: "NIKE-AM270-10-BLK",
        Condition: "Very Good",
        Quantity: 1,
        "Retail Price": 150.0,
        Cost: 75.0,
        Category: "Clothing & Shoes > Athletic Shoes",
        UPC: "194501234567",
      },
    ],
  },
  {
    id: "amazon-returns",
    name: "Amazon Returns Manifest",
    description: "Amazon return merchandise with ASIN and return reasons",
    category: "Retail & E-commerce",
    fields: [
      {
        name: "ASIN",
        description: "Amazon Standard Identification Number",
        required: true,
        dataType: "string",
        example: "B09G9FPHY6",
        validation: "10-character alphanumeric code",
      },
      {
        name: "Product Title",
        description: "Product title as shown on Amazon",
        required: true,
        dataType: "string",
        example: "Apple iPhone 14 Pro, 128GB, Space Black",
        validation: "Complete product title from Amazon listing",
      },
      {
        name: "Brand",
        description: "Product brand",
        required: false,
        dataType: "string",
        example: "Apple",
        validation: "Brand name as listed on Amazon",
      },
      {
        name: "Condition",
        description: "Return condition assessment",
        required: true,
        dataType: "enum",
        enumValues: [
          "Sellable",
          "Unsellable - Defective",
          "Unsellable - Damaged Packaging",
          "Unsellable - Customer Damaged",
        ],
        example: "Sellable",
        validation: "Amazon return condition category",
      },
      {
        name: "Return Reason",
        description: "Customer return reason",
        required: false,
        dataType: "string",
        example: "No longer needed",
        validation: "Customer-provided return reason",
      },
      {
        name: "Quantity",
        description: "Number of units returned",
        required: true,
        dataType: "number",
        example: "1",
        validation: "Positive integer",
      },
      {
        name: "Amazon Price",
        description: "Price when sold on Amazon",
        required: true,
        dataType: "number",
        example: "999.00",
        validation: "Price without currency symbols",
      },
      {
        name: "Category",
        description: "Amazon product category",
        required: false,
        dataType: "string",
        example: "Cell Phones & Accessories",
        validation: "Amazon browse node category",
      },
    ],
    exampleData: [
      {
        ASIN: "B09G9FPHY6",
        "Product Title": "Apple iPhone 14 Pro, 128GB, Space Black",
        Brand: "Apple",
        Condition: "Sellable",
        "Return Reason": "No longer needed",
        Quantity: 1,
        "Amazon Price": 999.0,
        Category: "Cell Phones & Accessories",
      },
      {
        ASIN: "B08N5WRWNW",
        "Product Title": "Echo Dot (4th Gen) | Smart speaker with Alexa",
        Brand: "Amazon",
        Condition: "Unsellable - Damaged Packaging",
        "Return Reason": "Arrived damaged",
        Quantity: 1,
        "Amazon Price": 49.99,
        Category: "Electronics",
      },
    ],
  },
  {
    id: "liquidation-lot",
    name: "Liquidation Lot Manifest",
    description: "Bulk liquidation merchandise with lot information",
    category: "Liquidation & Wholesale",
    fields: [
      {
        name: "Lot Number",
        description: "Liquidation lot identifier",
        required: true,
        dataType: "string",
        example: "LOT-2024-001",
        validation: "Unique lot identifier",
      },
      {
        name: "Product Description",
        description: "Product name and details",
        required: true,
        dataType: "string",
        example: "Mixed Electronics - Tablets, Phones, Accessories",
        validation: "Descriptive product information",
      },
      {
        name: "Brand",
        description: "Primary brand in lot",
        required: false,
        dataType: "string",
        example: "Mixed Brands",
        validation: 'Brand name or "Mixed Brands"',
      },
      {
        name: "Condition",
        description: "Overall lot condition",
        required: true,
        dataType: "enum",
        enumValues: ["New", "Customer Returns", "Shelf Pulls", "Overstock", "Salvage", "Mixed Conditions"],
        example: "Customer Returns",
        validation: "Liquidation condition category",
      },
      {
        name: "Unit Count",
        description: "Total number of units in lot",
        required: true,
        dataType: "number",
        example: "50",
        validation: "Positive integer",
      },
      {
        name: "Retail Value",
        description: "Total retail value of lot",
        required: true,
        dataType: "number",
        example: "15000.00",
        validation: "Total retail value, no currency symbols",
      },
      {
        name: "Lot Cost",
        description: "Your cost for entire lot",
        required: false,
        dataType: "number",
        example: "3000.00",
        validation: "Total lot cost, no currency symbols",
      },
      {
        name: "Category Mix",
        description: "Categories included in lot",
        required: false,
        dataType: "string",
        example: "Electronics (60%), Accessories (30%), Other (10%)",
        validation: "Category breakdown with percentages",
      },
      {
        name: "Manifest Available",
        description: "Is detailed manifest available",
        required: false,
        dataType: "enum",
        enumValues: ["Yes", "No", "Partial"],
        example: "Yes",
        validation: "Manifest availability status",
      },
    ],
    exampleData: [
      {
        "Lot Number": "LOT-2024-001",
        "Product Description": "Mixed Electronics - Tablets, Phones, Accessories",
        Brand: "Mixed Brands",
        Condition: "Customer Returns",
        "Unit Count": 50,
        "Retail Value": 15000.0,
        "Lot Cost": 3000.0,
        "Category Mix": "Electronics (60%), Accessories (30%), Other (10%)",
        "Manifest Available": "Yes",
      },
      {
        "Lot Number": "LOT-2024-002",
        "Product Description": "Home & Garden Overstock",
        Brand: "Various",
        Condition: "Overstock",
        "Unit Count": 100,
        "Retail Value": 8500.0,
        "Lot Cost": 1700.0,
        "Category Mix": "Home Decor (40%), Garden Tools (35%), Kitchen (25%)",
        "Manifest Available": "Partial",
      },
    ],
  },
  {
    id: "auto-parts",
    name: "Auto Parts Manifest",
    description: "Automotive parts and accessories inventory",
    category: "Automotive",
    fields: [
      {
        name: "Part Number",
        description: "Manufacturer part number",
        required: true,
        dataType: "string",
        example: "AC-12345-ABC",
        validation: "Manufacturer-specific part identifier",
      },
      {
        name: "Part Name",
        description: "Part description",
        required: true,
        dataType: "string",
        example: "Brake Pad Set - Front",
        validation: "Clear part description",
      },
      {
        name: "Brand",
        description: "Part manufacturer",
        required: true,
        dataType: "string",
        example: "ACDelco",
        validation: "Manufacturer or brand name",
      },
      {
        name: "Vehicle Make",
        description: "Compatible vehicle make",
        required: false,
        dataType: "string",
        example: "Ford",
        validation: "Vehicle manufacturer",
      },
      {
        name: "Vehicle Model",
        description: "Compatible vehicle model",
        required: false,
        dataType: "string",
        example: "F-150",
        validation: "Specific vehicle model",
      },
      {
        name: "Year Range",
        description: "Compatible vehicle years",
        required: false,
        dataType: "string",
        example: "2015-2020",
        validation: "Year range (YYYY-YYYY) or single year",
      },
      {
        name: "Condition",
        description: "Part condition",
        required: true,
        dataType: "enum",
        enumValues: ["New", "Remanufactured", "Used - Excellent", "Used - Good", "Used - Fair", "Core/Rebuildable"],
        example: "New",
        validation: "Automotive part condition standard",
      },
      {
        name: "Quantity",
        description: "Number of parts",
        required: true,
        dataType: "number",
        example: "4",
        validation: "Positive integer",
      },
      {
        name: "Retail Price",
        description: "Retail price per unit",
        required: true,
        dataType: "number",
        example: "89.99",
        validation: "Price without currency symbols",
      },
      {
        name: "Category",
        description: "Part category",
        required: false,
        dataType: "string",
        example: "Brake System",
        validation: "Automotive system or category",
      },
    ],
    exampleData: [
      {
        "Part Number": "AC-12345-ABC",
        "Part Name": "Brake Pad Set - Front",
        Brand: "ACDelco",
        "Vehicle Make": "Ford",
        "Vehicle Model": "F-150",
        "Year Range": "2015-2020",
        Condition: "New",
        Quantity: 4,
        "Retail Price": 89.99,
        Category: "Brake System",
      },
      {
        "Part Number": "MOT-67890-XYZ",
        "Part Name": "Engine Air Filter",
        Brand: "Motorcraft",
        "Vehicle Make": "Ford",
        "Vehicle Model": "Mustang",
        "Year Range": "2018-2023",
        Condition: "New",
        Quantity: 10,
        "Retail Price": 24.99,
        Category: "Engine",
      },
    ],
  },
  {
    id: "apparel-manifest",
    name: "Apparel Manifest",
    description: "Clothing and fashion items with size and style details",
    category: "Clothing & Fashion",
    fields: [
      {
        name: "Product Name",
        description: "Clothing item name",
        required: true,
        dataType: "string",
        example: "Nike Dri-FIT Running T-Shirt",
        validation: "Include brand, style, and type",
      },
      {
        name: "Brand",
        description: "Clothing brand",
        required: true,
        dataType: "string",
        example: "Nike",
        validation: "Brand name as it appears on label",
      },
      {
        name: "Style Number",
        description: "Manufacturer style code",
        required: false,
        dataType: "string",
        example: "DRI-FIT-001",
        validation: "Brand-specific style identifier",
      },
      {
        name: "Category",
        description: "Clothing category",
        required: true,
        dataType: "enum",
        enumValues: ["Tops", "Bottoms", "Dresses", "Outerwear", "Activewear", "Underwear", "Shoes", "Accessories"],
        example: "Activewear",
        validation: "Primary clothing category",
      },
      {
        name: "Gender",
        description: "Target gender",
        required: true,
        dataType: "enum",
        enumValues: ["Men", "Women", "Unisex", "Boys", "Girls", "Baby"],
        example: "Men",
        validation: "Target demographic",
      },
      {
        name: "Size",
        description: "Clothing size",
        required: true,
        dataType: "string",
        example: "Large",
        validation: "Standard size (XS, S, M, L, XL, etc.) or numeric",
      },
      {
        name: "Color",
        description: "Primary color",
        required: true,
        dataType: "string",
        example: "Navy Blue",
        validation: "Primary color name",
      },
      {
        name: "Material",
        description: "Primary fabric material",
        required: false,
        dataType: "string",
        example: "100% Polyester",
        validation: "Fabric composition",
      },
      {
        name: "Condition",
        description: "Item condition",
        required: true,
        dataType: "enum",
        enumValues: ["New with Tags", "New without Tags", "Like New", "Very Good", "Good", "Fair"],
        example: "New with Tags",
        validation: "Clothing condition standard",
      },
      {
        name: "Quantity",
        description: "Number of items",
        required: true,
        dataType: "number",
        example: "5",
        validation: "Positive integer",
      },
      {
        name: "Retail Price",
        description: "Original retail price",
        required: true,
        dataType: "number",
        example: "29.99",
        validation: "Price without currency symbols",
      },
      {
        name: "Season",
        description: "Target season",
        required: false,
        dataType: "enum",
        enumValues: ["Spring", "Summer", "Fall", "Winter", "All Season"],
        example: "All Season",
        validation: "Seasonal category",
      },
    ],
    exampleData: [
      {
        "Product Name": "Nike Dri-FIT Running T-Shirt",
        Brand: "Nike",
        "Style Number": "DRI-FIT-001",
        Category: "Activewear",
        Gender: "Men",
        Size: "Large",
        Color: "Navy Blue",
        Material: "100% Polyester",
        Condition: "New with Tags",
        Quantity: 5,
        "Retail Price": 29.99,
        Season: "All Season",
      },
      {
        "Product Name": "Levi's 501 Original Fit Jeans",
        Brand: "Levi's",
        "Style Number": "501-0001",
        Category: "Bottoms",
        Gender: "Men",
        Size: "32x32",
        Color: "Dark Wash",
        Material: "100% Cotton",
        Condition: "New without Tags",
        Quantity: 3,
        "Retail Price": 89.99,
        Season: "All Season",
      },
    ],
  },
]

export type TemplateType = "with-examples" | "headers-only" | "with-empty-rows"

export function generateCSVContent(template: CSVTemplate, type: TemplateType = "with-examples"): string {
  const headers = template.fields.map((field) => field.name)

  let rows: string[][] = []

  switch (type) {
    case "with-examples":
      rows = template.exampleData.map((item) => headers.map((header) => String(item[header] || "")))
      break

    case "headers-only":
      // Just headers, no data rows
      break

    case "with-empty-rows":
      // Add 5 empty rows for data entry
      rows = Array(5)
        .fill(null)
        .map(() => Array(headers.length).fill(""))
      break
  }

  const csvRows = [headers, ...rows]

  return csvRows
    .map((row) =>
      row
        .map((cell) => {
          // Escape cells that contain commas, quotes, or newlines
          if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
            return `"${cell.replace(/"/g, '""')}"`
          }
          return cell
        })
        .join(","),
    )
    .join("\n")
}

export function generateTemplateDocumentation(template: CSVTemplate): string {
  const requiredFields = template.fields.filter((f) => f.required)
  const optionalFields = template.fields.filter((f) => !f.required)

  return `# ${template.name}

${template.description}

## Required Fields (${requiredFields.length})

${requiredFields
  .map(
    (field) => `
### ${field.name}
- **Type**: ${field.dataType}
- **Description**: ${field.description}
- **Example**: ${field.example}
- **Validation**: ${field.validation}
${field.enumValues ? `- **Valid Values**: ${field.enumValues.join(", ")}` : ""}
`,
  )
  .join("")}

## Optional Fields (${optionalFields.length})

${optionalFields
  .map(
    (field) => `
### ${field.name}
- **Type**: ${field.dataType}
- **Description**: ${field.description}
- **Example**: ${field.example}
- **Validation**: ${field.validation}
${field.enumValues ? `- **Valid Values**: ${field.enumValues.join(", ")}` : ""}
`,
  )
  .join("")}

## Template Statistics
- **Total Fields**: ${template.fields.length}
- **Required Fields**: ${requiredFields.length}
- **Optional Fields**: ${optionalFields.length}
- **Example Records**: ${template.exampleData.length}

## Usage Tips
1. Fill in all required fields for best results
2. Use consistent formatting across all rows
3. Follow the validation rules for each field
4. Include as much detail as possible in product descriptions
5. Use standard condition and category values when available
`
}

export function getTemplatesByCategory(): Record<string, CSVTemplate[]> {
  return CSV_TEMPLATES.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    },
    {} as Record<string, CSVTemplate[]>,
  )
}

export function getTemplateById(id: string): CSVTemplate | undefined {
  return CSV_TEMPLATES.find((template) => template.id === id)
}

export function validateTemplateStructure(
  csvContent: string,
  templateId: string,
): {
  isValid: boolean
  issues: string[]
  missingRequired: string[]
  extraFields: string[]
} {
  const template = getTemplateById(templateId)
  if (!template) {
    return {
      isValid: false,
      issues: ["Template not found"],
      missingRequired: [],
      extraFields: [],
    }
  }

  const lines = csvContent.trim().split("\n")
  if (lines.length === 0) {
    return {
      isValid: false,
      issues: ["Empty CSV file"],
      missingRequired: [],
      extraFields: [],
    }
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const templateHeaders = template.fields.map((f) => f.name)
  const requiredHeaders = template.fields.filter((f) => f.required).map((f) => f.name)

  const missingRequired = requiredHeaders.filter((h) => !headers.includes(h))
  const extraFields = headers.filter((h) => !templateHeaders.includes(h))

  const issues: string[] = []

  if (missingRequired.length > 0) {
    issues.push(`Missing required fields: ${missingRequired.join(", ")}`)
  }

  if (extraFields.length > 0) {
    issues.push(`Extra fields not in template: ${extraFields.join(", ")}`)
  }

  return {
    isValid: issues.length === 0,
    issues,
    missingRequired,
    extraFields,
  }
}
