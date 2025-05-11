"use client";

import React from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";

// Forenklet TypeScript-type som nøyaktig matcher din Strapi-modell
export interface HistoryItem {
  id: number;
  attributes: {
    Title: string; // short text
    Text: string; // long text
    Image: {
      // media field (single image)
      data: Array<{
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
          formats?: {
            thumbnail?: { url: string };
            small?: { url: string };
            medium?: { url: string };
            large?: { url: string };
          };
        };
      }>;
    };
  };
}

// Helper-funksjoner for å håndtere Strapi-medier
export function getStrapiImageUrl(imageData: any): string {
  if (!imageData || !imageData.data || !imageData.data[0]) {
    return ""; // Returner tom streng hvis det ikke finnes bildedata
  }

  const imageAttributes = imageData.data[0].attributes;

  // Bruk medium format hvis tilgjengelig, ellers original
  if (imageAttributes.formats && imageAttributes.formats.medium) {
    return strapiService.media.getMediaUrl(imageAttributes.formats.medium);
  }

  return strapiService.media.getMediaUrl(imageAttributes);
}

export function getStrapiImageAlt(imageData: any): string {
  if (!imageData || !imageData.data || !imageData.data[0]) {
    return "";
  }

  return imageData.data[0].attributes.alternativeText || "";
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ historyItems }) => {
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Vår Historie
          </h2>

          {historyItems.map((item, index) => (
            <div key={item.id || index} className="mb-16">
              {/* Tittel for historieseksjon */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                {item.attributes.Title}
              </h3>

              {/* Tekst og bilder i en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Tekst-kolonne */}
                <div className="flex flex-col justify-center">
                  <div className="text-lg text-gray-700">
                    {item.attributes.Text.split("\n\n").map(
                      (paragraph, pIndex) => (
                        <p key={pIndex} className="mb-4">
                          {paragraph}
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* Bilde-kolonne */}
                {item.attributes.Image?.data &&
                  item.attributes.Image.data.length > 0 && (
                    <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={getStrapiImageUrl(item.attributes.Image)}
                        alt={getStrapiImageAlt(item.attributes.Image)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
