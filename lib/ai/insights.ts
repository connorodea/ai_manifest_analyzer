"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const InsightsSchema = z.object({
  executiveSummary: z.string(),
  keyFindings: z.array(z.string()),
  opportunities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      potentialValue: z.number(),
      effort: z.enum(["low", "medium", "high"]),
    }),
  ),
  risks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(["low", "medium", "high"]),
      mitigation: z.string(),
    }),
  ),
  recommendations: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      action: z.string(),
      rationale: z.string(),
      timeline: z.string(),
    }),
  ),
  marketAnalysis: z.object({
    demandLevel: z.enum(["low", "medium", "high"]),
    competitionLevel: z.enum(["low", "medium", "high"]),
    priceStability: z.enum(["volatile", "stable", "trending"]),
    seasonalFactors: z.string(),
  }),
  profitabilityScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(1),
})

export type ManifestInsights = z.infer<typeof InsightsSchema>

export async function generateManifestInsights(manifestData: {
  totalItems: number
  totalValue: number
  averageValue: number
  categories: Record<string, number>
  riskDistribution: { low: number; medium: number; high: number }
  topItems: Array<{
    title: string
    value: number
    category: string
    risk: number
  }>
}): Promise<ManifestInsights> {
  try {
    console.log(`🧠 Generating strategic insights for manifest...`)

    const insights = await generateObject({
      model: openai("gpt-4o"),
      schema: InsightsSchema,
      prompt: `Analyze this liquidation manifest and provide comprehensive strategic insights:

MANIFEST OVERVIEW:
- Total Items: ${manifestData.totalItems}
- Total Estimated Value: $${manifestData.totalValue.toFixed(2)}
- Average Item Value: $${manifestData.averageValue.toFixed(2)}

CATEGORY BREAKDOWN:
${Object.entries(manifestData.categories)
  .map(
    ([category, count]) => `- ${category}: ${count} items (${((count / manifestData.totalItems) * 100).toFixed(1)}%)`,
  )
  .join("\n")}

RISK DISTRIBUTION:
- Low Risk: ${manifestData.riskDistribution.low} items
- Medium Risk: ${manifestData.riskDistribution.medium} items
- High Risk: ${manifestData.riskDistribution.high} items

TOP VALUE ITEMS:
${manifestData.topItems
  .map((item, i) => `${i + 1}. ${item.title} - $${item.value.toFixed(2)} (${item.category}, Risk: ${item.risk}/100)`)
  .join("\n")}

Provide comprehensive analysis including:

1. Executive Summary: High-level overview of the manifest's potential
2. Key Findings: Most important discoveries from the analysis
3. Opportunities: Specific profit opportunities with potential value and effort required
4. Risks: Potential challenges with impact level and mitigation strategies
5. Recommendations: Prioritized action items with rationale and timeline
6. Market Analysis: Current market conditions affecting this manifest
7. Profitability Score: Overall profit potential (0-100)
8. Confidence Score: How confident you are in this analysis (0-1)

Focus on actionable insights that will help maximize returns from this liquidation manifest.`,

      system: `You are a senior liquidation strategist with expertise in resale markets, inventory management, and profit optimization. Provide practical, actionable insights based on current market conditions.`,
    })

    console.log(`✅ Strategic insights generated`)
    return insights.object
  } catch (error) {
    console.error(`❌ Insights generation failed:`, error)

    // Fallback insights
    return {
      executiveSummary: `Analysis of ${manifestData.totalItems} items with total estimated value of $${manifestData.totalValue.toFixed(2)}. Detailed insights unavailable due to analysis error.`,
      keyFindings: ["Analysis incomplete due to technical issues", "Manual review recommended for accurate assessment"],
      opportunities: [
        {
          title: "Manual Review Required",
          description: "Conduct detailed manual analysis of high-value items",
          potentialValue: manifestData.totalValue * 0.1,
          effort: "high" as const,
        },
      ],
      risks: [
        {
          title: "Analysis Incomplete",
          description: "Automated analysis failed - may miss important insights",
          impact: "medium" as const,
          mitigation: "Perform manual analysis and market research",
        },
      ],
      recommendations: [
        {
          priority: "high" as const,
          action: "Conduct manual analysis of top-value items",
          rationale: "Automated analysis failed to complete",
          timeline: "Immediate",
        },
      ],
      marketAnalysis: {
        demandLevel: "medium" as const,
        competitionLevel: "medium" as const,
        priceStability: "stable" as const,
        seasonalFactors: "Analysis unavailable",
      },
      profitabilityScore: 50,
      confidenceScore: 0.3,
    }
  }
}

export async function generateCategoryInsights(
  category: string,
  items: Array<{
    title: string
    value: number
    risk: number
    condition: string
  }>,
): Promise<{
  categoryTrend: "rising" | "stable" | "declining"
  averageMargin: number
  bestPerformers: string[]
  challenges: string[]
  recommendations: string[]
}> {
  try {
    console.log(`📊 Generating category insights for ${category}...`)

    const categoryInsights = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        categoryTrend: z.enum(["rising", "stable", "declining"]),
        averageMargin: z.number(),
        bestPerformers: z.array(z.string()),
        challenges: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      prompt: `Analyze the ${category} category from this liquidation manifest:

ITEMS IN CATEGORY:
${items
  .map(
    (item, i) =>
      `${i + 1}. ${item.title} - $${item.value.toFixed(2)} (Risk: ${item.risk}/100, Condition: ${item.condition})`,
  )
  .join("\n")}

Total Items: ${items.length}
Average Value: $${(items.reduce((sum, item) => sum + item.value, 0) / items.length).toFixed(2)}

Provide:
1. Current market trend for this category (rising/stable/declining)
2. Expected average profit margin for these items
3. Best performing item types in this category
4. Main challenges for selling items in this category
5. Specific recommendations for maximizing returns

Consider current market conditions, seasonal factors, and liquidation market dynamics.`,

      system: `You are a category specialist with deep knowledge of liquidation and resale markets. Focus on practical, actionable insights.`,
    })

    console.log(`✅ Category insights generated for ${category}`)
    return categoryInsights.object
  } catch (error) {
    console.error(`❌ Category insights generation failed for ${category}:`, error)

    return {
      categoryTrend: "stable" as const,
      averageMargin: 25,
      bestPerformers: ["Analysis unavailable"],
      challenges: ["Category analysis failed"],
      recommendations: ["Conduct manual market research for this category"],
    }
  }
}
