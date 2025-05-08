"use client";

import React, { useEffect, useState, ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { SiteLogo } from "./SiteLogo";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

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

interface FacebookItem extends SocialMediaBase {
  type: "facebook";
}

interface InstagramItem extends SocialMediaBase {
  type: "instagram";
}

type SocialMediaItem = FacebookItem | InstagramItem;

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

  const getSocialMediaInfo = (
    item: FacebookItem | InstagramItem
  ): SocialMediaInfo => {
    const safeUrl = typeof item.url === "string" ? item.url : "";

    if (item.type === "facebook") {
      return {
        name: "Facebook",
        url: safeUrl,
        icon: <FaFacebookF size={24} className="mr-2" />,
      };
    }

    if (item.type === "instagram") {
      return {
        name: "Instagram",
        url: safeUrl,
        icon: <FaInstagram size={24} className="mr-2" />,
      };
    }

    const url = safeUrl.toLowerCase();
    if (url.includes("facebook")) {
      return {
        name: "Facebook",
        url: safeUrl,
        icon: <FaFacebookF size={24} className="mr-2" />,
      };
    }
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

          const fb = data.data.faceBook || data.data.attributes?.faceBook;
          const ig = data.data.instaGram || data.data.attributes?.instaGram;

          if (fb) {
            if (Array.isArray(fb)) {
              fb.forEach((item: any) =>
                socialItems.push({ ...item, type: "facebook" })
              );
            } else {
              socialItems.push({ ...fb, type: "facebook" });
            }
          }

          if (ig) {
            if (Array.isArray(ig)) {
              ig.forEach((item: any) =>
                socialItems.push({ ...item, type: "instagram" })
              );
            } else {
              socialItems.push({ ...ig, type: "instagram" });
            }
          }

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

                return (
                  <React.Fragment key={item.id || `opening-hour-${index}`}>
                    {mandag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Mandag</span>
                        <span className="ml-0 sm:ml-2">{mandag}</span>
                      </li>
                    )}
                    {tirsdag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Tirsdag</span>
                        <span className="ml-0 sm:ml-2">{tirsdag}</span>
                      </li>
                    )}
                    {onsdag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Onsdag</span>
                        <span className="ml-0 sm:ml-2">{onsdag}</span>
                      </li>
                    )}
                    {torsdag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Torsdag</span>
                        <span className="ml-0 sm:ml-2">{torsdag}</span>
                      </li>
                    )}
                    {fredag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Fredag</span>
                        <span className="ml-0 sm:ml-2">{fredag}</span>
                      </li>
                    )}
                    {lordag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Lørdag</span>
                        <span className="ml-0 sm:ml-2">{lordag}</span>
                      </li>
                    )}
                    {sondag && (
                      <li className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-16">Søndag</span>
                        <span className="ml-0 sm:ml-2">{sondag}</span>
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

        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold mb-2 sm:mb-3">
            Følg oss
          </h3>
          {socialMediaItems.length > 0 ? (
            <div className="flex flex-col space-y-3">
              {socialMediaItems.map((item, index) => {
                const { name, url, icon } = getSocialMediaInfo(item);
                return (
                  <Link
                    key={item.id || `social-${index}`}
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
            &copy; {currentYear} {footerText || "© TheCaveTech."}
          </>
        )}
      </div>
    </footer>
  );
}
