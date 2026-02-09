import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  const isSecure = request.url.startsWith("https://");

  // NextAuth v5 uses "authjs" prefix instead of "next-auth"
  const cookieName = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret,
    cookieName,
  });
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
