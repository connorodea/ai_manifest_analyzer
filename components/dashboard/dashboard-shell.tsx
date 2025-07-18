import type React from "react"
import { UserNav } from "@/components/dashboard/user-nav"
import { MainNav } from "@/components/dashboard/main-nav"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 container py-8">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  )
}
