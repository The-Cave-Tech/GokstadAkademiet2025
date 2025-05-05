// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserWithRole } from "@/lib/data/services/userAuth";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!authCookie;

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const authRoutes = ["/signin", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/dashboard/admin")) {
    if (!authCookie) return NextResponse.redirect(new URL("/signin", request.url));

    try {
      const userData = await getUserWithRole();
      const role = userData.role?.name || "Authenticated users";

      if (role !== "Admin/moderator/superadmin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};