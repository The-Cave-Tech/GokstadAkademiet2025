"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { strapiService } from "@/lib/data/services/strapiClient";
import { SiteLogo } from "./SiteLogo";

type OpeningHourItem = {
  id: string;
  attributes?: {
    Mandag?: string;
    Tirsdag?: string;
    Onsdag?: string;
    Torsdag?: string;
    Fredag?: string;
  };

  Mandag?: string;
  Tirsdag?: string;
  Onsdag?: string;
  Torsdag?: string;
  Fredag?: string;
};

export default function Footer() {
  const [footerText, setFooterText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        console.log("Attempting to fetch footer data from Strapi");

        const data = await strapiService.fetch<any>(
          "footer?populate[openingHours][populate]=*"
        );

        console.log("Footer API response:", JSON.stringify(data, null, 2));

        if (data?.data) {
          console.log("Data object exists:", data.data);

          if (typeof data.data === "object") {
            console.log("Data keys:", Object.keys(data.data));

            if (data.data.attributes) {
              console.log("Footer attributes found:", data.data.attributes);
              setFooterText(data.data.attributes.footerText || "");
              setBackgroundColor(
                data.data.attributes.footerBackgroundColor || ""
              );

              if (data.data.attributes.openingHours) {
                console.log(
                  "Opening hours object:",
                  data.data.attributes.openingHours
                );

                if (Array.isArray(data.data.attributes.openingHours)) {
                  setOpeningHours(
                    data.data.attributes.openingHours.map(
                      (item: { id: any }) => ({
                        id: item.id || String(Math.random()),
                        attributes: item,
                      })
                    )
                  );
                } else if (data.data.attributes.openingHours.data) {
                  console.log(
                    "Opening hours data:",
                    data.data.attributes.openingHours.data
                  );
                  setOpeningHours(data.data.attributes.openingHours.data);
                } else {
                  console.log("Unrecognized opening hours format");
                  setOpeningHours([]);
                }
              } else {
                console.log("No opening hours found in attributes");
                setOpeningHours([]);
              }
            } else {
              console.log("No attributes in data object");

              if (
                data.data.openingHours &&
                Array.isArray(data.data.openingHours)
              ) {
                console.log("Found openingHours directly in data object");
                setOpeningHours(data.data.openingHours);
              } else {
                setOpeningHours([]);
              }
            }
          } else {
            console.log("Data is not an object:", typeof data.data);
            setOpeningHours([]);
          }
        } else {
          console.log("No data object in API response");
          setOpeningHours([]);
        }
      } catch (error) {
        console.error("Kunne ikke hente footer-data:", error);
      } finally {
        setCurrentYear(new Date().getFullYear());
        setIsLoaded(true);
      }
    };

    fetchFooterData();
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <footer
      className="text-white pt-12 pb-8 px-6"
      style={{ backgroundColor: backgroundColor || "#0f172a" }}
      role="contentinfo"
      suppressHydrationWarning
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
          <ul className="space-y-1 text-sm text-gray-300">
            {openingHours && openingHours.length > 0 ? (
              openingHours.map((item, index) => {
                console.log("Rendering opening hour item:", item);
                const mandag = item.attributes?.Mandag || item.Mandag;
                const tirsdag = item.attributes?.Tirsdag || item.Tirsdag;
                const onsdag = item.attributes?.Onsdag || item.Onsdag;
                const torsdag = item.attributes?.Torsdag || item.Torsdag;
                const fredag = item.attributes?.Fredag || item.Fredag;

                return (
                  <React.Fragment key={item.id || `opening-hour-${index}`}>
                    {mandag && (
                      <li className="flex">
                        <span className="w-16">Mandag</span>
                        <span>{mandag}</span>
                      </li>
                    )}
                    {tirsdag && (
                      <li className="flex">
                        <span className="w-16">Tirsdag</span>
                        <span>{tirsdag}</span>
                      </li>
                    )}
                    {onsdag && (
                      <li className="flex">
                        <span className="w-16">Onsdag</span>
                        <span>{onsdag}</span>
                      </li>
                    )}
                    {torsdag && (
                      <li className="flex">
                        <span className="w-16">Torsdag</span>
                        <span>{torsdag}</span>
                      </li>
                    )}
                    {fredag && (
                      <li className="flex">
                        <span className="w-16">Fredag</span>
                        <span>{fredag}</span>
                      </li>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <li>Ingen åpningstider tilgjengelig</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        {currentYear !== null && (
          <>
            &copy; {currentYear}{" "}
            {footerText || "© TheCaveTech. All rights reserved."}
          </>
        )}
      </div>
    </footer>
  );
}
