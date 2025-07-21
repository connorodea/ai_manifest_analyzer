"use server"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-in-production-12345"
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  role: string
  subscriptionTier: string
  expiresAt: Date
}

export async function createSession(payload: SessionPayload) {
  try {
    console.log("🔐 Creating session for user:", payload.userId, payload.email)

    const session = await new SignJWT({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      subscriptionTier: payload.subscriptionTier,
      expiresAt: payload.expiresAt.toISOString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey)

    console.log("🔐 JWT token created, setting cookie...")

    const cookieStore = await cookies()
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    })

    console.log("🔐 Session cookie set successfully")

    // Verify the cookie was set
    const testCookie = cookieStore.get("session")
    console.log("🔐 Cookie verification:", testCookie ? "Cookie exists" : "Cookie not found")
  } catch (error) {
    console.error("❌ Error creating session:", error)
    throw error
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    console.log("🔍 Getting session, cookie exists:", !!sessionCookie?.value)

    if (!sessionCookie?.value) {
      console.log("🔍 No session cookie found")
      return null
    }

    console.log("🔍 Verifying JWT token...")
    const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
      algorithms: ["HS256"],
    })

    console.log("🔍 Session verified for user:", payload.userId)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      subscriptionTier: payload.subscriptionTier as string,
      expiresAt: new Date(payload.expiresAt as string),
    }
  } catch (error) {
    console.error("❌ Failed to verify session:", error)
    // Clear invalid session
    try {
      const cookieStore = await cookies()
      cookieStore.delete("session")
    } catch (e) {
      console.error("Failed to delete invalid session:", e)
    }
    return null
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    console.log("🔐 Session deleted")
  } catch (error) {
    console.error("❌ Error deleting session:", error)
  }
}

export async function verifySession(): Promise<SessionPayload> {
  const session = await getSession()

  if (!session) {
    console.log("🔐 No valid session, redirecting to login")
    redirect("/auth/login")
  }

  return session
}
