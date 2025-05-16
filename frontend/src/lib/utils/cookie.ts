"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = 7 * 60 * 60; 

  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
      .hostname,
    sameSite: "strict",
    maxAge,
    path: "/",
  });

}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  const domain = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
    .hostname;

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
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("authToken");

  if (!cookie?.value) {
    return null;
  }

  return cookie.value;
}
