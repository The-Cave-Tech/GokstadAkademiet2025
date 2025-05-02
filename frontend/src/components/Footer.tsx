"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";
import { SiteLogo } from "./ui/SiteLogo";

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
    <footer className="p-8 text-white" style={{ backgroundColor }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-center gap-10">
        {/* Logo */}
        <SiteLogo className="w-36" />

        {/* Sosiale lenker */}
        <ul className="flex gap-4">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Navigasjon - horisontal */}
        <ul className="flex gap-4">
          <li>
            <Link href="/shop">Nettbutikk</Link>
          </li>
          <li>
            <Link href="/blog">Blogg</Link>
          </li>
          <li>
            <Link href="/about-us">Om oss</Link>
          </li>
          <li>
            <Link href="/contact-us">Kontakt oss</Link>
          </li>
        </ul>
      </div>

      <p className="text-center mt-8 text-sm">
        &copy; {new Date().getFullYear()} {footerText}
      </p>
    </footer>
  );
}
