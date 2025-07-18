"use server"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  role: string
  subscriptionTier: string
  expiresAt: Date
}

export async function createSession(payload: SessionPayload) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })

    return payload as SessionPayload
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function verifySession(): Promise<SessionPayload> {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return session
}
