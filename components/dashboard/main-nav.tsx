"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Settings, Upload, Home, Package, TestTube } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Manifests",
    href: "/dashboard/manifests",
    icon: Package,
  },
  {
    name: "Upload",
    href: "/dashboard/comprehensive-analysis",
    icon: Upload,
  },
  {
    name: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
    children: [
      {
        name: "Browse Templates",
        href: "/dashboard/templates",
      },
      {
        name: "Custom Templates",
        href: "/dashboard/templates/custom",
      },
    ],
  },
  {
    name: "Test Analysis",
    href: "/dashboard/test-analysis",
    icon: TestTube,
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
      {navigation.map((item) => (
        <div key={item.name} className="relative group">
          <Link
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
              pathname === item.href ? "text-black dark:text-white" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>

          {item.children && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={cn(
                      "block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                      pathname === child.href
                        ? "text-black dark:text-white bg-gray-50 dark:bg-gray-700"
                        : "text-muted-foreground",
                    )}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
