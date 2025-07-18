"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { createSession, deleteSession, getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

// Mock user database - in production, this would be a real database
const users = new Map([
  [
    "user@example.com",
    {
      id: "user-1",
      email: "user@example.com",
      passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1NO", // "password123"
      firstName: "Demo",
      lastName: "User",
      company: "Demo Company",
      role: "user",
      subscriptionTier: "professional",
      subscriptionStatus: "active",
      createdAt: new Date("2023-01-01"),
      emailVerified: true,
    },
  ],
  [
    "admin@example.com",
    {
      id: "admin-1",
      email: "admin@example.com",
      passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1NO", // "password123"
      firstName: "Admin",
      lastName: "User",
      company: "AI Manifest Analyzer Pro",
      role: "admin",
      subscriptionTier: "enterprise",
      subscriptionStatus: "active",
      createdAt: new Date("2023-01-01"),
      emailVerified: true,
    },
  ],
])

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
})

export async function login(prevState: any, formData: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data
    const user = users.get(email.toLowerCase())

    if (!user) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      }
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      }
    }

    if (!user.emailVerified) {
      return {
        errors: {
          email: ["Please verify your email address before logging in"],
        },
      }
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      errors: {
        email: ["An error occurred during login. Please try again."],
      },
    }
  }
}

export async function register(prevState: any, formData: FormData) {
  try {
    const validatedFields = registerSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      company: formData.get("company"),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password, firstName, lastName, company } = validatedFields.data

    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return {
        errors: {
          email: ["An account with this email already exists"],
        },
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      company: company || "",
      role: "user",
      subscriptionTier: "starter",
      subscriptionStatus: "active",
      createdAt: new Date(),
      emailVerified: true, // In production, this would be false until email is verified
    }

    users.set(email.toLowerCase(), newUser)

    // Create session
    await createSession({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      subscriptionTier: newUser.subscriptionTier,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      errors: {
        email: ["An error occurred during registration. Please try again."],
      },
    }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/auth/login")
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = Array.from(users.values()).find((u) => u.id === session.userId)
  if (!user) return null

  // Remove sensitive data
  const { passwordHash, ...safeUser } = user
  return safeUser
}
