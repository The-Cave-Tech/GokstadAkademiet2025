// src/app/api/auth/callback/[provider]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/utils/cookie";

const SUPPORTED_PROVIDERS = ["google", "facebook"/* , "microsoft" */] as const;
type Provider = typeof SUPPORTED_PROVIDERS[number]; //er en union type

const PROVIDER_PARAM_MAP: Record<Provider, "code" | "access_token"> = {
  google: "access_token",    // Google kan bruke begge, men access_token er vanlig i Strapi
  facebook: "access_token",  // Facebook bruker access_token
  /* microsoft: "access_token", */
};

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;
    
    if (!SUPPORTED_PROVIDERS.includes(provider as Provider)) {
      console.error(`Invalid provider: ${provider}`);
      return NextResponse.redirect(new URL('/signin?error=InvalidProvider', request.url));
    }

    const searchParams = request.nextUrl.searchParams;
    const expectedParam = PROVIDER_PARAM_MAP[provider as Provider];
    let authValue = searchParams.get(expectedParam);
    
    // Fallback-logikk: Hvis forventet parameter ikke finnes, prøv den andre
    if (!authValue) {
      const alternativeParam = expectedParam === "code" ? "access_token" : "code";
      authValue = searchParams.get(alternativeParam);
      
      if (!authValue) {
        console.error(`No auth parameters found for ${provider} callback`);
        return NextResponse.redirect(new URL('/signin?error=NoAuthParams', request.url));
      }
      
      console.log(`Using alternative parameter ${alternativeParam} for ${provider}`);
    }
    
    console.log(`Processing ${provider} OAuth callback with ${expectedParam}`);

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api$/, "") || "http://localhost:1337";
    
    const paramToUse = authValue === searchParams.get("code") ? "code" : "access_token"; // enten forventet eller alternativ
    
    const callbackUrl = new URL(`${strapiUrl}/api/auth/${provider}/callback`);
    callbackUrl.searchParams.append(paramToUse, authValue);
    
    const response = await fetch(callbackUrl.toString(), {
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

    // Get redirect URL from the URL parameters
    const redirectUrl = searchParams.get('redirect') || '/';
   
    // Use redirectUrl in the redirect
    return NextResponse.redirect(new URL(redirectUrl, request.url));
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL('/signin?error=ServerError', request.url));
  }
}