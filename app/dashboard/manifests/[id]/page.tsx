import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { EnhancedManifestInsights } from "@/components/manifests/enhanced-manifest-insights"
import { ManifestOverview } from "@/components/manifests/manifest-overview"
import { ItemsTable } from "@/components/manifests/items-table"
import { getEnhancedManifestById } from "@/lib/actions/enhanced-manifest-actions"
import { BarChart3, FileText, Brain, Table } from "lucide-react"

interface ManifestPageProps {
  params: {
    id: string
  }
}

export default async function ManifestPage({ params }: ManifestPageProps) {
  let manifest

  try {
    manifest = await getEnhancedManifestById(params.id)
  } catch (error) {
    console.error("Error loading manifest:", error)
    notFound()
  }

  if (!manifest) {
    notFound()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{manifest.manifestName}</h1>
          <p className="text-muted-foreground">
            Comprehensive AI analysis with {manifest.analyzedItems} items analyzed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI Confidence: {Math.round(manifest.summary.confidenceScore * 100)}%
          </Badge>
          <Badge variant="secondary">ROI: {manifest.summary.expectedROI.toFixed(1)}%</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manifest.analyzedItems}</div>
            <p className="text-xs text-muted-foreground">of {manifest.totalItems} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retail Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(manifest.totalRetailValue)}</div>
            <p className="text-xs text-muted-foreground">Original retail pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(manifest.totalEstimatedValue)}</div>
            <p className="text-xs text-muted-foreground">AI-estimated market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Potential</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(manifest.totalPotentialProfit)}</div>
            <p className="text-xs text-muted-foreground">Expected profit margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <Suspense fallback={<ManifestInsightsSkeleton />}>
            <EnhancedManifestInsights manifestId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="overview">
          <Suspense fallback={<ManifestOverviewSkeleton />}>
            <ManifestOverview manifestId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="items">
          <Suspense fallback={<ItemsTableSkeleton />}>
            <ItemsTable manifestId={params.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ManifestInsightsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ManifestOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}

function ItemsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
