"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, FileText, Target } from "lucide-react"
import { getManifestSummary } from "@/lib/actions/manifest-actions"

interface AnalyticsData {
  totalManifests: number
  totalItems: number
  totalValue: number
  totalProfit: number
  averageROI: number
}

export function AnalyticsSummary() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalManifests: 0,
    totalItems: 0,
    totalValue: 0,
    totalProfit: 0,
    averageROI: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // In a real app, get the actual user ID
        const userId = "demo-user"
        const data = await getManifestSummary(userId)
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        // Set demo data for now
        setAnalytics({
          totalManifests: 12,
          totalItems: 1847,
          totalValue: 156780.5,
          totalProfit: 47034.15,
          averageROI: 30.0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

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
      <>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20 mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Manifests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalManifests)}</div>
          <p className="text-xs text-muted-foreground">Analyzed manifests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(analytics.totalItems)}</div>
          <p className="text-xs text-muted-foreground">Items processed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(analytics.totalValue)}</div>
          <p className="text-xs text-muted-foreground">Estimated market value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averageROI.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Expected return on investment</p>
        </CardContent>
      </Card>
    </>
  )
}
