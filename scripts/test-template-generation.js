import {
  CSV_TEMPLATES,
  generateCSVContent,
  generateTemplateDocumentation,
  getTemplatesByCategory,
  getTemplateById,
  validateTemplateStructure,
} from "../lib/utils/csv-template-generator.js"

console.log("🧪 Testing CSV Template Generation System...\n")

// Test 1: Template Library
console.log("📚 Template Library:")
console.log(`Total templates: ${CSV_TEMPLATES.length}`)

const categories = getTemplatesByCategory()
Object.entries(categories).forEach(([category, templates]) => {
  console.log(`  ${category}: ${templates.length} templates`)
  templates.forEach((template) => {
    console.log(
      `    - ${template.name} (${template.fields.length} fields, ${template.fields.filter((f) => f.required).length} required)`,
    )
  })
})

console.log("\n" + "=".repeat(60) + "\n")

// Test 2: CSV Generation
console.log("📄 Testing CSV Generation:")
const retailTemplate = getTemplateById("retail-standard")
if (retailTemplate) {
  console.log(`Template: ${retailTemplate.name}`)

  // Test different generation types
  const types = ["with-examples", "headers-only", "with-empty-rows"]
  types.forEach((type) => {
    const csv = generateCSVContent(retailTemplate, type)
    const lines = csv.split("\n")
    console.log(`  ${type}: ${lines.length} lines, ${lines[0].split(",").length} columns`)

    // Show first few characters
    console.log(`    Preview: ${csv.substring(0, 100)}...`)
  })
}

console.log("\n" + "=".repeat(60) + "\n")

// Test 3: Documentation Generation
console.log("📖 Testing Documentation Generation:")
if (retailTemplate) {
  const docs = generateTemplateDocumentation(retailTemplate)
  const sections = docs.split("\n##").length - 1
  console.log(`Generated documentation with ${sections} sections`)
  console.log(`Documentation length: ${docs.length} characters`)

  // Show structure
  const lines = docs.split("\n").filter((line) => line.startsWith("#"))
  console.log("Documentation structure:")
  lines.forEach((line) => {
    console.log(`  ${line}`)
  })
}

console.log("\n" + "=".repeat(60) + "\n")

// Test 4: Template Validation
console.log("🔍 Testing Template Validation:")

// Test valid CSV
const validCSV = generateCSVContent(retailTemplate, "with-examples")
const validationResult = validateTemplateStructure(validCSV, "retail-standard")
console.log("Valid CSV validation:")
console.log(`  Is valid: ${validationResult.isValid}`)
console.log(`  Issues: ${validationResult.issues.length}`)

// Test invalid CSV (missing required fields)
const invalidCSV = "Product,Brand\niPhone,Apple"
const invalidValidation = validateTemplateStructure(invalidCSV, "retail-standard")
console.log("\nInvalid CSV validation:")
console.log(`  Is valid: ${invalidValidation.isValid}`)
console.log(`  Issues: ${invalidValidation.issues.length}`)
console.log(`  Missing required: ${invalidValidation.missingRequired.join(", ")}`)

console.log("\n" + "=".repeat(60) + "\n")

// Test 5: Field Analysis
console.log("📊 Field Analysis Across All Templates:")
const allFields = CSV_TEMPLATES.flatMap((t) => t.fields)
const fieldTypes = allFields.reduce((acc, field) => {
  acc[field.dataType] = (acc[field.dataType] || 0) + 1
  return acc
}, {})

console.log("Field type distribution:")
Object.entries(fieldTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count} fields`)
})

const requiredFields = allFields.filter((f) => f.required).length
const optionalFields = allFields.filter((f) => !f.required).length
console.log(`\nRequired vs Optional:`)
console.log(`  Required: ${requiredFields} (${Math.round((requiredFields / allFields.length) * 100)}%)`)
console.log(`  Optional: ${optionalFields} (${Math.round((optionalFields / allFields.length) * 100)}%)`)

console.log("\n" + "=".repeat(60) + "\n")

// Test 6: Template Statistics
console.log("📈 Template Statistics:")
CSV_TEMPLATES.forEach((template) => {
  const requiredCount = template.fields.filter((f) => f.required).length
  const optionalCount = template.fields.filter((f) => !f.required).length
  const exampleCount = template.exampleData.length

  console.log(`${template.name}:`)
  console.log(`  Category: ${template.category}`)
  console.log(`  Fields: ${template.fields.length} (${requiredCount} required, ${optionalCount} optional)`)
  console.log(`  Examples: ${exampleCount} records`)
  console.log(`  Completeness: ${Math.round((requiredCount / template.fields.length) * 100)}% required fields`)
  console.log("")
})

console.log("✅ Template generation system test completed!")
