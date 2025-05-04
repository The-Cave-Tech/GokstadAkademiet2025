"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";
import { SiteLogo } from "./SiteLogo";

type SocialLink = {
  id: number;
  name: string;
  url: string;
};

type OpeningHours = {
  day: string;
  hours: string;
};

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [footerText, setFooterText] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#0f172a");

  // MOCK åpningstider (skal komme fra Strapi senere)
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([
    { day: "Mandag - Fredag", hours: "08:00 - 16:00" },
    { day: "Lørdag", hours: "10:00 - 14:00" },
    { day: "Søndag", hours: "Stengt" },
  ]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const { data } = await fetchStrapiData(
          "/api/global-setting?populate=*"
        );
        const attributes = data?.attributes;

        if (attributes) {
          setSocialLinks(attributes.SocialLinks || []);
          setFooterText(
            attributes.footerText || "© TheCaveTech. All rights reserved."
          );
          setBackgroundColor(attributes.footerBackgroundColor || "#0f172a");

          // Når Strapi er klart:
          // setOpeningHours(attributes.openingHours || []);
        }
      } catch (error) {
        console.error("Kunne ikke hente footer-data:", error);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer
      className="text-white pt-12 pb-8 px-6"
      style={{ backgroundColor }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
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

        {/* Sosiale medier */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Følg oss</h3>
          <ul className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={`Gå til ${link.name}`}
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
              <li key={index} className="flex justify-between">
                <span>{item.day}</span>
                <span>{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bunntekst */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} {footerText}
      </div>
    </footer>
  );
}
