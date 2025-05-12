// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserWithRole } from "@/lib/data/services/userAuth";
import { isTokenExpired } from "@/lib/utils/jwt"; 

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("authToken")?.value;
  let isAuthenticated = !!authCookie;

  // Check if token is expired (only if we have a token)
  if (isAuthenticated && authCookie) {
    isAuthenticated = !isTokenExpired(authCookie);
  }

  // Legg til checkout i protected routes
  const protectedRoutes = ["/dashboard", "/nettbutikk/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const authRoutes = ["/signin", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    
    // Add a message if token was expired
    if (authCookie && isTokenExpired(authCookie)) {
      redirectUrl.searchParams.set("message", "Din økt har utløpt. Vennligst logg inn på nytt.");
      
      // Clear cookie by setting a new response with cleared auth cookie
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("authToken");
      response.cookies.delete("koa.sess");
      response.cookies.delete("koa.sess.sig");
      return response;
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth routes to dashboard or redirect URL
  if (isAuthRoute && isAuthenticated) {
    // Sjekk om det finnes en redirect parameter, ellers gå til dashboard
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/dashboard/admin")) {
    if (!authCookie || isTokenExpired(authCookie)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

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

// Oppdater matcher til å inkludere checkout endepunktene
export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup", "/nettbutikk/checkout/:path*"],
};