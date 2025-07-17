"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function estimateValue(
  description: string,
  category: string,
  brand: string,
  model: string,
  condition: string,
): Promise<{
  estimatedValue: number
  marketValueLow: number
  marketValueHigh: number
  marketScore: number
  demandScore: number
  seasonalityFactor: number
  comparableSales: any[]
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Estimate the market value for this product:

Description: "${description}"
Category: ${category}
Brand: ${brand}
Model: ${model}
Condition: ${condition}

Consider current market conditions, demand, and seasonality. Respond with a JSON object containing:
- estimatedValue: best estimate in USD
- marketValueLow: lowest reasonable price
- marketValueHigh: highest reasonable price
- marketScore: market performance score (1-100)
- demandScore: demand level score (1-100)
- seasonalityFactor: seasonal adjustment (0.5-1.5)

Example response:
{
  "estimatedValue": 450.00,
  "marketValueLow": 380.00,
  "marketValueHigh": 520.00,
  "marketScore": 75,
  "demandScore": 82,
  "seasonalityFactor": 1.1
}`,
      system: "You are a market valuation expert with access to current pricing data. Always respond with valid JSON.",
    })

    const result = JSON.parse(text)

    return {
      estimatedValue: result.estimatedValue || 0,
      marketValueLow: result.marketValueLow || 0,
      marketValueHigh: result.marketValueHigh || 0,
      marketScore: result.marketScore || 50,
      demandScore: result.demandScore || 50,
      seasonalityFactor: result.seasonalityFactor || 1.0,
      comparableSales: [], // In a real app, we would fetch actual comparable sales data
    }
  } catch (error) {
    console.error("Error estimating value:", error)

    // Fallback to simple estimation based on category
    const baseValue = getCategoryBaseValue(category)
    const conditionMultiplier = getConditionMultiplier(condition)

    return {
      estimatedValue: baseValue * conditionMultiplier,
      marketValueLow: baseValue * conditionMultiplier * 0.8,
      marketValueHigh: baseValue * conditionMultiplier * 1.2,
      marketScore: 50,
      demandScore: 50,
      seasonalityFactor: 1.0,
      comparableSales: [],
    }
  }
}

export async function assessRisk(
  description: string,
  category: string,
  brand: string,
  model: string,
  estimatedValue: number,
): Promise<{
  riskScore: number
  authenticityScore: number
  riskFactors: string[]
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Assess the risk factors for this product:

Description: "${description}"
Category: ${category}
Brand: ${brand}
Model: ${model}
Estimated Value: $${estimatedValue}

Consider authenticity risk, market saturation, condition issues, and other factors. Respond with a JSON object containing:
- riskScore: overall risk score (1-100, higher = more risky)
- authenticityScore: authenticity confidence (1-100, higher = more authentic)
- riskFactors: array of specific risk factors

Example response:
{
  "riskScore": 25,
  "authenticityScore": 90,
  "riskFactors": ["Market saturation", "Seasonal demand"]
}`,
      system: "You are a risk assessment expert for liquidation products. Always respond with valid JSON.",
    })

    const result = JSON.parse(text)

    return {
      riskScore: result.riskScore || 50,
      authenticityScore: result.authenticityScore || 80,
      riskFactors: result.riskFactors || [],
    }
  } catch (error) {
    console.error("Error assessing risk:", error)

    // Fallback risk assessment
    const riskScore = Math.floor(Math.random() * 100) + 1

    return {
      riskScore,
      authenticityScore: 80,
      riskFactors: riskScore > 70 ? ["High risk item"] : [],
    }
  }
}

function getCategoryBaseValue(category: string): number {
  const categoryValues: Record<string, number> = {
    Electronics: 200,
    "Clothing & Accessories": 50,
    "Home & Garden": 75,
    "Toys & Games": 30,
    "Sports & Outdoors": 100,
    "Health & Beauty": 25,
    Automotive: 150,
    "Books & Media": 15,
    "Industrial Equipment": 500,
    Other: 50,
  }

  return categoryValues[category] || 50
}

function getConditionMultiplier(condition: string): number {
  const conditionMultipliers: Record<string, number> = {
    Excellent: 1.0,
    Good: 0.85,
    Fair: 0.65,
    Poor: 0.4,
    Damaged: 0.2,
    Unknown: 0.7,
  }

  return conditionMultipliers[condition] || 0.7
}
