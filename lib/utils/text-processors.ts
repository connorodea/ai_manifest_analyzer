"use server"

export async function cleanProductDescription(description: string): Promise<string> {
  if (!description) return ""

  // Remove extra whitespace and normalize
  let cleaned = description.trim().replace(/\s+/g, " ")

  // Remove common prefixes/suffixes that don't add value
  const prefixesToRemove = [
    /^lot of\s+/i,
    /^case of\s+/i,
    /^box of\s+/i,
    /^pallet of\s+/i,
    /^mixed\s+/i,
    /^assorted\s+/i,
  ]

  const suffixesToRemove = [/\s+- mixed$/i, /\s+- assorted$/i, /\s+lot$/i, /\s+case$/i]

  for (const prefix of prefixesToRemove) {
    cleaned = cleaned.replace(prefix, "")
  }

  for (const suffix of suffixesToRemove) {
    cleaned = cleaned.replace(suffix, "")
  }

  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)

  return cleaned.trim()
}

export async function extractKeywords(text: string): Promise<string[]> {
  if (!text) return []

  // Convert to lowercase and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)

  // Remove common stop words
  const stopWords = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "this",
    "that",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "shall",
    "lot",
    "case",
    "box",
    "pallet",
  ])

  const keywords = words.filter((word) => !stopWords.has(word))

  // Remove duplicates and return
  return [...new Set(keywords)]
}

export async function normalizeCondition(condition: string): Promise<string> {
  if (!condition) return "Unknown"

  const normalized = condition.toLowerCase().trim()

  // Map variations to standard conditions
  const conditionMap: Record<string, string> = {
    new: "New",
    "brand new": "New",
    "new in box": "New",
    nib: "New",
    sealed: "New",

    used: "Used",
    "pre-owned": "Used",
    preowned: "Used",
    "second hand": "Used",
    secondhand: "Used",

    refurbished: "Refurbished",
    refurb: "Refurbished",
    renewed: "Refurbished",
    restored: "Refurbished",

    "open box": "Open Box",
    openbox: "Open Box",
    "open package": "Open Box",

    damaged: "Damaged",
    broken: "Damaged",
    defective: "Damaged",
    faulty: "Damaged",

    excellent: "Excellent",
    "like new": "Excellent",
    mint: "Excellent",

    good: "Good",
    fine: "Good",
    decent: "Good",

    fair: "Fair",
    okay: "Fair",
    ok: "Fair",

    poor: "Poor",
    bad: "Poor",
    terrible: "Poor",
  }

  return conditionMap[normalized] || "Unknown"
}

export async function extractBrandFromDescription(description: string): Promise<string | null> {
  if (!description) return null

  // Common brand patterns
  const brandPatterns = [
    // Electronics
    /\b(apple|samsung|sony|lg|microsoft|google|amazon|dell|hp|lenovo|asus|acer|canon|nikon|panasonic|philips|bose|beats|jbl)\b/i,
    // Clothing
    /\b(nike|adidas|puma|under armour|levi's|gap|old navy|target|walmart|costco)\b/i,
    // Home goods
    /\b(ikea|pottery barn|crate and barrel|williams sonoma|bed bath beyond|target|walmart)\b/i,
    // General retail
    /\b(amazon basics|kirkland|great value|up&up|simply balanced|good & gather)\b/i,
  ]

  for (const pattern of brandPatterns) {
    const match = description.match(pattern)
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
    }
  }

  return null
}

export async function categorizeProduct(description: string): Promise<string> {
  if (!description) return "Other"

  const lowerDesc = description.toLowerCase()

  // Category keywords
  const categories = {
    Electronics: [
      "phone",
      "smartphone",
      "iphone",
      "android",
      "tablet",
      "ipad",
      "laptop",
      "computer",
      "desktop",
      "monitor",
      "tv",
      "television",
      "headphones",
      "earbuds",
      "speaker",
      "bluetooth",
      "camera",
      "gaming",
      "console",
      "xbox",
      "playstation",
      "nintendo",
    ],
    Clothing: [
      "shirt",
      "t-shirt",
      "pants",
      "jeans",
      "dress",
      "skirt",
      "jacket",
      "coat",
      "sweater",
      "hoodie",
      "shoes",
      "sneakers",
      "boots",
      "hat",
      "cap",
      "socks",
      "underwear",
      "bra",
      "swimwear",
    ],
    "Home & Garden": [
      "furniture",
      "chair",
      "table",
      "desk",
      "bed",
      "mattress",
      "sofa",
      "couch",
      "lamp",
      "lighting",
      "kitchen",
      "cookware",
      "dishes",
      "bedding",
      "towels",
      "curtains",
      "rug",
      "carpet",
      "garden",
      "tools",
      "hardware",
    ],
    "Toys & Games": [
      "toy",
      "doll",
      "action figure",
      "lego",
      "puzzle",
      "board game",
      "video game",
      "educational",
      "kids",
      "children",
      "baby",
      "stroller",
      "car seat",
    ],
    "Sports & Outdoors": [
      "fitness",
      "exercise",
      "gym",
      "weights",
      "treadmill",
      "bike",
      "bicycle",
      "outdoor",
      "camping",
      "hiking",
      "sports",
      "ball",
      "equipment",
      "athletic",
    ],
    "Beauty & Health": [
      "makeup",
      "cosmetics",
      "skincare",
      "perfume",
      "cologne",
      "shampoo",
      "conditioner",
      "lotion",
      "cream",
      "vitamins",
      "supplements",
      "health",
      "beauty",
    ],
    "Books & Media": [
      "book",
      "novel",
      "textbook",
      "magazine",
      "dvd",
      "blu-ray",
      "cd",
      "vinyl",
      "record",
      "music",
      "movie",
      "film",
    ],
    Automotive: ["car", "auto", "automotive", "tire", "battery", "oil", "parts", "accessories", "motorcycle", "bike"],
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category
    }
  }

  return "Other"
}
