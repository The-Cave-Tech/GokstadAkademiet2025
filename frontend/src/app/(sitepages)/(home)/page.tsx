import LandingPageHero from "@/components/home/landingPageHero";
import ClientMessage from "@/components/home/ClientMessage";

export default function HomePage() {
  return (
    <main className="mt-24">
      <ClientMessage />
      <LandingPageHero />
      <p className="text-center mt-10">This is THE-CAVETECH-</p>
    </main>
  );
}
