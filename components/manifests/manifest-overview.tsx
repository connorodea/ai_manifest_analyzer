"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2 } from "lucide-react"
import { getManifestAnalysis } from "@/lib/actions/manifest-actions"
import type { ManifestAnalysisResult } from "@/lib/ai/analysis-service"

interface ManifestOverviewProps {
  manifestId: string
}

export function ManifestOverview({ manifestId }: ManifestOverviewProps) {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analysis...</span>
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

  const categoryData = Object.entries(analysis.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    percentage: (value / analysis.totalItems) * 100,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>AI Analysis Summary</CardTitle>
          <CardDescription>Overview of AI-powered manifest analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="flex items-center">
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" /> AI Analyzed
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Total Items</div>
              <div className="text-2xl font-bold">{analysis.totalItems}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Estimated Value</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.estimatedTotalValue)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">AI Confidence</div>
              <div className="flex items-center gap-2">
                <Progress value={analysis.aiConfidenceScore * 100} className="h-2" />
                <span className="text-sm font-medium">{Math.round(analysis.aiConfidenceScore * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>AI-identified product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div className="w-1/3 font-medium">{category.name}</div>
                <div className="w-1/3">
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} className="h-2" />
                    <span className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-1/3 flex items-center gap-2">
                  <span className="font-medium">{category.value} items</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>AI risk analysis distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Risk</span>
                <span className="text-sm text-muted-foreground">{analysis.riskBreakdown.lowRisk} items</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(analysis.riskBreakdown.lowRisk / analysis.totalItems) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Risk</span>
                <span className="text-sm text-muted-foreground">{analysis.riskBreakdown.mediumRisk} items</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{ width: `${(analysis.riskBreakdown.mediumRisk / analysis.totalItems) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Risk</span>
                <span className="text-sm text-muted-foreground">{analysis.riskBreakdown.highRisk} items</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(analysis.riskBreakdown.highRisk / analysis.totalItems) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Processing Details</CardTitle>
          <CardDescription>AI analysis performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{(analysis.processingTime / 1000).toFixed(1)}s</div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatCurrency(analysis.estimatedTotalValue / analysis.totalItems)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Item Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.insights.profitabilityScore}/100</div>
              <div className="text-sm text-muted-foreground">Profitability Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
