"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getStrapiData } from "@/data/services/strapiApiData";
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
    const fetchStrapiData = async (url: string) => {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const token = process.env.STRAPI_API_TOKEN; 

      try {
        const response = await fetch(baseUrl + url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    };

    
  }, []);

  return (
    <footer className="p-8 text-white" style={{ backgroundColor }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
       
        <SiteLogo className="w-36" />

        <ul className="flex gap-4">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      
      <p className="text-center mt-4 text-sm">
        &copy; {new Date().getFullYear()} {footerText}
      </p>
    </footer>
  );
}
