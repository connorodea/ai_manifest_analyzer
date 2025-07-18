import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bot } from "lucide-react"

export const metadata: Metadata = {
  title: "Register | AI Manifest Analyzer Pro",
  description: "Create your account",
}

export default async function RegisterPage() {
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
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
