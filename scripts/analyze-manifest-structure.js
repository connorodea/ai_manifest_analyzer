// Fetch and analyze the manifest structure
const response = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AA001%20MANIFESTS%20-%20UMID1002-kUfPxgAzxESMuqx0refGWCr0o3xBL8.csv",
)
const csvContent = await response.text()

console.log("=== MANIFEST ANALYSIS ===")
console.log("File size:", csvContent.length, "characters")

// Parse CSV structure
const lines = csvContent.split("\n").filter((line) => line.trim())
console.log("Total lines:", lines.length)

// Analyze headers
const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
console.log("Headers:", headers)

// Sample first few rows
console.log("\n=== SAMPLE DATA ===")
for (let i = 0; i < Math.min(10, lines.length); i++) {
  const row = lines[i].split(",").map((cell) => cell.trim().replace(/"/g, ""))
  console.log(`Row ${i}:`, row)
}

// Analyze data patterns
console.log("\n=== DATA PATTERNS ===")
const sampleRows = lines.slice(1, 20).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

// Check for product descriptions, prices, quantities
sampleRows.forEach((row, index) => {
  if (row.length >= 2) {
    console.log(`Item ${index + 1}:`, {
      price: row[0],
      description: row[1]?.substring(0, 100) + "...",
      hasPrice: !isNaN(Number.parseFloat(row[0])),
      hasDescription: row[1] && row[1].length > 10,
    })
  }
})
