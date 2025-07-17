import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ManifestUploader } from "@/components/dashboard/manifest-uploader"
import { RecentManifests } from "@/components/dashboard/recent-manifests"
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary"

export const metadata: Metadata = {
  title: "Dashboard | AI Manifest Analyzer Pro",
  description: "Upload and analyze your liquidation manifests with AI",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Upload and analyze your liquidation manifests with AI." />
      <div className="grid gap-8">
        <ManifestUploader />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnalyticsSummary />
        </div>
        <RecentManifests />
      </div>
    </DashboardShell>
  )
}
