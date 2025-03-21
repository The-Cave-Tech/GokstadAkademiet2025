import { cookies } from "next/headers";

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  

  const maxAge = 2 * 60 * 60;
  
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    domain: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname,
    sameSite: "strict",
    maxAge: maxAge,
    path: "/"
  });
  
  console.log("[Server] Auth - Set JWT cookie with standard expiration");
}