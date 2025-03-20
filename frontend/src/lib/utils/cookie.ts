import { cookies } from "next/headers";

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  
  
  const maxAge = 2 * 60 * 60;
  
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAge,
    path: "/"
  });
  
  console.log("[Server] Auth - Set JWT cookie with standard expiration");
}