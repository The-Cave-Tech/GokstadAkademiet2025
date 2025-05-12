"use client";

import React, { useEffect, useState, ReactElement } from "react";
import Link from "next/link";
import { strapiService } from "@/lib/data/services/strapiClient";
import { SiteLogo } from "./SiteLogo";
import { FaInstagram } from "react-icons/fa";

interface SocialMediaBase {
  id: string;
  url?: string;
  icon?: {
    data?: {
      attributes?: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      };
    };
  };
}

interface InstagramItem extends SocialMediaBase {
  type: "instagram";
}

type SocialMediaItem = InstagramItem;

interface OpeningHourItem {
  id: string;
  attributes?: {
    Mandag?: string;
    Tirsdag?: string;
    Onsdag?: string;
    Torsdag?: string;
    Fredag?: string;
    Lordag?: string;
    Sondag?: string;
  };
  Mandag?: string;
  Tirsdag?: string;
  Onsdag?: string;
  Torsdag?: string;
  Fredag?: string;
  Lordag?: string;
  Sondag?: string;
}

interface SocialMediaInfo {
  name: string;
  url: string;
  icon: ReactElement;
}

export default function Footer() {
  const [footerText, setFooterText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
  const [socialMediaItems, setSocialMediaItems] = useState<SocialMediaItem[]>(
    []
  );
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getSocialMediaInfo = (item: InstagramItem): SocialMediaInfo => {
    const safeUrl = typeof item.url === "string" ? item.url : "";

    if (item.type === "instagram") {
      return {
        name: "Instagram",
        url: safeUrl,
        icon: <FaInstagram size={24} className="mr-2" />,
      };
    }

    const url = safeUrl.toLowerCase();
    if (url.includes("instagram")) {
      return {
        name: "Instagram",
        url: safeUrl,
        icon: <FaInstagram size={24} className="mr-2" />,
      };
    }

    return {
      name: "Sosiale medier",
      url: safeUrl,
      icon: (
        <span className="w-6 h-6 flex items-center justify-center mr-2 bg-gray-700 rounded-full">
          {"S"}
        </span>
      ),
    };
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await strapiService.fetch<any>("footer?populate=*");

        if (data?.data) {
          setFooterText(data.data.footerText || "");
          setBackgroundColor(data.data.footerBackgroundColor || "");

          const hours =
            data.data.openingHours || data.data.attributes?.openingHours || [];
          setOpeningHours(Array.isArray(hours) ? hours : []);

          const socialItems: SocialMediaItem[] = [];

          const ig = data.data.instaGram || data.data.attributes?.instaGram;

          if (ig) {
            if (Array.isArray(ig)) {
              ig.forEach((item: any) =>
                socialItems.push({ ...item, type: "instagram" })
              );
            } else {
              socialItems.push({ ...ig, type: "instagram" });
            }
          }

          // Log socialMediaItems for debugging
          console.log("Social Media Items:", socialItems);
          setSocialMediaItems(socialItems);
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

  if (!isLoaded) return null;

  return (
    <footer
      className="text-white pt-8 pb-6 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: backgroundColor || "#0f172a" }}
      role="contentinfo"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <SiteLogo className="w-32 sm:w-40 mb-2 sm:mb-4" />
        </div>

        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold mb-2 sm:mb-3">
            Navigasjon
          </h3>
          <ul className="space-y-1 sm:space-y-2">
            {[
              { name: "Aktiviteter", href: "/aktiviteter" },
              { name: "Nettbutikk", href: "/shop" },
              { name: "Blogg", href: "/blog" },
              { name: "Om oss", href: "/about-us" },
              { name: "Kontakt oss", href: "/kontakt-oss" },
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

        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold mb-2 sm:mb-3">
            Åpningstider
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {openingHours.length > 0 ? (
              openingHours.map((item, index) => {
                const mandag = item.attributes?.Mandag || item.Mandag;
                const tirsdag = item.attributes?.Tirsdag || item.Tirsdag;
                const onsdag = item.attributes?.Onsdag || item.Onsdag;
                const torsdag = item.attributes?.Torsdag || item.Torsdag;
                const fredag = item.attributes?.Fredag || item.Fredag;
                const lordag = item.attributes?.Lordag || item.Lordag;
                const sondag = item.attributes?.Sondag || item.Sondag;

                const days = [
                  { name: "Mandag", value: mandag },
                  { name: "Tirsdag", value: tirsdag },
                  { name: "Onsdag", value: onsdag },
                  { name: "Torsdag", value: torsdag },
                  { name: "Fredag", value: fredag },
                  { name: "Lørdag", value: lordag },
                  { name: "Søndag", value: sondag },
                ];

                return days.map(
                  (day) =>
                    day.value && (
                      <li
                        key={`${item.id || `opening-hour-${index}`}-${
                          day.name
                        }`}
                        className="flex flex-col sm:flex-row sm:items-center"
                      >
                        <span className="font-medium sm:w-16">{day.name}</span>
                        <span className="ml-0 sm:ml-2">{day.value}</span>
                      </li>
                    )
                );
              })
            ) : (
              <li>Ingen åpningstider tilgjengelig</li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold mb-2 sm:mb-3">
            Følg oss
          </h3>
          {socialMediaItems.length > 0 ? (
            <div className="flex flex-col space-y-3">
              {socialMediaItems.map((item, index) => {
                const { name, url, icon } = getSocialMediaInfo(item);
                // Generate a unique key using index, type, and a hash of url
                const urlHash = url ? btoa(url).slice(0, 8) : `no-url-${index}`;
                const uniqueKey = `${item.id || `social-${index}`}-${
                  item.type
                }-${urlHash}`;
                return (
                  <Link
                    key={uniqueKey}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    {icon}
                    <span>{name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-300">
              Ingen sosiale medier lagt til
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 border-t border-gray-700 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-400">
        {currentYear !== null && (
          <>
            © {currentYear} {footerText || "© TheCaveTech."}
          </>
        )}
      </div>
    </footer>
  );
}
