"use client";

import React, { useEffect, useState } from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import HistorySection, { HistoryItem } from "./HistorySection";

interface StrapiResponse {
  data: {
    id: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    documentId: string;
    history: HistoryItem[]; 
  };
  meta: any;
}

export default function HistoryContainer() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoryData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await strapiService.fetch<StrapiResponse>("about-us", {
          params: {
            populate: "history.Image",
          },
        });

        console.log("Strapi full respons:", response);
        if (
          response?.data?.history &&
          Array.isArray(response.data.history) &&
          response.data.history.length > 0
        ) {
          setHistoryItems(response.data.history);
          console.log("Historie-data som ble satt:", response.data.history);
        } else {
          console.error(
            "Ingen historie-elementer funnet i responsen:",
            response
          );
          setError(
            "Ingen historiedata funnet i 'About Us'. Sjekk data-strukturen i Strapi."
          );
          setHistoryItems([]);
          console.log(historyItems);
        }
      } catch (error) {
        console.error("Feil ved henting av historiedata:", error);
        setError(
          "Kunne ikke hente historiedata fra Strapi. Sjekk at API-et er tilgjengelig."
        );
        setHistoryItems([]);
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

  if (error || historyItems.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-auto max-w-4xl mb-4">
          <p className="text-yellow-700">
            {error || "Ingen historiedata tilgjengelig."}
          </p>
          <p className="text-yellow-700 mt-2">
            For å legge til historieinnhold, gå til Strapi admin-panelet, åpne
            'About Us' single type, og legg til innhold i history-komponenten
            med bilder.
          </p>
        </div>
      </div>
    );
  }

  return <HistorySection historyItems={historyItems} />;
}
