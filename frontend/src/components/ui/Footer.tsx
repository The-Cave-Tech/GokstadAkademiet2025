"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { strapiService } from "@/lib/data/services/strapiClient";
import { SiteLogo } from "./SiteLogo";

type OpeningHourItem = {
  id: number;
  Mandag?: string;
  Tirsdag?: string;
  Onsdag?: string;
  Torsdag?: string;
  Fredag?: string;
};

// Define a more comprehensive type for Strapi response
interface FooterResponse {
  data: {
    id: number;
    attributes: {
      footerText?: string;
      footerBackgroundColor?: string;
      openingHours:
        | {
            data: Array<{
              id: number;
              attributes: OpeningHourItem;
            }> | null;
          }
        | Array<OpeningHourItem>
        | null;
      // For direct component usage
    };
  };
}

export default function Footer() {
  const [footerText, setFooterText] = useState(
    "© TheCaveTech. All rights reserved."
  );
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true);

        // Use the specific type for better TypeScript support
        const response = await strapiService.fetch<FooterResponse>(
          "footer?populate[openingHours][populate]=*"
        );

        console.log("Full footer response:", response);

        const attributes = response?.data?.attributes;

        if (attributes) {
          // Set basic footer properties
          setFooterText(
            attributes.footerText ?? "© TheCaveTech. All rights reserved."
          );
          setBackgroundColor(attributes.footerBackgroundColor ?? "#0f172a");

          // Enhanced logging for debugging
          console.log("Opening hours raw data:", attributes.openingHours);

          // Handle the opening hours data with more robust checks
          if (!attributes.openingHours) {
            console.warn("No opening hours data found");
            setOpeningHours([]);
          }
          // Case 1: Array of components directly in openingHours
          else if (Array.isArray(attributes.openingHours)) {
            console.log("Direct array of components found");
            setOpeningHours(attributes.openingHours);
          }
          // Case 2: Relation with data property containing array
          else if (
            attributes.openingHours.data &&
            Array.isArray(attributes.openingHours.data)
          ) {
            console.log(
              "Relation data array found with length:",
              attributes.openingHours.data.length
            );
            const hoursData = attributes.openingHours.data.map((item) => {
              console.log("Processing item:", item);
              return item.attributes;
            });
            setOpeningHours(hoursData);
          }
          // Fallback case
          else {
            console.warn(
              "Unexpected opening hours structure:",
              attributes.openingHours
            );
            setOpeningHours([]);
          }
        }
      } catch (error) {
        console.error("Could not fetch footer data:", error);
        setError("Failed to load opening hours. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      className="text-white pt-12 pb-8 px-6"
      style={{ backgroundColor }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & beskrivelse */}
        <div>
          <SiteLogo className="w-40 mb-4" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Innovative teknologiløsninger for fremtiden.
          </p>
        </div>

        {/* Navigasjonslenker */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigasjon</h3>
          <ul className="space-y-2">
            {[
              { name: "Nettbutikk", href: "/shop" },
              { name: "Blogg", href: "/blog" },
              { name: "Om oss", href: "/about-us" },
              { name: "Kontakt oss", href: "/contact-us" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Åpningstider */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Åpningstider</h3>
          {isLoading && (
            <p className="text-sm text-gray-300">Laster åpningstider...</p>
          )}

          {error && <p className="text-sm text-red-300">{error}</p>}

          {!isLoading && !error && (
            <>
              {openingHours.length === 0 ? (
                <p className="text-sm text-gray-300">
                  Ingen åpningstider tilgjengelig
                </p>
              ) : (
                <ul className="space-y-1 text-sm text-gray-300">
                  {openingHours.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                      {item.Mandag && (
                        <li className="flex justify-between">
                          <span>Mandag</span>
                          <span>{item.Mandag}</span>
                        </li>
                      )}
                      {item.Tirsdag && (
                        <li className="flex justify-between">
                          <span>Tirsdag</span>
                          <span>{item.Tirsdag}</span>
                        </li>
                      )}
                      {item.Onsdag && (
                        <li className="flex justify-between">
                          <span>Onsdag</span>
                          <span>{item.Onsdag}</span>
                        </li>
                      )}
                      {item.Torsdag && (
                        <li className="flex justify-between">
                          <span>Torsdag</span>
                          <span>{item.Torsdag}</span>
                        </li>
                      )}
                      {item.Fredag && (
                        <li className="flex justify-between">
                          <span>Fredag</span>
                          <span>{item.Fredag}</span>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bunntekst */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        &copy; {year} {footerText}
      </div>
    </footer>
  );
}
