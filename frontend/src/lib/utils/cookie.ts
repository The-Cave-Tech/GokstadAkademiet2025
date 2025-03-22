"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string, rememberMe: boolean = false): Promise<void> {
  const cookieStore = await cookies();
  const standardMaxAge = 2 * 60 * 60; //2 timer
  const extendedMaxAge = 7 * 24 * 60 * 60; //7 dager
  const maxAge = rememberMe ? extendedMaxAge : standardMaxAge;
  
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname,
    sameSite: "strict",
    maxAge: maxAge,
    path: "/"
  });
  
  console.log(`[Server] Auth - Set JWT cookie with ${rememberMe ? 'extended (7 days)' : 'standard (2 hours)'} expiration`);
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  console.log("[Server] Auth - JWT cookie removed");
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("authToken");

  if (!cookie?.value) {
    console.log("[Server] Auth - No JWT cookie found");   
    return null; 
  }

  console.log("[Server] Auth - JWT cookie accessed");
  return cookie.value;
} // 