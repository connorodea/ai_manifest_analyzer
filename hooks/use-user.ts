"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/actions/auth-actions"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: string
  subscriptionTier: string
  subscriptionStatus: string
  createdAt: Date
  emailVerified: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}
