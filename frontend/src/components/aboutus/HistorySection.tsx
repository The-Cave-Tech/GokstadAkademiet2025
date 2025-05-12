"use client";

import React from "react";
import Image from "next/image";

// Forenklet TypeScript-type som nøyaktig matcher din Strapi-modell
export interface HistoryItem {
  id: number;
  Title: string; // short text
  Text: string; // long text
  Image: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
}

// Helper-funksjoner for å håndtere Strapi-medier
export function getStrapiImageUrl(imageArray: any): string {
  // Sjekk om det er et array
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    const image = imageArray[0];

    // Lag full URL
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    const strapiBaseUrl = baseUrl.replace(/\/api$/, "");

    // Bruk medium format hvis tilgjengelig, ellers original URL
    let imageUrl = "";
    if (image.formats && image.formats.medium) {
      imageUrl = image.formats.medium.url;
    } else {
      imageUrl = image.url;
    }

    // Sikre at URL-en har komplett domene
    if (imageUrl.startsWith("/")) {
      imageUrl = `${strapiBaseUrl}${imageUrl}`;
    }

    return imageUrl;
  }

  return "/images/placeholder.jpg"; // Fallback
}

export function getStrapiImageAlt(imageArray: any): string {
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    return imageArray[0].alternativeText || "";
  }
  return "";
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ historyItems }) => {
  console.log("HistoryItems mottatt i HistorySection:", historyItems);

  if (!historyItems || historyItems.length === 0) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p>Ingen historiedata tilgjengelig.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {historyItems.map((item, index) => {
            console.log(`Historie #${index + 1}:`, item);
            console.log(`Bilde for historie #${index + 1}:`, item.Image);

            return (
              <div key={item.id || index} className="mb-16">
                {/* Tittel for historieseksjon */}
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {item.Title}
                </h2>

                {/* Tekst først i full bredde */}
                <div className="mb-8">
                  <div className="text-lg text-gray-700">
                    {item.Text.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Bilde under teksten med auto høyde */}
                {item.Image && item.Image.length > 0 && (
                  <div className="w-full rounded-lg overflow-hidden shadow-lg">
                    {/* Bruk vanlig img for å få auto høyde */}
                    <img
                      src={getStrapiImageUrl(item.Image)}
                      alt={getStrapiImageAlt(item.Image) || item.Title}
                      className="w-full h-auto"
                      onError={(e) => {
                        console.error("Bildefeil:", e);
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
