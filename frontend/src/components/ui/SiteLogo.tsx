// components/SiteLogo.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { mediaService } from "@/lib/data/services/mediaService";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export function SiteLogo({
  className,
  style,
  width = 145,
  height = 55,
}: LogoProps) {
  const [logoData, setLogoData] = useState<{ url: string | null; alt: string }>(
    { url: null, alt: "" }
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const globalSettings = strapiService.single("global-setting");
        const response = await globalSettings.find({
          populate: "*",
        });

        const logoMedia = response.data?.SiteLogo;

        if (mediaService.isValidMedia(logoMedia)) {
          setLogoData({
            url: mediaService.getMediaUrl(logoMedia),
            alt: mediaService.getAltText(logoMedia) || "Site Logo",
          });
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

  return logoData.url ? (
    <div className={className}>
      <Image
        src={logoData.url}
        alt={logoData.alt}
        width={width}
        height={height}
        priority
        style={{ width: "auto", height: "auto", ...style }}
      />
    </div>
  ) : (
    <p>Loading logo...</p>
  );
}
("use client");
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";

export function SiteLogo({
  className,
  style,
  width = 145,
  height = 55,
}: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await fetchStrapiData(
          "/api/global-setting?populate=*"
        );
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
        style={{ width: "auto", height: "auto", ...style }}
      />
    </div>
  ) : (
    <p>Loading logo...</p>
  );
}
