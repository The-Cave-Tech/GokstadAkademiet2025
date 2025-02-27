import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Account, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" { //skal senere flyttes til types
  interface Session {
    jwt?: string; 
    id?: string;  
  }
}

interface ExtendedJWT extends JWT {
  jwt?: string;
  id?: string;
}



export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session; // Bruk den innebygde Session-typen
      token: ExtendedJWT;
    }): Promise<Session> {
      // Legg til jwt og id i session-objektet
      if (token) {
        session.jwt = token.jwt;
        session.id = token.id;
      }
      return session; // Returner hele session-objektet, som inkluderer obligatoriske felter som expires
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: ExtendedJWT;
      user?: User;
      account?: Account | null;
    }): Promise<ExtendedJWT> {
      if (account && user) {
        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`;
          console.log("Fetching from:", url); // Debugging
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Fetch failed with status: ${response.status}`);
          }
          const data: { jwt: string; user: { id: string } } = await response.json();
          token.jwt = data.jwt;
          token.id = data.user.id;
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },
  },
};

// Eksplisitt bruk av NextAuth i eksportene
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);