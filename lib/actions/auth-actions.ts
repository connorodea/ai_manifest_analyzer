"use server"

import { z } from "zod"
import { createSession, deleteSession, getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { getUserByEmail, createUser, getUserById, verifyPassword, hashPassword } from "@/lib/data/users"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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
  console.log("🚀 Login attempt started")

  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("📧 Login attempt for email:", email)
    console.log("🔑 Password provided:", password ? "Yes" : "No")

    const validatedFields = loginSchema.safeParse({
      email,
      password,
    })

    if (!validatedFields.success) {
      console.log("❌ Validation failed:", validatedFields.error.flatten().fieldErrors)
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email: validEmail, password: validPassword } = validatedFields.data
    const emailLower = validEmail.toLowerCase()

    console.log("🔍 Looking for user with email:", emailLower)
    const user = await getUserByEmail(emailLower)

    if (!user) {
      console.log("❌ User not found for email:", emailLower)
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      }
    }

    console.log("✅ User found:", { id: user.id, email: user.email })
    console.log("🔐 Checking password...")

    const isValidPassword = await verifyPassword(validPassword, user.passwordHash)

    if (!isValidPassword) {
      console.log("❌ Invalid password")
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      }
    }

    if (!user.emailVerified) {
      console.log("❌ Email not verified")
      return {
        errors: {
          email: ["Please verify your email address before logging in"],
        },
      }
    }

    console.log("🎯 Creating session for user:", user.id)

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    console.log("✅ Login successful!")
    return { success: true }
  } catch (error) {
    console.error("❌ Login error:", error)
    return {
      errors: {
        email: ["An error occurred during login. Please try again."],
      },
    }
  }
}

export async function register(prevState: any, formData: FormData) {
  console.log("🚀 Registration attempt started")

  try {
    const validatedFields = registerSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      company: formData.get("company"),
    })

    if (!validatedFields.success) {
      console.log("❌ Registration validation failed:", validatedFields.error.flatten().fieldErrors)
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password, firstName, lastName, company } = validatedFields.data
    const emailLower = email.toLowerCase()

    console.log("📧 Registration attempt for email:", emailLower)

    // Check if user already exists
    const existingUser = await getUserByEmail(emailLower)
    if (existingUser) {
      console.log("❌ User already exists:", emailLower)
      return {
        errors: {
          email: ["An account with this email already exists"],
        },
      }
    }

    console.log("🔐 Hashing password...")
    const passwordHash = await hashPassword(password)

    // Create user
    const newUser = await createUser({
      email: emailLower,
      passwordHash,
      firstName,
      lastName,
      company: company || "",
      role: "user",
      subscriptionTier: "starter",
      subscriptionStatus: "active",
      emailVerified: true, // In production, this would be false until email is verified
    })

    console.log("👤 User created successfully:", { id: newUser.id, email: newUser.email })

    // Create session
    await createSession({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      subscriptionTier: newUser.subscriptionTier,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    console.log("✅ Registration successful for:", emailLower)
    return { success: true }
  } catch (error) {
    console.error("❌ Registration error:", error)
    return {
      errors: {
        email: ["An error occurred during registration. Please try again."],
      },
    }
  }
}

export async function logout() {
  console.log("🚪 Logging out user")
  await deleteSession()
  redirect("/auth/login")
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session) {
      console.log("👤 No session found for getCurrentUser")
      return null
    }

    console.log("👤 Getting current user for session:", session.userId)
    const user = await getUserById(session.userId)

    if (!user) {
      console.log("❌ User not found for session:", session.userId)
      return null
    }

    console.log("✅ Current user found:", { id: user.id, email: user.email })
    // Remove sensitive data
    const { passwordHash, ...safeUser } = user
    return safeUser
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    return null
  }
}
