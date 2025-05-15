//Frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "@/styles/global.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/lib/context/AuthContext";
import React from "react";
import { ActivitiesProvider } from "@/lib/context/ActivityContext";
import Footer from "@/components/layout/Footer";
import { SessionHandler } from "@/components/features/auth/SessionHandler";
import { CartProvider } from "@/lib/context/shopContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cave Tech",
  description:
    "Hjelper enkeltpersoner å få erfaring gjennom virkelige prosjekter og åpne kildekodeløsninger.",
  keywords:
    "The Cave Tech, makerspace, tekk erfaring, åpen kildekode, nettverk",
  openGraph: {
    title: "The Cave Tech",
    description:
      "En ideell organisasjon som hjelper enkeltpersoner med å få erfaring gjennom virkelige tech-prosjekter.",
    url: "https://www.thecavetech.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <AuthProvider>
          <ActivitiesProvider>
            <CartProvider>
              <SessionHandler />
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </ActivitiesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
