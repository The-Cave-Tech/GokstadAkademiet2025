// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware triggered for:", pathname);

  const authCookie = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!authCookie;
  console.log("Authenticated:", isAuthenticated, "Token:", authCookie);

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const authRoutes = ["/signin", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtectedRoute && !isAuthenticated) {
    console.log("Not authenticated, redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    console.log("Authenticated, redirecting from auth route to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Beskytt admin-ruter
  if (pathname.startsWith("/dashboard/admin")) {
    if (!authCookie) return NextResponse.redirect(new URL("/signin", request.url));

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${baseUrl}/api/users/me?populate[role][fields][0]=name`, {
      headers: { Authorization: `Bearer ${authCookie}` },
    });

    if (!response.ok) {
      console.log("Failed to fetch user role, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const userData = await response.json();
    const role = userData.role?.name || "Authenticated users";

    if (role !== "Admin/moderator/superadmin") {
      console.log("Non-admin attempted to access admin route, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  console.log(`Proceeding to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};