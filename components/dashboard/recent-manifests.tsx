"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, TrendingUp, Clock } from "lucide-react"
import { getAllFixedManifests } from "@/lib/actions/fixed-manifest-actions"
import { getAllEnhancedManifests } from "@/lib/actions/enhanced-manifest-actions"
import type { SimpleManifestAnalysisResult } from "@/lib/ai/simple-analysis-service"
import type { ComprehensiveManifestAnalysisResult } from "@/lib/ai/enhanced-analysis-service"

type ManifestResult = SimpleManifestAnalysisResult | ComprehensiveManifestAnalysisResult

export function RecentManifests() {
  const [manifests, setManifests] = useState<ManifestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadManifests()
  }, [])

  const loadManifests = async () => {
    try {
      setLoading(true)

      // Load both types of manifests
      const [fixedManifests, enhancedManifests] = await Promise.all([
        getAllFixedManifests("current-user"),
        getAllEnhancedManifests("current-user"),
      ])

      // Combine and sort by most recent
      const allManifests = [...fixedManifests, ...enhancedManifests]
      const sortedManifests = allManifests
        .sort((a, b) => {
          const aTime = new Date(a.manifestId.split("-")[1] || 0).getTime()
          const bTime = new Date(b.manifestId.split("-")[1] || 0).getTime()
          return bTime - aTime
        })
        .slice(0, 5) // Show only 5 most recent

      setManifests(sortedManifests)
    } catch (err) {
      console.error("Error loading manifests:", err)
      setError(err instanceof Error ? err.message : "Failed to load manifests")
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

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const isEnhancedManifest = (manifest: ManifestResult): manifest is ComprehensiveManifestAnalysisResult => {
    return "analyzedItems" in manifest
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Manifests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Manifests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Error loading manifests: {error}</p>
            <Button variant="outline" size="sm" onClick={loadManifests} className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (manifests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Manifests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No manifests uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload your first manifest to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Manifests
        </CardTitle>
        <CardDescription>Your latest manifest analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {manifests.map((manifest) => (
            <div key={manifest.manifestId} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{manifest.manifestName}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(manifest.processingTime)}
                    </span>
                    <span>{isEnhancedManifest(manifest) ? manifest.analyzedItems : manifest.totalItems} items</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {formatCurrency(manifest.totalPotentialProfit)} profit
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEnhancedManifest(manifest) ? (
                  <Badge variant="default" className="text-xs">
                    Enhanced
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Standard
                  </Badge>
                )}
                <Button asChild size="sm" variant="outline">
                  <a href={`/dashboard/manifests/${manifest.manifestId}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {manifests.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href="/dashboard/manifests">View All Manifests</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
