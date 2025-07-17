import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManifestOverview } from "@/components/manifests/manifest-overview"
import { ItemsTable } from "@/components/manifests/items-table"
import { ManifestInsights } from "@/components/manifests/manifest-insights"
import { Download, Share } from "lucide-react"

export const metadata: Metadata = {
  title: "Manifest Details | AI Manifest Analyzer Pro",
  description: "View detailed analysis of your liquidation manifest",
}

interface ManifestPageProps {
  params: {
    id: string
  }
}

export default function ManifestPage({ params }: ManifestPageProps) {
  // In a real app, we would fetch the manifest data here
  // For now, we'll use mock data
  const manifest = {
    id: params.id,
    name: "Electronics Pallet #4872",
    status: "completed",
    totalItems: 87,
    estimatedValue: 12450.75,
    createdAt: "2023-07-15T10:30:00Z",
    confidence: 0.92,
  }

  if (!manifest) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={manifest.name}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ManifestOverview manifestId={params.id} />
        </TabsContent>
        <TabsContent value="items" className="space-y-4">
          <ItemsTable manifestId={params.id} />
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <ManifestInsights manifestId={params.id} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
