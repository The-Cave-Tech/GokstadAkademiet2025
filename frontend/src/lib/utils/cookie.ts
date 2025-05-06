"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = 2 * 60 * 60; // 2 hours
  
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
  cookieStore.delete({
    name: "authToken",
    path: "/",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname,
  });
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
}