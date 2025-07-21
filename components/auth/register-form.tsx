"use client"

import { useActionState } from "react"
import { register } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log("🔄 Register form state changed:", state)

    if (state?.success) {
      console.log("✅ Registration successful, redirecting to dashboard...")
      // Force a hard redirect to ensure session is properly recognized
      window.location.href = "/dashboard"
    }
  }, [state])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Get started with AI-powered manifest analysis</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                className={state?.errors?.firstName ? "border-destructive" : ""}
                autoComplete="given-name"
              />
              {state?.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                className={state?.errors?.lastName ? "border-destructive" : ""}
                autoComplete="family-name"
              />
              {state?.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className={state?.errors?.email ? "border-destructive" : ""}
              autoComplete="email"
            />
            {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              name="company"
              placeholder="Your Company"
              className={state?.errors?.company ? "border-destructive" : ""}
              autoComplete="organization"
            />
            {state?.errors?.company && <p className="text-sm text-destructive">{state.errors.company[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                required
                className={state?.errors?.password ? "border-destructive pr-10" : "pr-10"}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            <div className="text-xs text-muted-foreground">
              Password must contain at least 8 characters with uppercase, lowercase, number, and special character.
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
