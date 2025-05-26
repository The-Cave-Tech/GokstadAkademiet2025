"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { mediaService } from "@/lib/data/services/mediaService";

// Logo types supported by the component
type LogoType = "header" | "footer" | "signIn" | "signUp"; // ← 1. Can be expanded with more types later

interface LogoProps {
  type?: LogoType;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const logoFieldMap: Record<LogoType, string> = { 
  header: "HeaderLogo",
  footer: "FooterLogo",
  signIn: "SignInLogo",
  signUp: "SignUpLogo"  
  // ← 2. Can be expanded with more types and field names later
};

export function SiteLogo({
  type = "header",
  className,
  style,
  width = 145,
  height = 55
}: LogoProps) {
  const [logoData, setLogoData] = useState<{ url: string | null; alt: string }>({ url: null, alt: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const globalSettings = strapiService.single("global-setting");
        const response = await globalSettings.find({ populate: "*" });

        const logoField = logoFieldMap[type]; // ← 3. Gets the correct field name based on type
        const logoMedia = response.data?.[logoField];

        if (mediaService.isValidMedia(logoMedia)) {
          setLogoData({
            url: mediaService.getMediaUrl(logoMedia),
            alt: mediaService.getAltText(logoMedia) || `${type} logo`
          });
        } else {
          throw new Error(`${type} logo not found`);
        }
      } catch {
        setError(`Failed to load ${type} logo`);
      }
    };
    fetchLogo();
  }, [type]);

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
    <p>Loading {type} logo...</p>
  );
}
