console.log("🔍 DEBUG: Analyzing manifest file structure...")

// Sample manifest data for testing
const sampleCSVContent = `Product,Retail Price,Quantity,Condition,Total Retail Price
"Apple iPhone 14 Pro 128GB Space Black",999.00,1,New,999.00
"Samsung 65\" QLED 4K Smart TV",1299.99,2,Open Box,2599.98
"Nike Air Jordan 1 Retro High OG Size 10",170.00,1,New,170.00
"KitchenAid Stand Mixer 5-Quart Artisan",379.99,1,Refurbished,379.99
"Sony WH-1000XM4 Wireless Headphones",349.99,3,New,1049.97`

console.log("📋 Sample CSV Content:")
console.log(sampleCSVContent)
console.log("\n" + "=".repeat(50))

// Test CSV parsing
function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

const lines = sampleCSVContent.split("\n")
const headers = parseCSVLine(lines[0])
console.log("📊 Headers found:", headers)

const items = []
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i])
    const item = {}
    headers.forEach((header, index) => {
      item[header] = values[index] || ""
    })
    items.push(item)
  }
}

console.log(`✅ Parsed ${items.length} items successfully`)
console.log("📦 Sample items:")
items.forEach((item, index) => {
  console.log(`${index + 1}. ${item.Product} - $${item["Retail Price"]}`)
})

console.log("\n🎯 File structure analysis complete!")
