"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  /* const maxAge = 7 * 60 * 60; */
  const maxAge = 7 * 60 * 60; // 6 minutes for testing
  
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname,
    sameSite: "strict",
    maxAge, 
    path: "/"
  });
  
  console.log("[Server] Auth - Set JWT cookie with 2 hours expiration");
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  const domain = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname;
  
  cookieStore.delete({
    name: "authToken",
    path: "/",
    domain,
  });
  
  cookieStore.delete({
    name: "koa.sess",
    path: "/",
    domain,
  });
  
  cookieStore.delete({
    name: "koa.sess.sig",
    path: "/",
    domain,
  });
  
  // HMR cookies might be causing issues, though they should be dev-only
  cookieStore.delete({
    name: "__next_hmr_refresh_hash__",
    path: "/",
    domain,
  });
  
  console.log("[Server] Auth - JWT cookie and session cookies removed");
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
}