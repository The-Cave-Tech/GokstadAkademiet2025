"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getStrapiData } from "@/lib/services/strapiApiData";

export function AuthBackgroundImage({ className}: AuthBackgroundImageProps) {
  const [data, setData] = useState<{ AuthBackgroundImage: string | null; altText?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getStrapiData("/api/auth-setting?populate=*");
        const imageData = data?.AuthBackgroundImage;
        if (imageData?.url) {
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
          setData({
            AuthBackgroundImage: `${baseUrl}${imageData.url}`,
            altText: imageData.alternativeText,
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
  if (!data) return <p>Loading...</p>;

  return (
    <div className={className}>
      {data.AuthBackgroundImage ? (
        <Image
          src={data.AuthBackgroundImage}
          alt={data.altText || "Background Image"}
          fill
          sizes="(max-width: 850px) 100vw, 50vw"
          className="object-cover"
          quality={100}
          priority
          onError={() => setError("Image could not be loaded")}
        />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
}

