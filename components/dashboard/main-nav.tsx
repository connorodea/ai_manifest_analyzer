"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Settings, TestTube, BarChart3 } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Manifests",
    href: "/dashboard/manifests",
    icon: FileText,
  },
  {
    name: "Test Analysis",
    href: "/dashboard/test-analysis",
    icon: TestTube,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-black dark:text-white" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
