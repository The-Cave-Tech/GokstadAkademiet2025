"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getStrapiData } from "@/lib/services/strapiApiData";

export function SiteLogo({ className, style, width = 145, height = 55 }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await getStrapiData("/api/global-setting?populate=*");
        const logoData = data?.SiteLogo;
        if (logoData?.url) {
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
          setLogoUrl(`${baseUrl}${logoData.url}`);
        } else {
          throw new Error("Logo not found");
        }
      } catch {
        setError("Failed to load logo");
      }
    };
    fetchLogo();
  }, []);

  if (error) return <p>{error}</p>;

  return logoUrl ? (
    <div className={className}>
      <Image
        src={logoUrl}
        alt="Site Logo"
        width={width}
        height={height}
        priority
        style={{ width: "100%", height: "auto", ...style }}
      />
    </div>
  ) : (
    <p>Loading logo...</p>
  );
}



