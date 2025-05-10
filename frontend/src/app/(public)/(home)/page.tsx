"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { strapiService } from "@/lib/data/services/strapiClient";
import { eventsService } from "@/lib/data/services/eventService";
import { projectService } from "@/lib/data/services/projectService";
import ClientMessage from "@/components/ClientMessage";
import { EventAttributes, ProjectAttributes } from "@/types/content.types";
import { UniversalCard } from "@/components/dashboard/contentManager/ContentCard";
import {
  adaptProjectToCardProps,
  adaptEventToCardProps,
} from "@/lib/adapters/cardAdapter";
import { useRouter } from "next/navigation";

// Interface that defines our component's data structure
interface LandingPageData {
  hero: {
    Title: string;
    Subtitle: string;
    heroImage: any; // Strapi media object
  };
  introduction: {
    Title: string;
    IntroductionText: string;
    introductionImage: any; // Strapi media object
  };
}

// Funksjon for å sjekke bildetypen
const getImageType = (url: string | null): "svg" | "other" => {
  if (!url) return "other";
  return url.toLowerCase().endsWith(".svg") ? "svg" : "other";
};

// MediaRenderer-komponent for å håndtere alle bildeformater
const MediaRenderer = ({
  url,
  alt,
  className,
  objectFit = "cover",
  onError,
}: {
  url: string | null;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onError?: () => void;
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

// Helper function to transform API response data to match our component's interface
const transformResponseToPageData = (responseData: any): LandingPageData => {
  console.log("Raw response data:", responseData);

  // I Strapi v4 finnes data ofte i attributes-objektet
  const attributes = responseData.attributes || responseData;
  console.log("Data attributes:", attributes);

  // Komponenter i Strapi kommer med sin egen struktur
  const heroComponent = attributes.hero || {};
  const introductionComponent = attributes.introduction || {};

  console.log("Hero component raw:", heroComponent);
  console.log("Introduction component raw:", introductionComponent);

  // For dypere analyse av bildeobjektene
  console.log("Hero image object:", heroComponent.heroImage);
  console.log(
    "Introduction image object:",
    introductionComponent.introductionImage
  );

  return {
    hero: {
      Title: heroComponent.Title || "",
      Subtitle: heroComponent.Subtitle || "",
      heroImage: heroComponent.heroImage || null,
    },
    introduction: {
      Title: introductionComponent.Title || "",
      IntroductionText: introductionComponent.IntroductionText || "",
      introductionImage: introductionComponent.introductionImage || null,
    },
  };
};

// Helper function to get image URL from Strapi media object
const getImageUrl = (mediaObject: any): string | null => {
  if (!mediaObject) {
    console.log("Media object is null or undefined");
    return null;
  }

  // NYTT: Håndter hvis mediaObject er et array (ta første element)
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
    // Hvis mediaObject er en direkte streng URL
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

    // NYTT: Håndter direkte filreferanse med navn og url
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

    // Sjekk for Strapi v4 struktur
    if (mediaObject.data && mediaObject.data.attributes) {
      const attributes = mediaObject.data.attributes;
      // Fjern /api fra slutten av URL-en hvis den er der
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const mediaBaseUrl = baseUrl.replace(/\/api\/?$/, "");

      if (attributes.url) {
        // Viktig: URL-en bør peke direkte til filen, ikke til API-endepunktet
        const url = attributes.url;
        let fullUrl = "";

        if (url.startsWith("http")) {
          fullUrl = url;
        } else {
          // Spesielt for Strapi-bilder - URL-en kan peke feil
          if (url.startsWith("/uploads/")) {
            fullUrl = `${mediaBaseUrl}${url}`;
          } else if (url.startsWith("uploads/")) {
            fullUrl = `${mediaBaseUrl}/${url}`;
          } else if (url.startsWith("/api/uploads/")) {
            // Direkte fiks for URL-er som starter med /api/uploads/
            fullUrl = `${mediaBaseUrl}${url.replace("/api", "")}`;
          } else {
            fullUrl = `${mediaBaseUrl}${url.startsWith("/") ? url : `/${url}`}`;
          }
        }

        console.log("Found URL in data.attributes.url:", fullUrl);
        return fullUrl;
      }

      // Sjekk formats
      if (attributes.formats) {
        const formats = attributes.formats;
        const formatToUse =
          formats.medium || formats.small || formats.thumbnail;

        if (formatToUse && formatToUse.url) {
          const url = formatToUse.url;
          // Samme korreksjon som ovenfor
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

    // Sjekk for direkte URL egenskap
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
  const router = useRouter();
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [events, setEvents] = useState<EventAttributes[]>([]);
  const [projects, setProjects] = useState<ProjectAttributes[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [introImageUrl, setIntroImageUrl] = useState<string | null>(null);

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
    intro: false,
  });

  // Handle project click
  const handleProjectClick = (id: number) => {
    router.push(`/aktiviteter/projects/${id}`);
  };

  // Handle event click
  const handleEventClick = (id: number) => {
    router.push(`/aktiviteter/events/${id}`);
  };

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

        // Logg rådata for introduksjonsbildet for debugging
        console.log(
          "Raw introduction image data:",
          transformedData.introduction.introductionImage
        );

        // Store the transformed data
        setPageData(transformedData);

        // Extract and process image URLs
        const heroImageUrl = getImageUrl(transformedData.hero.heroImage);
        console.log("Hero image URL:", heroImageUrl);
        console.log("Hero image type:", getImageType(heroImageUrl));

        const introImageUrl = getImageUrl(
          transformedData.introduction.introductionImage
        );
        console.log("Introduction image URL result:", introImageUrl);
        console.log("Introduction image type:", getImageType(introImageUrl));

        // Fiks URL-ene direkte hvis de inneholder "/api/uploads/"
        let fixedHeroUrl = heroImageUrl;
        let fixedIntroUrl = introImageUrl;

        if (heroImageUrl && heroImageUrl.includes("/api/uploads/")) {
          fixedHeroUrl = heroImageUrl.replace("/api/uploads/", "/uploads/");
          console.log("Fixed hero URL:", fixedHeroUrl);
        }

        if (introImageUrl && introImageUrl.includes("/api/uploads/")) {
          fixedIntroUrl = introImageUrl.replace("/api/uploads/", "/uploads/");
          console.log("Fixed intro URL:", fixedIntroUrl);
        }

        setHeroImageUrl(fixedHeroUrl);
        setIntroImageUrl(fixedIntroUrl);

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

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await eventsService.getAll({
          sort: ["startDate:asc"],
          populate: ["eventCardImage"],
          limit: 3, // Limit to 3 events for the landing page
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

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectData = await projectService.getAll({
          sort: ["createdAt:desc"],
          populate: "*",
          limit: 3, // Limit to 3 projects for the landing page
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

  // Handle image load errors
  const handleImageError = (
    imageType: "hero" | "intro",
    url: string | null
  ) => {
    console.error(
      `Image load error for ${imageType} image. URL attempted: ${url}`
    );

    // Try to fix the URL
    if (url) {
      console.log("Testing URL accessibility:", url);

      // Prøv å generere en alternativ URL for testing
      let correctedUrl: string = url;

      if (url.includes("/api/uploads/")) {
        correctedUrl = url.replace("/api/uploads/", "/uploads/");
        console.log("Created corrected URL:", correctedUrl);

        // Prøv den korrigerte URL-en
        if (imageType === "hero") {
          setHeroImageUrl(correctedUrl);
        } else {
          setIntroImageUrl(correctedUrl);
        }
      } else {
        // Hvis vi ikke kan korrigere URL-en, setter vi feilstatus
        setImageLoadError((prev) => ({
          ...prev,
          [imageType]: true,
        }));
      }
    } else {
      setImageLoadError((prev) => ({
        ...prev,
        [imageType]: true,
      }));
    }
  };

  // Debug log before render
  console.log("Render state:", {
    heroImageUrl,
    introImageUrl,
    heroImageType: getImageType(heroImageUrl),
    introImageType: getImageType(introImageUrl),
    imageLoadError,
    pageDataExists: !!pageData,
  });

  // Show loading state if any data is still loading
  if (loading.content || loading.events || loading.projects) {
    return <p className="text-center py-10">Laster innhold...</p>;
  }

  // Show error state if any errors occurred
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
              onError={() => handleImageError("hero", heroImageUrl)}
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

      {/* Introduction Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
        {/* Image section */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          {!imageLoadError.intro ? (
            <MediaRenderer
              url={introImageUrl}
              alt="Introduction Image"
              className="w-full h-full"
              objectFit="contain"
              onError={() => handleImageError("intro", introImageUrl)}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Kunne ikke laste bildet</p>
            </div>
          )}
        </div>

        {/* Text section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {pageData.introduction?.Title || "Mangler tittel"}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {pageData.introduction?.IntroductionText || "Mangler tekst"}
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary to-secondary/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prosjekter</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Se våre nyeste og pågående prosjekter
            </p>
          </div>

          {/* Projects Grid using UniversalCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <UniversalCard
                  key={project.id}
                  {...adaptProjectToCardProps(project, handleProjectClick)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">Ingen prosjekter funnet</p>
              </div>
            )}
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

          {/* Events Grid using UniversalCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <UniversalCard
                  key={event.id}
                  {...adaptEventToCardProps(event, handleEventClick)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">Ingen arrangementer funnet</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
