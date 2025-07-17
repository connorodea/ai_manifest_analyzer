"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Bot className="h-6 w-6" />
        <span className="font-bold inline-block">AI Manifest Analyzer</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/manifests"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard/manifests" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Manifests
        </Link>
        <Link
          href="/dashboard/analytics"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard/analytics" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Analytics
        </Link>
      </nav>
    </div>
  )
}
