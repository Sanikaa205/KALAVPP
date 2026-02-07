import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/vendor", "/admin"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For demo purposes, we check for a simple session cookie
  // In production, NextAuth middleware handles this via its own middleware
  const hasSession = request.cookies.get("next-auth.session-token") 
    || request.cookies.get("__Secure-next-auth.session-token");

  // Redirect authenticated users away from auth pages
  if (authPaths.some((p) => pathname.startsWith(p)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow all routes in demo mode (no real auth enforcement)
  // In production, uncomment below to protect routes:
  // if (protectedPaths.some((p) => pathname.startsWith(p)) && !hasSession) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vendor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
