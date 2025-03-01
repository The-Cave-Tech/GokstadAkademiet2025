import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

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
  description: "Hjelper enkeltpersoner å få erfaring gjennom virkelige prosjekter og åpne kildekodeløsninger.",
  keywords: "The Cave Tech, makerspace, tekk erfaring, åpen kildekode, nettverk",
  openGraph: {
    title: "The Cave Tech",
    description: "En ideell organisasjon som hjelper enkeltpersoner med å få erfaring gjennom virkelige tech-prosjekter.",
    url: "https://www.thecavetech.com",
    type: "website",
  },
}; // Må kansje endres til den info TheCaveTech ønsker?



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}