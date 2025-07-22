"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  subscription?: {
    plan: string
    status: string
    expiresAt?: string
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from your auth system
    // For now, we'll simulate a logged-in user
    const simulateUser = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user is logged in (you'd check cookies/tokens here)
        const isLoggedIn = true // This would be actual auth check

        if (isLoggedIn) {
          setUser({
            id: "demo-user-123",
            name: "Demo User",
            email: "demo@example.com",
            avatar: "/placeholder.svg?height=32&width=32",
            subscription: {
              plan: "Pro",
              status: "active",
              expiresAt: "2024-12-31",
            },
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    simulateUser()
  }, [])

  const updateUser = (updates: Partial<User>) => {
    setUser((current) => (current ? { ...current, ...updates } : null))
  }

  return {
    user,
    loading,
    updateUser,
    isAuthenticated: !!user,
  }
}
