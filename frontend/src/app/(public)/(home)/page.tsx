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

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

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
  console.log("Introduction image object:", introductionComponent.introductionImage);

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

    // Sjekk for Strapi v4 struktur
    if (mediaObject.data && mediaObject.data.attributes) {
      const attributes = mediaObject.data.attributes;
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";

      if (attributes.url) {
        // Viktig: URL-en bør peke direkte til filen, ikke til API-endepunktet
        // Fjern "api/" fra banen hvis den ikke skal være der
        const url = attributes.url;
        let fullUrl = "";

        if (url.startsWith("http")) {
          fullUrl = url;
        } else {
          // Spesielt for Strapi-bilder - URL-en kan peke feil
          // Vi fikser dette ved å erstatte "/api/uploads/" med "/uploads/"
          if (url.startsWith("/api/uploads/")) {
            const correctedUrl = url.replace("/api/uploads/", "/uploads/");
            fullUrl = `${baseUrl}${correctedUrl}`;
          } else {
            fullUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
          }
        }

        console.log("Found URL in data.attributes.url (corrected):", fullUrl);
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
            if (url.startsWith("/api/uploads/")) {
              const correctedUrl = url.replace("/api/uploads/", "/uploads/");
              fullUrl = `${baseUrl}${correctedUrl}`;
            } else {
              fullUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
            }
          }

          console.log("Found URL in formats (corrected):", fullUrl);
          return fullUrl;
        }
      }
    }

    // Sjekk for direkte URL egenskap
    if (mediaObject.url) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      let fullUrl = "";

      if (mediaObject.url.startsWith("http")) {
        fullUrl = mediaObject.url;
      } else {
        if (mediaObject.url.startsWith("/api/uploads/")) {
          const correctedUrl = mediaObject.url.replace(
            "/api/uploads/",
            "/uploads/"
          );
          fullUrl = `${baseUrl}${correctedUrl}`;
        } else {
          fullUrl = `${baseUrl}${
            mediaObject.url.startsWith("/")
              ? mediaObject.url
              : `/${mediaObject.url}`
          }`;
        }
      }

      console.log("Found direct URL property (corrected):", fullUrl);
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

  // Fetch landing page data
  // Inne i useEffect:
  useEffect(() => {
    async function getLandingPageData() {
      try {
        const landingPage = strapiService.single("landing-page");

        const response = await landingPage.find({
          populate: {
            hero: {
              populate: "*",
            },
            introduction: {
              populate: {
                introductionImage: {
                  populate: "*",
                },
              },
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

        // Extract and process image URLs
        const heroImageUrl = getImageUrl(transformedData.hero.heroImage);
        console.log("Hero image URL:", heroImageUrl);

        const introImageUrl = getImageUrl(
          transformedData.introduction.introductionImage
        );
        console.log("Intro image URL:", introImageUrl);

        setHeroImageUrl(heroImageUrl);
        setIntroImageUrl(introImageUrl);

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

    // Try to fetch the image directly to see if it's accessible
    if (url) {
      console.log("Testing URL accessibility:", url);

      // Test with corrected URL (fjerne 'api' fra banen)
      const correctedUrl = url.replace("api/uploads", "uploads");
      console.log("Also testing corrected URL:", correctedUrl);

      fetch(url, { method: "HEAD" })
        .then((response) => {
          console.log(
            `Image URL ${url} fetch status: ${response.status} ${response.statusText}`
          );
          if (response.status !== 200 && url !== correctedUrl) {
            // Prøv den korrigerte URL-en hvis originalen feiler
            fetch(correctedUrl, { method: "HEAD" })
              .then((correctedResponse) => {
                console.log(
                  `Corrected URL ${correctedUrl} fetch status: ${correctedResponse.status} ${correctedResponse.statusText}`
                );

                // Om den korrigerte URL-en fungerer, oppdaterer vi state
                if (correctedResponse.status === 200) {
                  console.log("Corrected URL works, updating...");
                  if (imageType === "hero") {
                    setHeroImageUrl(correctedUrl);
                  } else {
                    setIntroImageUrl(correctedUrl);
                  }
                  return; // Ikke sett feiltilstand siden vi fikset URL-en
                } else {
                  setImageLoadError((prev) => ({
                    ...prev,
                    [imageType]: true,
                  }));
                }
              })
              .catch((err) => {
                console.error(
                  `Failed to fetch corrected URL ${correctedUrl}:`,
                  err
                );
                setImageLoadError((prev) => ({
                  ...prev,
                  [imageType]: true,
                }));
              });
          } else {
            // Originalen fungerte, eller vi kan ikke korrigere
            if (response.status !== 200) {
              setImageLoadError((prev) => ({
                ...prev,
                [imageType]: true,
              }));
            }
          }
        })
        .catch((err) => {
          console.error(`Failed to fetch image URL ${url}:`, err);
          // Prøv korrigert URL om originalen krasjer
          if (url !== correctedUrl) {
            fetch(correctedUrl, { method: "HEAD" })
              .then((correctedResponse) => {
                console.log(
                  `Corrected URL ${correctedUrl} fetch status: ${correctedResponse.status} ${correctedResponse.statusText}`
                );

                // Om den korrigerte URL-en fungerer, oppdaterer vi state
                if (correctedResponse.status === 200) {
                  console.log(
                    "Corrected URL works after original fetch error, updating..."
                  );
                  if (imageType === "hero") {
                    setHeroImageUrl(correctedUrl);
                  } else {
                    setIntroImageUrl(correctedUrl);
                  }
                  return; // Ikke sett feiltilstand siden vi fikset URL-en
                } else {
                  setImageLoadError((prev) => ({
                    ...prev,
                    [imageType]: true,
                  }));
                }
              })
              .catch((err) => {
                console.error(
                  `Failed to fetch corrected URL ${correctedUrl}:`,
                  err
                );
                setImageLoadError((prev) => ({
                  ...prev,
                  [imageType]: true,
                }));
              });
          } else {
            setImageLoadError((prev) => ({
              ...prev,
              [imageType]: true,
            }));
          }
        });
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
          {heroImageUrl && !imageLoadError.hero ? (
            <Image
              src={heroImageUrl}
              alt="Hero Background Image"
              fill
              className="object-cover opacity-50"
              priority
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
              onError={() => handleImageError("hero", heroImageUrl)}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <p className="text-white opacity-70">
                {heroImageUrl ? `Kunne ikke laste bildet` : `Bilde mangler`}
              </p>
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
          {introImageUrl && !imageLoadError.intro ? (
            <Image
              src={introImageUrl}
              alt="Introduction Image"
              fill
              className="object-cover"
              priority
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              onError={() => handleImageError("intro", introImageUrl)}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">
                {introImageUrl ? `Kunne ikke laste bildet` : "Bilde mangler"}
              </p>
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
