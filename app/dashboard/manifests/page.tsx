import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ManifestsList } from "@/components/manifests/manifests-list"
import { verifySession } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Manifests | AI Manifest Analyzer Pro",
  description: "View and manage all your analyzed manifests",
}

export default async function ManifestsPage() {
  const session = await verifySession()

  return (
    <DashboardShell>
      <DashboardHeader heading="All Manifests" text="View and manage all your uploaded and analyzed manifests." />
      <ManifestsList userId={session.userId} />
    </DashboardShell>
  )
}
