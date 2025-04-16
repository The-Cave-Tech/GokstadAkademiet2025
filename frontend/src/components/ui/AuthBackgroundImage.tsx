// components/AuthBackgroundImage.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import { mediaService } from "@/lib/data/services/mediaService";

interface AuthBackgroundImageProps {
  className?: string;
}

export function AuthBackgroundImage({ className }: AuthBackgroundImageProps) {
  const [imageData, setImageData] = useState<{ url: string | null; alt: string }>({ url: null, alt: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authSettings = strapiService.single('auth-setting');
        const response = await authSettings.find({
          populate: '*'
        });
        
        const imageMedia = response.data?.AuthBackgroundImage;
        
        if (mediaService.isValidMedia(imageMedia)) {
          setImageData({
            url: mediaService.getMediaUrl(imageMedia),
            alt: mediaService.getAltText(imageMedia) || 'Background Image'
          });
        } else {
          throw new Error("No image data found");
        }
      } catch {
        setError("Failed to load background image");
      }
    };
    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!imageData.url) return <p>Loading...</p>;

  return (
    <div className={className}>
      <Image
        src={imageData.url}
        alt={imageData.alt}
        fill
        sizes="(max-width: 850px) 100vw, 50vw"
        className="object-cover"
        quality={100}
        priority
        onError={() => setError("Image could not be loaded")}
      />
    </div>
  );
}