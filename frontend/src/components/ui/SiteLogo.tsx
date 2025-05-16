// components/SiteLogo.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { mediaService } from "@/lib/data/services/mediaService";

// Logotyper som komponenten støtter
type LogoType = "header" | "footer";

interface LogoProps {
  type?: LogoType; // Ny prop for å spesifisere logo-type
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export function SiteLogo({ 
  type = "header", // Standard er header-logo
  className, 
  style, 
  width = 145, 
  height = 55 
}: LogoProps) {
  const [logoData, setLogoData] = useState<{ url: string | null; alt: string }>({ url: null, alt: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const globalSettings = strapiService.single('global-setting');
        const response = await globalSettings.find({
          populate: '*'
        });
        
        // Velg riktig logo basert på type
        const logoField = type === "header" ? "HeaderLogo" : "FooterLogo";
        const logoMedia = response.data?.[logoField];
        
        if (mediaService.isValidMedia(logoMedia)) {
          setLogoData({
            url: mediaService.getMediaUrl(logoMedia),
            alt: mediaService.getAltText(logoMedia) || `${type === "header" ? "Header" : "Footer"} Logo`
          });
        } else {
          throw new Error(`${type} logo not found`);
        }
      } catch {
        // Fjernet 'err' parameteren fra catch siden den ikke brukes
        setError(`Failed to load ${type} logo`);
      }
    };
    fetchLogo();
  }, [type]); // Legg til type som avhengighet for å laste på nytt når type endres

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
/* How to use when importing

// For header logo (default)
<SiteLogo style={{ width: "auto", height: "45px" }} />

// For footer logo
<SiteLogo type="footer" style={{ width: "auto", height: "45px" }} />

*/
