import type { Metadata } from "next"
import { Suspense } from "react"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecentManifests } from "@/components/dashboard/recent-manifests"
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary"
import { ManifestUploader } from "@/components/dashboard/manifest-uploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Dashboard | AI Manifest Analyzer Pro",
  description: "Upload and analyze your liquidation manifests with AI",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your liquidation manifests and view analytics.">
        <div className="flex items-center space-x-2">{/* Add any header actions here */}</div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-32" />}>
          <AnalyticsSummary />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upload New Manifest</CardTitle>
            <CardDescription>Upload your liquidation manifest for AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ManifestUploader />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Manifests</CardTitle>
            <CardDescription>Your recently uploaded and analyzed manifests</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <RecentManifests />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
