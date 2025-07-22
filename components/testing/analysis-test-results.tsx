"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  TrendingUp,
  DollarSign,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  BarChart3,
  Target,
  AlertTriangle,
} from "lucide-react"
import {
  getAllEnhancedManifests,
  deleteEnhancedManifest,
  reanalyzeManifest,
} from "@/lib/actions/enhanced-manifest-actions"
import type { ComprehensiveManifestAnalysisResult } from "@/lib/ai/enhanced-analysis-service"

export function AnalysisTestResults() {
  const [results, setResults] = useState<ComprehensiveManifestAnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reanalyzing, setReanalyzing] = useState<string | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const manifests = await getAllEnhancedManifests("test-user")
      setResults(manifests.sort((a, b) => new Date(b.manifestId).getTime() - new Date(a.manifestId).getTime()))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (manifestId: string) => {
    try {
      const response = await deleteEnhancedManifest(manifestId)
      if (response.success) {
        setResults((prev) => prev.filter((r) => r.manifestId !== manifestId))
      } else {
        setError(response.error || "Failed to delete manifest")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete manifest")
    }
  }

  const handleReanalyze = async (manifestId: string) => {
    try {
      setReanalyzing(manifestId)
      const response = await reanalyzeManifest(manifestId)
      if (response.success && response.result) {
        setResults((prev) => prev.map((r) => (r.manifestId === manifestId ? response.result! : r)))
      } else {
        setError(response.error || "Failed to reanalyze manifest")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reanalyze manifest")
    } finally {
      setReanalyzing(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100)
    if (percentage >= 80) return <Badge variant="default">High ({percentage}%)</Badge>
    if (percentage >= 60) return <Badge variant="secondary">Medium ({percentage}%)</Badge>
    return <Badge variant="outline">Low ({percentage}%)</Badge>
  }

  const getRiskBadge = (riskDistribution: any) => {
    const total = Object.values(riskDistribution).reduce((sum: number, count: any) => sum + count, 0)
    const highRisk = ((riskDistribution.high + riskDistribution.veryHigh) / total) * 100

    if (highRisk > 50) return <Badge variant="destructive">High Risk</Badge>
    if (highRisk > 25) return <Badge variant="outline">Medium Risk</Badge>
    return <Badge variant="default">Low Risk</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-8 space-y-4">
        <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No Analysis Results Yet</h3>
          <p className="text-muted-foreground">
            Generate test data or upload a CSV manifest to see AI analysis results here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">
              {results.reduce((sum, r) => sum + r.analyzedItems, 0)} items total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((results.reduce((sum, r) => sum + r.summary.confidenceScore, 0) / results.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">AI analysis confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(results.reduce((sum, r) => sum + r.summary.expectedROI, 0) / results.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Expected return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(results.reduce((sum, r) => sum + r.totalPotentialProfit, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Across all analyses</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analysis Results</h3>
          <Button variant="outline" size="sm" onClick={loadResults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {results.map((result) => (
          <Card key={result.manifestId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{result.manifestName}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(result.processingTime)}
                    </span>
                    <span>{result.analyzedItems} items analyzed</span>
                    <span>ID: {result.manifestId.split("-").pop()}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getConfidenceBadge(result.summary.confidenceScore)}
                  {getRiskBadge(result.summary.riskDistribution)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">{formatCurrency(result.totalRetailValue)}</div>
                  <div className="text-xs text-blue-600">Retail Value</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">{formatCurrency(result.totalEstimatedValue)}</div>
                  <div className="text-xs text-green-600">Est. Value</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-700">{formatCurrency(result.totalPotentialProfit)}</div>
                  <div className="text-xs text-purple-600">Profit</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-700">{result.summary.expectedROI.toFixed(1)}%</div>
                  <div className="text-xs text-orange-600">ROI</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h4 className="font-medium mb-2">Top Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.summary.categoryBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, count]) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category} ({count})
                      </Badge>
                    ))}
                </div>
              </div>

              {/* AI Insights Preview */}
              <div>
                <h4 className="font-medium mb-2">AI Executive Summary</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{result.insights.executiveSummary}</p>
              </div>

              {/* Market Analysis */}
              <div>
                <h4 className="font-medium mb-2">Market Condition</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      result.insights.marketAnalysis.overallMarketCondition === "Excellent"
                        ? "default"
                        : result.insights.marketAnalysis.overallMarketCondition === "Good"
                          ? "secondary"
                          : result.insights.marketAnalysis.overallMarketCondition === "Fair"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {result.insights.marketAnalysis.overallMarketCondition}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {result.insights.marketAnalysis.topPerformingCategories.slice(0, 2).join(", ")} leading
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button asChild size="sm">
                  <a href={`/dashboard/manifests/${result.manifestId}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Analysis
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReanalyze(result.manifestId)}
                  disabled={reanalyzing === result.manifestId}
                >
                  {reanalyzing === result.manifestId ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Reanalyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reanalyze
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(result.manifestId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
