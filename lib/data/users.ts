"use server"

import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  company: string
  role: string
  subscriptionTier: string
  subscriptionStatus: string
  createdAt: Date
  emailVerified: boolean
}

// Create a module-level Map to persist users across requests
const userDatabase = new Map<string, User>([
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = userDatabase.get(email.toLowerCase())
  console.log(`👤 getUserByEmail(${email}):`, user ? "Found" : "Not found")
  return user || null
}

export async function createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  const newUser: User = {
    ...userData,
    id: userId,
    createdAt: new Date(),
  }

  userDatabase.set(userData.email.toLowerCase(), newUser)
  console.log(`👤 createUser: Created user ${newUser.id} (${newUser.email})`)
  console.log(`👥 Total users in database: ${userDatabase.size}`)

  return newUser
}

export async function getAllUsers(): Promise<User[]> {
  return Array.from(userDatabase.values())
}

export async function getUserById(id: string): Promise<User | null> {
  const user = Array.from(userDatabase.values()).find((u) => u.id === id)
  console.log(`👤 getUserById(${id}):`, user ? "Found" : "Not found")
  return user || null
}

// Helper function to verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash)
  console.log(`🔐 Password verification:`, isValid ? "Valid" : "Invalid")
  return isValid
}

// Helper function to hash password
export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 12)
  console.log(`🔐 Password hashed successfully`)
  return hash
}
