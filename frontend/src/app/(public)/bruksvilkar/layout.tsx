import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bruksvilkår",
  description: "Bruksvilkår for The Cave Tech - les om regler og betingelser for bruk av vår nettside og tjenester.",
  keywords: "bruksvilkår, betingelser, avtalevilkår, The Cave Tech, regler",
  alternates: {
    canonical: "/bruksvilkar",
  },
  openGraph: {
    title: "Bruksvilkår | The Cave Tech",
    description: "Les om regler og betingelser for bruk av The Cave Techs nettside og tjenester.",
    url: "/bruksvilkar",
    type: "website",
  },
};

export default function BruksvilkarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}