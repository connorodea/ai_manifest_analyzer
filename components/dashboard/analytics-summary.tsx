"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Package, BarChart3 } from "lucide-react"
import { getFixedManifestSummary } from "@/lib/actions/fixed-manifest-actions"
import { getEnhancedManifestSummary } from "@/lib/actions/enhanced-manifest-actions"

interface SummaryData {
  totalManifests: number
  totalItems: number
  totalValue: number
  totalProfit: number
  averageROI: number
}

export function AnalyticsSummary() {
  const [summary, setSummary] = useState<SummaryData>({
    totalManifests: 0,
    totalItems: 0,
    totalValue: 0,
    totalProfit: 0,
    averageROI: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    try {
      setLoading(true)

      // Load summaries from both manifest types
      const [fixedSummary, enhancedSummary] = await Promise.all([
        getFixedManifestSummary("current-user"),
        getEnhancedManifestSummary("current-user"),
      ])

      // Combine the summaries
      const combinedSummary: SummaryData = {
        totalManifests: fixedSummary.totalManifests + enhancedSummary.totalManifests,
        totalItems: fixedSummary.totalItems + enhancedSummary.totalItems,
        totalValue: fixedSummary.totalValue + enhancedSummary.totalValue,
        totalProfit: fixedSummary.totalProfit + enhancedSummary.totalProfit,
        averageROI: 0,
      }

      // Calculate weighted average ROI
      if (combinedSummary.totalValue > 0) {
        combinedSummary.averageROI = (combinedSummary.totalProfit / combinedSummary.totalValue) * 100
      }

      setSummary(combinedSummary)
    } catch (err) {
      console.error("Error loading summary:", err)
      setError(err instanceof Error ? err.message : "Failed to load summary")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Error loading analytics: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
          <p className="text-xs text-muted-foreground">Across {formatNumber(summary.totalManifests)} manifests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalProfit)}</div>
          <p className="text-xs text-muted-foreground">{summary.averageROI.toFixed(1)}% average ROI</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(summary.totalItems)}</div>
          <p className="text-xs text-muted-foreground">Items analyzed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manifests</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(summary.totalManifests)}</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalItems > 0 ? Math.round(summary.totalItems / summary.totalManifests) : 0} avg items per
            manifest
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
