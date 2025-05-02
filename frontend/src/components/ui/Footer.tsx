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

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [footerText, setFooterText] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1F2937");

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
          setBackgroundColor(attributes.footerBackgroundColor || "#1F2937");
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer
      className="py-8 px-4 text-white"
      style={{ backgroundColor }}
      role="contentinfo"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Company Info */}
          <div className="mb-6 md:mb-0">
            <SiteLogo className="w-36 mb-4" />
            <p className="text-sm text-gray-300">
              Innovative teknologiløsninger for fremtiden.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 md:mb-0">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-300 hover:text-white hover:underline transition-colors"
                >
                  Nettbutikk
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white hover:underline transition-colors"
                >
                  Blogg
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-white hover:underline transition-colors"
                >
                  Om oss
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-300 hover:text-white hover:underline transition-colors"
                >
                  Kontakt oss
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <div>
            <ul className="flex gap-4">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:underline transition-colors"
                    aria-label={`Besøk vår ${link.name} side`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {footerText}
        </div>
      </div>
    </footer>
  );
}
