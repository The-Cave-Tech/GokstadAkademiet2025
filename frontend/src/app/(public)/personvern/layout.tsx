import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvern",
  description: "The Cave Techs personvernerklæring beskriver vår innsamling, bruk og beskyttelse av dine personopplysninger når du bruker våre tjenester.",
  keywords: "personvern, personvernerklæring, GDPR, cookies, The Cave Tech, databeskyttelse, personopplysninger",
  alternates: {
    canonical: "/personvern",
  },
  openGraph: {
    title: "Personvernerklæring | The Cave Tech",
    description: "Les om hvordan The Cave Tech samler, bruker og beskytter dine personopplysninger når du bruker våre tjenester.",
    url: "/personvern",
    type: "website",
  },
};

export default function PersonvernLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}