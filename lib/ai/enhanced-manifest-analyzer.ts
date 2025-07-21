// lib/ai/enhanced-manifest-analyzer.ts

import { parseEnhancedManifestCSV } from "../utils/manifest-parser"
import { validateManifestStructure } from "../utils/manifest-validator"

export async function analyzeEnhancedManifest(manifestContent: string): Promise<any> {
  try {
    const items = await parseEnhancedManifestCSV(manifestContent)

    const validation = await validateManifestStructure(items)

    if (!validation.isValid) {
      throw new Error(`Manifest validation failed: ${validation.errors.join(", ")}`)
    }

    return {
      items,
      validation,
    }
  } catch (error: any) {
    console.error("Error analyzing enhanced manifest:", error)
    throw new Error(`Failed to analyze enhanced manifest: ${error.message}`)
  }
}
