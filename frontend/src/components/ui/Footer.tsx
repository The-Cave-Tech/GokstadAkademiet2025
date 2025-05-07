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

export default function Footer() {
  const [footerText, setFooterText] = useState(
    "© TheCaveTech. All rights reserved."
  );
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await strapiService.fetch<any>(
          "footer?populate[openingHours]=*"
        );
        const attributes = data?.data?.attributes;

        if (attributes) {
          setFooterText(
            attributes.footerText ?? "© TheCaveTech. All rights reserved."
          );
          setBackgroundColor(attributes.footerBackgroundColor ?? "#0f172a");

          // Add console.log to see the full structure
          console.log("Full footer data:", data);
          console.log("Opening hours data:", attributes.openingHours);

          // Check if openingHours is a nested relation
          if (attributes.openingHours && attributes.openingHours.data) {
            // If it's a relation, it might have a different structure
            const hoursData = attributes.openingHours.data.map(
              (item: { attributes: any; }) => item.attributes
            );
            setOpeningHours(hoursData);
          } else {
            // If it's a component or direct field
            setOpeningHours(attributes.openingHours ?? []);
          }
        }
      } catch (error) {
        console.error("Kunne ikke hente footer-data:", error);
        // Log the full error
        console.error("Detailed error:", JSON.stringify(error));
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
        </div>
      </div>

      {/* Bunntekst */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        &copy; {year} {footerText}
      </div>
    </footer>
  );
}
