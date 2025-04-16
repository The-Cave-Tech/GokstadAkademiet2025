"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";
import ClientMessage from "@/components/ClientMessage";

interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string | null;
  };
  introduction: {
    title: string;
    text: string;
    imageUrl: string | null;
  };
}

export default function LandingPageContent() {
  const [content, setContent] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getLandingPageData() {
      try {
        const response = await fetchStrapiData("/api/landing-page?populate=*");
           
        if (!response.data) {
          throw new Error("Ingen 'data' funnet i Strapi-respons");
        }

        const heroComponent = response.data.Hero;
        const heroImage = response.data.HeroImage;
        const introImage = response.data.IntroductionImage;

        const getImageUrl = (img: any) => {
          if (!img?.url) return null;
          const baseUrl = img.url.startsWith("http")
            ? img.url
            : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${img.url}`;
          return `${baseUrl}?t=${Date.now()}`; 
        };

        const hero = {
          title: heroComponent?.Title || "Mangler tittel",
          subtitle: heroComponent?.Subtitle || "Mangler undertittel",
          imageUrl: getImageUrl(heroImage),
        };

        const introduction = {
          title: response.data.introductionTitle || "Mangler tittel",
          text: response.data.introductionText || "Mangler tekst",
          imageUrl: getImageUrl(introImage),
        };

        setContent({ hero, introduction });
      } catch (err) {
        setError(
          "Klarte ikke å hente landingsside-innhold: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
      } finally {
        setLoading(false);
      }
    }

    getLandingPageData();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Laster innhold...</p>;
  }

  if (error || !content) {
    return (
      <div className="text-center text-red-500 py-10">
        {error || "Kunne ikke laste innhold"}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-center bg-gray-900 text-white">
        <ClientMessage />
        <div className="relative aspect-[1404/547] w-full">
          {content.hero.imageUrl ? (
            <Image
              src={content.hero.imageUrl}
              alt="Hero Image"
              fill
              className="object-cover opacity-50"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
              {content.hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
        <div className="relative w-full aspect-[595/418] rounded-xl overflow-hidden shadow-lg">
          {content.introduction.imageUrl ? (
            <Image
              src={content.introduction.imageUrl}
              alt="Introduction Image"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Bilde mangler</p>
            </div>
          )}
        </div>

        
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {content.introduction.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {content.introduction.text}
          </p>
        </div>
      </section>
    </>
  );
}
