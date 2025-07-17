"use server"

export async function cleanDescription(description: string): Promise<string> {
  if (!description) return ""

  // Remove extra whitespace
  let cleaned = description.trim().replace(/\s+/g, " ")

  // Remove common noise words and characters
  cleaned = cleaned
    .replace(/[^\w\s\-.]/g, " ") // Remove special characters except hyphens and periods
    .replace(/\b(lot|pallet|case|box|unit|piece|pc|pcs|ea|each)\b/gi, "") // Remove quantity words
    .replace(/\b(new|used|refurbished|open box|damaged|broken)\b/gi, "") // Remove condition words (we handle these separately)
    .replace(/\s+/g, " ") // Normalize whitespace again
    .trim()

  return cleaned
}

export async function extractCondition(description: string): Promise<string> {
  const conditionKeywords = {
    excellent: ["excellent", "mint", "perfect", "pristine"],
    good: ["good", "working", "functional"],
    fair: ["fair", "average", "okay"],
    poor: ["poor", "worn", "scratched"],
    damaged: ["damaged", "broken", "cracked", "defective", "not working"],
  }

  const lowerDesc = description.toLowerCase()

  for (const [condition, keywords] of Object.entries(conditionKeywords)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return condition.charAt(0).toUpperCase() + condition.slice(1)
    }
  }

  return "Unknown"
}
