import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/auth/login", "/auth/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession()

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route)) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
