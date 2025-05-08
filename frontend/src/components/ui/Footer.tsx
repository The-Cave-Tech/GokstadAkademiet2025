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
  };
  Mandag?: string;
  Tirsdag?: string;
  Onsdag?: string;
  Torsdag?: string;
  Fredag?: string;
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

  // Updated function to use the defined interface
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

    // Default for other types
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
        console.log("Attempting to fetch footer data from Strapi");

        const data = await strapiService.fetch<any>("footer?populate=*");

        console.log(
          "Full API response structure:",
          JSON.stringify(data, null, 2)
        );

        if (data?.data) {
          console.log("Data object exists:", data.data);

          if (typeof data.data === "object") {
            console.log("Data keys:", Object.keys(data.data));

            setFooterText(data.data.footerText || "");
            setBackgroundColor(data.data.footerBackgroundColor || "");

            if (
              data.data.openingHours &&
              Array.isArray(data.data.openingHours)
            ) {
              console.log("Opening hours found:", data.data.openingHours);
              setOpeningHours(data.data.openingHours);
            } else if (
              data.data.attributes?.openingHours &&
              Array.isArray(data.data.attributes.openingHours)
            ) {
              console.log(
                "Opening hours found in attributes:",
                data.data.attributes.openingHours
              );
              setOpeningHours(data.data.attributes.openingHours);
            } else {
              console.log("No valid opening hours found");
              setOpeningHours([]);
            }

            const socialItems: SocialMediaItem[] = [];

            if (data.data.faceBook) {
              console.log("Facebook item found:", data.data.faceBook);
              if (Array.isArray(data.data.faceBook)) {
                data.data.faceBook.forEach((item: any) => {
                  socialItems.push({
                    ...item,
                    type: "facebook",
                  });
                });
              } else {
                socialItems.push({
                  ...data.data.faceBook,
                  type: "facebook",
                });
              }
            } else if (data.data.attributes?.faceBook) {
              console.log(
                "Facebook item found in attributes:",
                data.data.attributes.faceBook
              );
              if (Array.isArray(data.data.attributes.faceBook)) {
                data.data.attributes.faceBook.forEach((item: any) => {
                  socialItems.push({
                    ...item,
                    type: "facebook",
                  });
                });
              } else {
                socialItems.push({
                  ...data.data.attributes.faceBook,
                  type: "facebook",
                });
              }
            }

            if (data.data.instaGram) {
              console.log("Instagram item found:", data.data.instaGram);
              if (Array.isArray(data.data.instaGram)) {
                data.data.instaGram.forEach((item: any) => {
                  socialItems.push({
                    ...item,
                    type: "instagram",
                  });
                });
              } else {
                socialItems.push({
                  ...data.data.instaGram,
                  type: "instagram",
                });
              }
            } else if (data.data.attributes?.instaGram) {
              console.log(
                "Instagram item found in attributes:",
                data.data.attributes.instaGram
              );
              if (Array.isArray(data.data.attributes.instaGram)) {
                data.data.attributes.instaGram.forEach((item: any) => {
                  socialItems.push({
                    ...item,
                    type: "instagram",
                  });
                });
              } else {
                socialItems.push({
                  ...data.data.attributes.instaGram,
                  type: "instagram",
                });
              }
            }

            console.log("All social media items:", socialItems);
            setSocialMediaItems(socialItems);
          } else {
            console.log("Data is not an object:", typeof data.data);
            setOpeningHours([]);
            setSocialMediaItems([]);
          }
        } else {
          console.log("No data object in API response");
          setOpeningHours([]);
          setSocialMediaItems([]);
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

  console.log("Social media items for rendering:", socialMediaItems);

  return (
    <footer
      className="text-white pt-8 pb-6 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: backgroundColor || "#0f172a" }}
      role="contentinfo"
      suppressHydrationWarning
    >
      {/* Main footer content with improved responsive grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & description - full width on mobile, 1/4 on large screens */}
        <div className="space-y-3">
          <SiteLogo className="w-32 sm:w-40 mb-2 sm:mb-4" />
          <p className="text-sm text-gray-300 leading-relaxed"></p>
        </div>

        {/* Navigation links - 1/2 width on tablet, 1/4 on desktop */}
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

        {/* Opening hours - 1/2 width on tablet, 1/4 on desktop */}
        <div className="space-y-3">
          <h3 className="text-base lg:text-lg font-semibold mb-2 sm:mb-3">
            Åpningstider
          </h3>
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
                  </React.Fragment>
                );
              })
            ) : (
              <li>Ingen åpningstider tilgjengelig</li>
            )}
          </ul>
        </div>

        {/* Social Media & Links - 1/2 width on tablet, 1/4 on desktop */}
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

      {/* Copyright section */}
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
