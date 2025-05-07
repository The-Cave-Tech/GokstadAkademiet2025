// src/app/api/auth/callback/[provider]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/utils/cookie";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;
    
    if (!['google', 'facebook'].includes(provider)) {
      console.error(`Invalid provider: ${provider}`);
      return NextResponse.redirect(new URL('/signin?error=InvalidProvider', request.url));
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code") || searchParams.get("access_token");
    
    if (!code) {
      console.error("No auth code received in callback");
      return NextResponse.redirect(new URL('/signin?error=NoAuthCode', request.url));
    }
    
    console.log(`Processing ${provider} OAuth callback`);

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api$/, "") || "http://localhost:1337";
    
    const param = code.startsWith('access_') ? 'access_token' : 'code';
    
    const response = await fetch(`${strapiUrl}/api/auth/${provider}/callback?${param}=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`OAuth callback error: ${response.status}`);
      return NextResponse.redirect(new URL('/signin?error=AuthFailed', request.url));
    }
    
    const data = await response.json();
    
    if (!data || !data.jwt) {
      console.error('No JWT received from Strapi');
      return NextResponse.redirect(new URL('/signin?error=NoToken', request.url));
    }
    
    await setAuthCookie(data.jwt);
   
    return NextResponse.redirect(new URL('/', request.url));
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL('/signin?error=ServerError', request.url));
  }
}