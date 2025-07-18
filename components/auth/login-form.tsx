"use client"

import { useActionState } from "react"
import { login } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state?.success, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.errors?.email && (
            <Alert variant="destructive">
              <AlertDescription>{state.errors.email[0]}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className={state?.errors?.email ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className={state?.errors?.password ? "border-destructive pr-10" : "pr-10"}
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
          </div>

          <div className="text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
      </form>

      <div className="px-6 pb-6">
        <div className="text-center text-sm text-muted-foreground">
          Demo credentials: user@example.com / password123
        </div>
      </div>
    </Card>
  )
}
