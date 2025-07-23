"use server"

export function cleanDescription(description: string): string {
  if (!description) return ""

  // Remove extra whitespace and normalize
  let cleaned = description.trim().replace(/\s+/g, " ")

  // Remove common prefixes/suffixes that don't add value
  const prefixesToRemove = ["NEW ", "BRAND NEW ", "FACTORY SEALED ", "NIB ", "BNIB "]

  const suffixesToRemove = [" - NEW", " - BRAND NEW", " (NEW)", " [NEW]"]

  // Remove prefixes
  for (const prefix of prefixesToRemove) {
    if (cleaned.toUpperCase().startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim()
    }
  }

  // Remove suffixes
  for (const suffix of suffixesToRemove) {
    if (cleaned.toUpperCase().endsWith(suffix)) {
      cleaned = cleaned.substring(0, cleaned.length - suffix.length).trim()
    }
  }

  // Clean up special characters but preserve important ones
  cleaned = cleaned
    .replace(/[^\w\s\-.$$$$[\]/&]/g, " ") // Keep basic punctuation
    .replace(/\s+/g, " ") // Normalize whitespace again
    .trim()

  return cleaned
}

export function extractBrand(description: string): string {
  if (!description) return "Unknown"

  // Common brand patterns
  const brandPatterns = [
    // Electronics
    /\b(Apple|Samsung|Sony|LG|Panasonic|Canon|Nikon|HP|Dell|Lenovo|ASUS|Acer)\b/i,
    // Home & Garden
    /\b(Kohler|Moen|Delta|American Standard|Pfister|Grohe|Hansgrohe)\b/i,
    // Tools
    /\b(DeWalt|Milwaukee|Makita|Bosch|Ryobi|Black\+?Decker|Craftsman|Stanley)\b/i,
    // Appliances
    /\b(KitchenAid|Cuisinart|Hamilton Beach|Ninja|Instant Pot|Dyson|Shark)\b/i,
    // Fashion
    /\b(Nike|Adidas|Under Armour|Levi'?s|Calvin Klein|Tommy Hilfiger)\b/i,
    // Generic pattern for brand at start
    /^([A-Z][a-zA-Z]+)\s/,
  ]

  for (const pattern of brandPatterns) {
    const match = description.match(pattern)
    if (match) {
      return match[1] || match[0]
    }
  }

  // Fallback: try to extract first capitalized word
  const words = description.split(/\s+/)
  const firstCapitalized = words.find(
    (word) => word.length > 2 && word[0] === word[0].toUpperCase() && !/^\d/.test(word), // Not starting with number
  )

  return firstCapitalized || "Unknown"
}

export function normalizeCondition(condition: string): string {
  if (!condition) return "Unknown"

  const normalized = condition.toLowerCase().trim()

  // Map various condition descriptions to standard values
  if (normalized.includes("new") || normalized.includes("sealed")) {
    return "New"
  } else if (normalized.includes("like new") || normalized.includes("excellent")) {
    return "Like New"
  } else if (normalized.includes("very good") || normalized.includes("good")) {
    return "Good"
  } else if (normalized.includes("fair") || normalized.includes("acceptable")) {
    return "Fair"
  } else if (normalized.includes("poor") || normalized.includes("damaged")) {
    return "Poor"
  } else if (normalized.includes("return") || normalized.includes("ret")) {
    return "Customer Return"
  } else if (normalized.includes("refurb") || normalized.includes("renewed")) {
    return "Refurbished"
  }

  return "Unknown"
}

export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0

  // Remove currency symbols, commas, and extra spaces
  const cleaned = priceStr
    .replace(/[$£€¥₹]/g, "")
    .replace(/,/g, "")
    .trim()

  const price = Number.parseFloat(cleaned)
  return isNaN(price) ? 0 : price
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}
