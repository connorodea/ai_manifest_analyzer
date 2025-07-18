import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bot } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | AI Manifest Analyzer Pro",
  description: "Sign in to your account",
}

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AI Manifest Analyzer Pro</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
