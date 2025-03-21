"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = 2 * 60 * 60;
  
  await cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname,
    sameSite: "strict",
    maxAge: maxAge,
    path: "/"
  });
  
  console.log("[Server] Auth - Set JWT cookie with standard expiration");
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get("authToken");

  if (!cookie?.value) {
    console.log("[Server] Auth - No JWT cookie found");   
    return null; 
  }

  console.log("[Server] Auth - JWT cookie accessed");
  return cookie.value;
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  await cookieStore.delete("authToken");
  console.log("[Server] Auth - JWT cookie removed");
}