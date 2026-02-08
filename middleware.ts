import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "kalavpp-secret-key-change-in-production",
  });
  const { pathname } = request.nextUrl;

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isVendorRoute = pathname.startsWith("/vendor") && pathname !== "/vendor/register";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isProtectedRoute = isAdminRoute || isVendorRoute || isDashboardRoute;

  // Auth pages (login/register) - redirect if already logged in
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/vendor/register";

  if (isAuthPage && token) {
    const role = token.role as string | undefined;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "VENDOR") return NextResponse.redirect(new URL("/vendor", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
