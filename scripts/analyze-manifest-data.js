// Fetch and analyze the actual manifest file
const response = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/m20350330-msYRiCbEjIZQB3bcVNRE40B5k6kgWN.csv",
)
const csvContent = await response.text()

console.log("=== MANIFEST FILE ANALYSIS ===")
console.log("File size:", csvContent.length, "characters")

// Parse CSV structure
const lines = csvContent.split("\n").filter((line) => line.trim())
console.log("Total lines:", lines.length)

// Analyze headers
const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
console.log("Headers found:", headers)

// Sample first 20 rows to understand the data structure
console.log("\n=== SAMPLE DATA ANALYSIS ===")
for (let i = 0; i < Math.min(20, lines.length); i++) {
  const row = lines[i].split(",").map((cell) => cell.trim().replace(/"/g, ""))
  console.log(`Row ${i}:`, {
    product: row[0]?.substring(0, 80) + "...",
    quantity: row[1],
    retailPrice: row[2],
    totalRetailPrice: row[3],
    condition: row[4],
  })
}

// Analyze data patterns
console.log("\n=== DATA QUALITY ANALYSIS ===")
const dataRows = lines.slice(1, 50) // Analyze first 50 data rows

let validProducts = 0
let hasRetailPrice = 0
let hasQuantity = 0
let hasCondition = 0

dataRows.forEach((line, index) => {
  const row = line.split(",").map((cell) => cell.trim().replace(/"/g, ""))

  if (row[0] && row[0].length > 10) validProducts++
  if (row[2] && row[2].includes("$")) hasRetailPrice++
  if (row[1] && !isNaN(Number(row[1]))) hasQuantity++
  if (row[4] && row[4].length > 0) hasCondition++
})

console.log("Data Quality Stats:")
console.log(`- Valid product descriptions: ${validProducts}/${dataRows.length}`)
console.log(`- Has retail price: ${hasRetailPrice}/${dataRows.length}`)
console.log(`- Has quantity: ${hasQuantity}/${dataRows.length}`)
console.log(`- Has condition: ${hasCondition}/${dataRows.length}`)

// Extract some sample products for analysis
console.log("\n=== SAMPLE PRODUCTS FOR AI ANALYSIS ===")
const sampleProducts = dataRows
  .slice(0, 10)
  .map((line, index) => {
    const row = line.split(",").map((cell) => cell.trim().replace(/"/g, ""))
    return {
      index: index + 1,
      product: row[0],
      quantity: row[1],
      retailPrice: row[2],
      totalRetailPrice: row[3],
      condition: row[4],
    }
  })
  .filter((item) => item.product && item.product.length > 10)

sampleProducts.forEach((item) => {
  console.log(`\nProduct ${item.index}:`)
  console.log(`  Description: ${item.product}`)
  console.log(`  Quantity: ${item.quantity}`)
  console.log(`  Retail Price: ${item.retailPrice}`)
  console.log(`  Total Retail: ${item.totalRetailPrice}`)
  console.log(`  Condition: ${item.condition}`)
})
