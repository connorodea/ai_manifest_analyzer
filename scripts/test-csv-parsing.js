// Test the CSV parsing with the actual manifest file
const response = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/m20350330-msYRiCbEjIZQB3bcVNRE40B5k6kgWN.csv",
)
const csvContent = await response.text()

console.log("=== CSV PARSING DEBUG ===")
console.log("File size:", csvContent.length, "characters")
console.log("First 500 characters:")
console.log(csvContent.substring(0, 500))
console.log("\n" + "=".repeat(50))

// Check line endings and structure
const lines = csvContent.split("\n")
console.log("Total lines (with \\n split):", lines.length)
console.log("Lines with content:", lines.filter((line) => line.trim()).length)

// Check first few lines raw
console.log("\nFirst 5 raw lines:")
for (let i = 0; i < Math.min(5, lines.length); i++) {
  console.log(`Line ${i}: "${lines[i]}"`)
  console.log(`  Length: ${lines[i].length}`)
  console.log(`  Trimmed: "${lines[i].trim()}"`)
}

// Try different parsing approaches
console.log("\n=== PARSING APPROACHES ===")

// Approach 1: Simple comma split
console.log("1. Simple comma split on first data line:")
if (lines.length > 1) {
  const simpleSplit = lines[1].split(",")
  console.log("  Columns:", simpleSplit.length)
  simpleSplit.forEach((col, i) => {
    console.log(`  Col ${i}: "${col.trim()}"`)
  })
}

// Approach 2: Check for different delimiters
console.log("\n2. Delimiter detection:")
const firstDataLine = lines[1] || ""
console.log("  Commas:", (firstDataLine.match(/,/g) || []).length)
console.log("  Semicolons:", (firstDataLine.match(/;/g) || []).length)
console.log("  Tabs:", (firstDataLine.match(/\t/g) || []).length)
console.log("  Pipes:", (firstDataLine.match(/\|/g) || []).length)

// Approach 3: Look for quoted content
console.log("\n3. Quote analysis:")
console.log("  Double quotes:", (firstDataLine.match(/"/g) || []).length)
console.log("  Contains quotes:", firstDataLine.includes('"'))

// Try to identify the actual structure
console.log("\n=== STRUCTURE ANALYSIS ===")
const validLines = lines.filter((line) => line.trim())
console.log("Valid lines:", validLines.length)

if (validLines.length > 0) {
  console.log("Header line analysis:")
  const headerLine = validLines[0]
  console.log("  Raw header:", headerLine)
  console.log("  Header length:", headerLine.length)

  // Try different parsing methods
  const headerMethods = {
    "Simple comma": headerLine.split(","),
    "Comma with trim": headerLine.split(",").map((h) => h.trim()),
    "Comma with quote removal": headerLine.split(",").map((h) => h.trim().replace(/"/g, "")),
  }

  Object.entries(headerMethods).forEach(([method, result]) => {
    console.log(`  ${method}:`, result.length, "columns")
    result.forEach((col, i) => console.log(`    ${i}: "${col}"`))
  })
}

// Test actual data parsing
console.log("\n=== DATA PARSING TEST ===")
if (validLines.length > 1) {
  for (let i = 1; i <= Math.min(3, validLines.length - 1); i++) {
    console.log(`\nData line ${i}:`)
    console.log(`  Raw: ${validLines[i].substring(0, 100)}...`)

    const cols = validLines[i].split(",").map((c) => c.trim().replace(/"/g, ""))
    console.log(`  Parsed columns: ${cols.length}`)
    cols.forEach((col, idx) => {
      if (idx < 5) {
        // Only show first 5 columns
        console.log(`    ${idx}: "${col}"`)
      }
    })
  }
}

function parseCSVLine(line) {
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
  return result.map((v) => v.replace(/^"|"$/g, ""))
}

function parsePrice(priceStr) {
  if (!priceStr) return 0
  const cleanPrice = priceStr.replace(/[$,\s]/g, "").replace(/[^\d.-]/g, "")
  const price = Number.parseFloat(cleanPrice) || 0
  return Math.max(0, price)
}

// Parse headers
const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
console.log("Headers:", headers)

// Test parsing first 10 data rows
console.log("\n=== PARSING TEST RESULTS ===")
for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
  const values = parseCSVLine(lines[i])

  const product = (values[0] || "").trim()
  const quantityStr = (values[1] || "1").trim()
  const retailPriceStr = (values[2] || "0").trim()
  const totalRetailPriceStr = (values[3] || "0").trim()
  const condition = (values[4] || "Unknown").trim()

  const quantity = Number.parseInt(quantityStr) || 1
  const retailPrice = parsePrice(retailPriceStr)
  const totalRetailPrice = parsePrice(totalRetailPriceStr)

  console.log(`\nRow ${i}:`)
  console.log(`  Product: ${product.substring(0, 60)}...`)
  console.log(`  Quantity: ${quantity}`)
  console.log(`  Retail Price: $${retailPrice}`)
  console.log(`  Total Retail: $${totalRetailPrice}`)
  console.log(`  Condition: ${condition}`)
  console.log(`  Valid: ${product.length >= 5 && retailPrice > 0}`)
}

// Count valid items
let validItems = 0
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i])
  const product = (values[0] || "").trim()
  const retailPrice = parsePrice(values[2] || "0")

  if (product.length >= 5 && retailPrice > 0) {
    validItems++
  }
}

console.log(`\n=== SUMMARY ===`)
console.log(`Total data rows: ${lines.length - 1}`)
console.log(`Valid items for analysis: ${validItems}`)
console.log(`Success rate: ${((validItems / (lines.length - 1)) * 100).toFixed(1)}%`)
