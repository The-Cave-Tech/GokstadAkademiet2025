"use client";

import React, { useEffect, useState } from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import HistorySection, { HistoryItem } from "./HistorySection";

// Type for Strapi-responsen
interface StrapiResponse {
  data?: {
    id: number;
    attributes?: {
      history?: {
        data?: HistoryItem[];
      };
    };
  };
  meta?: any;
}

// Enkel mockdata som matcher den forenklede Strapi-modellen
const mockHistoryItems: HistoryItem[] = [
  {
    id: 1,
    attributes: {
      Title: "Vår begynnelse",
      Text: "Vår reise begynte i 2010 da en liten gruppe entusiaster bestemte seg for å gjøre en forskjell. Med en felles visjon om å skape noe betydningsfullt, samlet vi våre ressurser og startet dette eventyret.\n\nFra et lite kontor med bare fire ansatte har vi vokst til et internasjonalt selskap med kontorer i flere land. Denne veksten er et resultat av vår lidenskap for innovasjon og vårt uopphørlige engasjement for å møte kundenes behov.",
      Image: {
        data: [
          {
            id: 1,
            attributes: {
              url: "/images/company-history.jpg",
              alternativeText: "Bildet av vår første kontorbygning",
              formats: {
                thumbnail: { url: "/images/company-history.jpg" },
                small: { url: "/images/company-history.jpg" },
                medium: { url: "/images/company-history.jpg" },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    attributes: {
      Title: "Viktige milepæler",
      Text: "2010: Selskapet ble grunnlagt med et fokus på innovasjon og kvalitet. De første produktene ble lansert mot slutten av året og mottok raskt positiv respons fra markedet.\n\n2015: Vi åpnet vårt andre kontor og utvidet teamet til over 50 ansatte. Dette markerte begynnelsen på vår nasjonale ekspansjon og introduksjonen av flere produktlinjer.\n\n2020: Vi etablerte vår første internasjonale avdeling og lanserte våre tjenester globalt. Dette året markerte også lanseringen av vår banebrytende nye teknologi som revolusjonerte bransjen.\n\n2025: Med over 200 ansatte og kunder i 15 land, fortsetter vi å vokse og innovere. Vår siste produktlinje har satt nye standarder i bransjen, og vi ser frem til en fremtid full av nye muligheter.",
      Image: {
        data: [
          {
            id: 2,
            attributes: {
              url: "/images/milestones.jpg",
              alternativeText: "Bilde av selskapets milepæler",
              formats: {
                thumbnail: { url: "/images/milestones.jpg" },
                small: { url: "/images/milestones.jpg" },
                medium: { url: "/images/milestones.jpg" },
              },
            },
          },
        ],
      },
    },
  },
];

export default function HistoryContainer() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Under utvikling kan du sette denne til true for å alltid bruke mockdata
    const USE_MOCK_DATA = false;

    async function fetchHistoryData() {
      setIsLoading(true);

      if (USE_MOCK_DATA) {
        setHistoryItems(mockHistoryItems);
        setIsLoading(false);
        return;
      }

      try {
        // Hent data fra Strapi API - "about-us" single type med history-relasjonen
        const response = await strapiService.fetch<StrapiResponse>("about-us", {
          params: {
            // Deep populate for å få med alle nøstede relasjoner inkludert bilder
            populate: "deep",
          },
        });

        console.log("Strapi-respons:", response); // For debugging - kan fjernes senere

        // Sikker kode for å hente ut historie-elementer ved å sjekke hvert nøstede nivå
        const data = response?.data?.attributes?.history?.data || [];

        if (Array.isArray(data) && data.length > 0) {
          setHistoryItems(data);
        } else {
          // Hvis ingen data ble funnet, bruk mockdata
          console.log("Ingen historiedata funnet i Strapi, bruker mockdata");
          setHistoryItems(mockHistoryItems);
          setError("Ingen historiedata funnet i Strapi. Viser demo-innhold.");
        }
      } catch (error) {
        // Ved feil, bruk mockdata
        console.error("Feil ved henting av historiedata:", error);
        setHistoryItems(mockHistoryItems);
        setError("Kunne ikke hente data fra Strapi. Viser demo-innhold.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-gray-600">Laster historieinnhold...</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-auto max-w-4xl mb-4">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}
      <HistorySection historyItems={historyItems} />
    </>
  );
}
