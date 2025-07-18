"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, HelpCircle, LogOut, Crown } from "lucide-react"
import { logout } from "@/lib/actions/auth-actions"
import { useUser } from "@/hooks/use-user"

export function UserNav() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return null
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      starter: { label: "Starter", className: "bg-gray-500" },
      professional: { label: "Pro", className: "bg-blue-500" },
      enterprise: { label: "Enterprise", className: "bg-purple-500" },
    }

    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter

    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.firstName} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {getTierBadge(user.subscriptionTier)}
              {user.role === "admin" && (
                <Badge variant="outline">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
