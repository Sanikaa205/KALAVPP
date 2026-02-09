import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const token = session?.user as { role?: string; id?: string } | undefined;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isVendorRoute = pathname.startsWith("/vendor") && pathname !== "/vendor/register";
  const isAccountRoute = pathname.startsWith("/account");
  const isProtectedRoute = isAdminRoute || isVendorRoute || isAccountRoute;

  // Auth pages (login/register) - redirect if already logged in
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/vendor/register";

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isVendorRoute && token?.role !== "VENDOR") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
