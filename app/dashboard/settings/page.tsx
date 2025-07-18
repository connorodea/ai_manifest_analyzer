import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserProfileForm } from "@/components/settings/user-profile-form"
import { SubscriptionCard } from "@/components/settings/subscription-card"
import { verifySession } from "@/lib/auth/session"
import { getCurrentUser } from "@/lib/actions/auth-actions"

export const metadata: Metadata = {
  title: "Settings | AI Manifest Analyzer Pro",
  description: "Manage your account settings and subscription",
}

export default async function SettingsPage() {
  await verifySession()
  const user = await getCurrentUser()

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and subscription." />
      <div className="grid gap-8">
        <UserProfileForm user={user} />
        <SubscriptionCard user={user} />
      </div>
    </DashboardShell>
  )
}
