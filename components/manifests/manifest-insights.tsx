"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, TrendingUp, AlertTriangle, DollarSign, BarChart2, Zap, Loader2 } from "lucide-react"
import { getManifestAnalysis } from "@/lib/actions/manifest-actions"
import type { ManifestAnalysisResult } from "@/lib/ai/analysis-service"

interface ManifestInsightsProps {
  manifestId: string
}

export function ManifestInsights({ manifestId }: ManifestInsightsProps) {
  const [analysis, setAnalysis] = useState<ManifestAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const result = await getManifestAnalysis(manifestId)
        setAnalysis(result)
      } catch (error) {
        console.error("Error fetching analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [manifestId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading AI insights...</span>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center p-8">
        <p>No analysis data available for this manifest.</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>AI-Generated Insights</CardTitle>
          </div>
          <CardDescription>Comprehensive analysis and recommendations from our AI system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Executive Summary</AlertTitle>
            <AlertDescription>{analysis.insights.summary}</AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Key Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{analysis.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span className="font-medium">{formatCurrency(analysis.estimatedTotalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Item Value:</span>
                  <span className="font-medium">
                    {formatCurrency(analysis.estimatedTotalValue / analysis.totalItems)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">{(analysis.processingTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">AI Confidence</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Overall Score</Badge>
                  <span className="font-medium">{Math.round(analysis.aiConfidenceScore * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Profitability</Badge>
                  <span className="font-medium">{analysis.insights.profitabilityScore}/100</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="opportunities">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="market">Market Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="opportunities" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Profit Opportunities</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.insights.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <DollarSign className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{opportunity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="risks" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold">Risk Factors</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.insights.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{risk}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="market" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Market Analysis</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.insights.marketTrends.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{trend}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>Actionable recommendations to maximize your returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Strategic Recommendations</h3>
              <ul className="space-y-2">
                {analysis.insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Risk Distribution</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Low Risk Items:</span>
                    <Badge className="bg-green-500">{analysis.riskBreakdown.lowRisk}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk Items:</span>
                    <Badge className="bg-yellow-500">{analysis.riskBreakdown.mediumRisk}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk Items:</span>
                    <Badge className="bg-red-500">{analysis.riskBreakdown.highRisk}</Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Category Performance</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(analysis.categoryBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([category, count]) => (
                      <div key={category} className="flex justify-between">
                        <span>{category}:</span>
                        <Badge variant="outline">{count} items</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
