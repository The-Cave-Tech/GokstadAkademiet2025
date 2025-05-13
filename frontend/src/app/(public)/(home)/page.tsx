"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { eventsService } from "@/lib/data/services/eventService";
import { projectService } from "@/lib/data/services/projectService";
import ClientMessage from "@/components/ClientMessage";
import { EventAttributes, ProjectAttributes } from "@/types/content.types";
import { EventCard } from "@/components/dashboard/contentManager/EventCard";
import ProjectCarousel from "@/components/ui/ProjectCarousel";


interface LandingPageData {
  hero: {
    Title: string;
    Subtitle: string;
    heroImage: any; 
  };
  introduction: Array<{
    Title: string;
    IntroductionText: string;
    introductionImage: any; 
  }>;
}


const getImageType = (url: string | null): "svg" | "other" => {
  if (!url) return "other";
  return url.toLowerCase().endsWith(".svg") ? "svg" : "other";
};


const MediaRenderer = ({
  url,
  alt,
  className,
  objectFit = "cover",
  onError,
  autoHeight = false,
}: {
  url: string | null;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onError?: () => void;
  autoHeight?: boolean;
}) => {
  const imageType = url ? getImageType(url) : "other";

  if (!url) {
    return (
      <div
        className={`bg-gray-300 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-600">Bilde mangler</p>
      </div>
    );
  }

  if (imageType === "svg") {
    return (
      <div
        className={className}
        style={{
          backgroundImage: `url('${url}')`,
          backgroundSize: objectFit,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label={alt}
      />
    );
  }

  if (autoHeight) {
    return (
      <img
        src={url}
        alt={alt}
        className={className}
        style={{ maxWidth: "100%", height: "auto", objectFit }}
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      className={className}
      style={{ objectFit }}
      priority
      unoptimized={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
      onError={onError}
    />
  );
};

const transformResponseToPageData = (responseData: any): LandingPageData => {
  console.log("Raw response data:", responseData);

  const attributes = responseData.attributes || responseData;
  console.log("Data attributes:", attributes);

  const heroComponent = attributes.hero || {};
  const introductionComponents = Array.isArray(attributes.introduction)
    ? attributes.introduction
    : attributes.introduction
    ? [attributes.introduction]
    : [];

  console.log("Hero component raw:", heroComponent);
  console.log("Introduction components raw:", introductionComponents);

  console.log("Hero image object:", heroComponent.heroImage);

  return {
    hero: {
      Title: heroComponent.Title || "",
      Subtitle: heroComponent.Subtitle || "",
      heroImage: heroComponent.heroImage || null,
    },
    introduction: introductionComponents.map((component: any) => ({
      Title: component.Title || "",
      IntroductionText: component.IntroductionText || "",
      introductionImage: component.introductionImage || null,
    })),
  };
};

const getImageUrl = (mediaObject: any): string | null => {
  if (!mediaObject) {
    console.log("Media object is null or undefined");
    return null;
  }

  if (Array.isArray(mediaObject) && mediaObject.length > 0) {
    console.log(
      "Media object is an array, using first element:",
      mediaObject[0]
    );
    return getImageUrl(mediaObject[0]);
  }

  console.log("Processing media object type:", typeof mediaObject);
  console.log("Media object structure:", mediaObject);

  try {
    if (typeof mediaObject === "string") {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const fullUrl = mediaObject.startsWith("http")
        ? mediaObject
        : `${baseUrl}${
            mediaObject.startsWith("/") ? mediaObject : `/${mediaObject}`
          }`;
      console.log("Found direct string URL:", fullUrl);
      return fullUrl;
    }

    if (mediaObject.name && mediaObject.url) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");

      const url = mediaObject.url;
      let fullUrl = "";

      if (url.startsWith("http")) {
        fullUrl = url;
      } else {
        if (url.startsWith("/uploads/")) {
          fullUrl = `${mediaBaseUrl}${url}`;
        } else if (url.startsWith("uploads/")) {
          fullUrl = `${mediaBaseUrl}/${url}`;
        } else if (url.startsWith("/api/uploads/")) {
          fullUrl = `${mediaBaseUrl}${url.replace("/api", "")}`;
        } else {
          fullUrl = `${mediaBaseUrl}${url.startsWith("/") ? url : `/${url}`}`;
        }
      }

      console.log("Found file with name and url:", fullUrl);
      return fullUrl;
    }

    if (mediaObject.data && mediaObject.data.attributes) {
      const attributes = mediaObject.data.attributes;
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");

      if (attributes.url) {
        const url = attributes.url;
        let fullUrl = "";

        if (url.startsWith("http")) {
          fullUrl = url;
        } else {
          if (url.startsWith("/uploads/")) {
            fullUrl = `${mediaBaseUrl}${url}`;
          } else if (url.startsWith("uploads/")) {
            fullUrl = `${mediaBaseUrl}/${url}`;
          } else if (url.startsWith("/api/uploads/")) {
            fullUrl = `${mediaBaseUrl}${url.replace("/api", "")}`;
          } else {
            fullUrl = `${mediaBaseUrl}${url.startsWith("/") ? url : `/${url}`}`;
          }
        }

        console.log("Found URL in data.attributes.url:", fullUrl);
        return fullUrl;
      }

      if (attributes.formats) {
        const formats = attributes.formats;
        const formatToUse =
          formats.medium || formats.small || formats.thumbnail;

        if (formatToUse && formatToUse.url) {
          const url = formatToUse.url;
          let fullUrl = "";

          if (url.startsWith("http")) {
            fullUrl = url;
          } else {
            if (url.startsWith("/uploads/")) {
              fullUrl = `${mediaBaseUrl}${url}`;
            } else if (url.startsWith("uploads/")) {
              fullUrl = `${mediaBaseUrl}/${url}`;
            } else if (url.startsWith("/api/uploads/")) {
              fullUrl = `${mediaBaseUrl}${url.replace("/api", "")}`;
            } else {
              fullUrl = `${mediaBaseUrl}${
                url.startsWith("/") ? url : `/${url}`
              }`;
            }
          }

          console.log("Found URL in formats:", fullUrl);
          return fullUrl;
        }
      }
    }

    if (mediaObject.url) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");
      let fullUrl = "";

      if (mediaObject.url.startsWith("http")) {
        fullUrl = mediaObject.url;
      } else {
        if (mediaObject.url.startsWith("/uploads/")) {
          fullUrl = `${mediaBaseUrl}${mediaObject.url}`;
        } else if (mediaObject.url.startsWith("uploads/")) {
          fullUrl = `${mediaBaseUrl}/${mediaObject.url}`;
        } else if (mediaObject.url.startsWith("/api/uploads/")) {
          fullUrl = `${mediaBaseUrl}${mediaObject.url.replace("/api", "")}`;
        } else {
          fullUrl = `${mediaBaseUrl}${
            mediaObject.url.startsWith("/")
              ? mediaObject.url
              : `/${mediaObject.url}`
          }`;
        }
      }

      console.log("Found direct URL property:", fullUrl);
      return fullUrl;
    }

    // NYTT: Spesiell håndtering for dokumenter med ID og navn
    if (mediaObject.documentId && mediaObject.name) {
      console.log(
        "Found document with ID and name:",
        mediaObject.documentId,
        mediaObject.name
      );
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");

      // Prøv å konstruere URL fra filnavn og hash hvis tilgjengelig
      if (mediaObject.hash) {
        const fullUrl = `${mediaBaseUrl}/uploads/${
          mediaObject.hash
        }.${mediaObject.ext.replace(".", "")}`;
        console.log("Constructed URL from hash:", fullUrl);
        return fullUrl;
      }

      // Fallback til bare filename
      const fullUrl = `${mediaBaseUrl}/uploads/${mediaObject.name}`;
      console.log("Constructed URL from filename:", fullUrl);
      return fullUrl;
    }

    // Prøv å bruke hjelperen hvis tilgjengelig
    if (
      strapiService.media &&
      typeof strapiService.media.getMediaUrl === "function" &&
      strapiService.media.isValidMedia(mediaObject)
    ) {
      const helperUrl = strapiService.media.getMediaUrl(mediaObject);
      console.log("Used strapiService helper to get URL:", helperUrl);

      // Sjekk om URL-en inneholder "/api/uploads/" og fiks det
      if (helperUrl && helperUrl.includes("/api/uploads/")) {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
        const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");
        const correctedUrl = helperUrl
          .replace(baseUrl, mediaBaseUrl)
          .replace("/api/uploads/", "/uploads/");
        console.log("Corrected helper URL:", correctedUrl);
        return correctedUrl;
      }

      return helperUrl;
    }

    console.log("Could not find a valid URL structure in the media object");
  } catch (err) {
    console.error("Error extracting image URL:", err);
  }

  return null;
};

export default function LandingPageContent() {
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [events, setEvents] = useState<EventAttributes[]>([]);
  const [projects, setProjects] = useState<ProjectAttributes[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  // Updated to handle multiple introduction images
  const [introImageUrls, setIntroImageUrls] = useState<(string | null)[]>([]);

  const [loading, setLoading] = useState({
    content: true,
    events: true,
    projects: true,
  });

  const [errors, setErrors] = useState({
    content: null as string | null,
    events: null as string | null,
    projects: null as string | null,
  });

  const [imageLoadError, setImageLoadError] = useState({
    hero: false,
    intro: {} as Record<number, boolean>, // Changed to object to track each intro image
  });

  // Fetch landing page data
  useEffect(() => {
    async function getLandingPageData() {
      try {
        // Bruk det korrekte navnet på single-type
        // Fra konsollen ser vi at 'landing-page' er endepunktet som fungerer
        const landingPage = strapiService.single("landing-page");

        const response = await landingPage.find({
          populate: {
            hero: {
              populate: ["heroImage"],
            },
            introduction: {
              populate: ["introductionImage"],
            },
          },
        });

        if (!response.data) {
          throw new Error("Ingen 'data' funnet i Strapi-respons");
        }

        console.log("Full Strapi response:", response);
        console.log("Hero component data:", response.data.attributes?.hero);
        console.log(
          "Introduction component data:",
          response.data.attributes?.introduction
        );

        // Transform the response data to match our LandingPageData interface
        const transformedData = transformResponseToPageData(response.data);
        console.log("Transformed data:", transformedData);

        // Store the transformed data
        setPageData(transformedData);

        // Extract and process hero image URL
        const heroImageUrl = getImageUrl(transformedData.hero.heroImage);
        console.log("Hero image URL:", heroImageUrl);
        console.log("Hero image type:", getImageType(heroImageUrl));

        // Process all introduction image URLs
        const introUrls = transformedData.introduction.map((intro) => {
          const url = getImageUrl(intro.introductionImage);
          console.log("Introduction image URL result:", url);
          console.log("Introduction image type:", getImageType(url));

          // Fix URL if it contains "/api/uploads/"
          if (url && url.includes("/api/uploads/")) {
            const fixedUrl = url.replace("/api/uploads/", "/uploads/");
            console.log("Fixed intro URL:", fixedUrl);
            return fixedUrl;
          }

          return url;
        });

        // Fix hero URL if needed
        let fixedHeroUrl = heroImageUrl;
        if (heroImageUrl && heroImageUrl.includes("/api/uploads/")) {
          fixedHeroUrl = heroImageUrl.replace("/api/uploads/", "/uploads/");
          console.log("Fixed hero URL:", fixedHeroUrl);
        }

        setHeroImageUrl(fixedHeroUrl);
        setIntroImageUrls(introUrls);

        setErrors((prev) => ({ ...prev, content: null }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
        setErrors((prev) => ({
          ...prev,
          content: `Klarte ikke å hente data: ${errorMessage}`,
        }));
        console.error("Error fetching landing page data:", err);
      } finally {
        setLoading((prev) => ({ ...prev, content: false }));
      }
    }

    getLandingPageData();
  }, []);

  // Fetch events (unchanged)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await eventsService.getAll({
          sort: ["startDate:asc"],
          populate: ["eventCardImage"],
        });
        setEvents(eventsData);
        setErrors((prev) => ({ ...prev, events: null }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
        setErrors((prev) => ({
          ...prev,
          events: `Klarte ikke å hente eventer: ${errorMessage}`,
        }));
        console.error("Error fetching events:", err);
      } finally {
        setLoading((prev) => ({ ...prev, events: false }));
      }
    }

    fetchEvents();
  }, []);

  // Fetch projects (unchanged)
  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectData = await projectService.getAll({
          sort: ["createdAt:desc"],
          populate: "*",
        });
        setProjects(projectData);
        setErrors((prev) => ({ ...prev, projects: null }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ukjent feil";
        setErrors((prev) => ({
          ...prev,
          projects: `Klarte ikke å hente prosjekter: ${errorMessage}`,
        }));
        console.error("Error fetching projects:", err);
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    }

    fetchProjects();
  }, []);

  // Updated to handle multiple introduction images
  const handleImageError = (
    imageType: "hero" | "intro",
    index: number = 0,
    url: string | null
  ) => {
    console.error(
      `Image load error for ${imageType} image ${index}. URL attempted: ${url}`
    );

    // Try to fix the URL
    if (url) {
      console.log("Testing URL accessibility:", url);

      // Try to generate an alternative URL for testing
      let correctedUrl: string = url;

      if (url.includes("/api/uploads/")) {
        correctedUrl = url.replace("/api/uploads/", "/uploads/");
        console.log("Created corrected URL:", correctedUrl);

        // Try the corrected URL
        if (imageType === "hero") {
          setHeroImageUrl(correctedUrl);
        } else if (imageType === "intro") {
          setIntroImageUrls((prev) => {
            const newUrls = [...prev];
            newUrls[index] = correctedUrl;
            return newUrls;
          });
        }
      } else {
        // If we can't correct the URL, set error status
        if (imageType === "hero") {
          setImageLoadError((prev) => ({
            ...prev,
            hero: true,
          }));
        } else if (imageType === "intro") {
          setImageLoadError((prev) => ({
            ...prev,
            intro: {
              ...prev.intro,
              [index]: true,
            },
          }));
        }
      }
    } else {
      if (imageType === "hero") {
        setImageLoadError((prev) => ({
          ...prev,
          hero: true,
        }));
      } else if (imageType === "intro") {
        setImageLoadError((prev) => ({
          ...prev,
          intro: {
            ...prev.intro,
            [index]: true,
          },
        }));
      }
    }
  };

  console.log("Render state:", {
    heroImageUrl,
    introImageUrls,
    heroImageType: getImageType(heroImageUrl),
    introImageTypes: introImageUrls.map((url) => getImageType(url)),
    imageLoadError,
    pageDataExists: !!pageData,
  });

  if (loading.content || loading.events || loading.projects) {
    return <p className="text-center py-10">Laster innhold...</p>;
  }

  if (errors.content || errors.events || errors.projects || !pageData) {
    return (
      <div className="text-center text-red-500 py-10">
        {errors.content ||
          errors.events ||
          errors.projects ||
          "Kunne ikke laste innhold"}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4 bg-gray-900 text-white">
        <ClientMessage />
        <div className="absolute inset-0 z-0">
          {!imageLoadError.hero ? (
            <MediaRenderer
              url={heroImageUrl}
              alt="Hero Background Image"
              className="w-full h-full opacity-50"
              objectFit="cover"
              onError={() => handleImageError("hero", 0, heroImageUrl)}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <p className="text-white opacity-70">Kunne ikke laste bildet</p>
            </div>
          )}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            {pageData.hero?.Title || "Mangler tittel"}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl">
            {pageData.hero?.Subtitle || "Mangler undertittel"}
          </p>
        </div>
      </section>

      {/* Introduction Sections - Now supports multiple introduction components */}
      {pageData.introduction.map((intro, index) => (
        <section
          key={`intro-${index}`}
          className="py-16 px-4 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center md:grid-flow-dense"
        >
          {/* Image section - Always on the left */}
          <div className="w-full rounded-xl overflow-hidden shadow-lg md:col-start-1">
            {!imageLoadError.intro[index] ? (
              <MediaRenderer
                url={introImageUrls[index]}
                alt={`Introduction Image ${index + 1}`}
                className="w-full"
                objectFit="contain"
                autoHeight={true}
                onError={() =>
                  handleImageError("intro", index, introImageUrls[index])
                }
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                <p className="text-gray-600">Kunne ikke laste bildet</p>
              </div>
            )}
          </div>

          {/* Text section - Always on the right */}
          <div className="md:col-start-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {intro.Title || "Mangler tittel"}
            </h2>
            {/* Format the text with proper paragraph spacing */}
            {intro.IntroductionText ? (
              <div className="text-base sm:text-lg leading-relaxed space-y-4">
                {intro.IntroductionText.split("\n\n").map(
                  (paragraph, pIndex) => (
                    <p key={`p-${index}-${pIndex}`}>{paragraph}</p>
                  )
                )}
              </div>
            ) : (
              <p className="text-base sm:text-lg leading-relaxed">
                Mangler tekst
              </p>
            )}
          </div>
        </section>
      ))}

      {/* Projects Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary to-secondary/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prosjekter</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Se våre nyeste og pågående prosjekter
            </p>
          </div>

          {/* Project Carousel Component */}
          <div className="relative px-8">
            <ProjectCarousel projects={projects} />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Arrangementer
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Se våre kommende arrangementer
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-[658px] mx-auto">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-center text-gray-500 w-full h-[76px] flex items-center justify-center border rounded-lg">
                Ingen arrangementer funnet
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
