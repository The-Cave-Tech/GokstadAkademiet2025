// app/home/page.tsx
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
    title: string;
    subtitle: string;
    imageUrl: string | null;
  };
  introduction: {
    title: string;
    text: string;
    imageUrl: string | null;
  };
}

// Helper function to ensure image URLs are properly formed
const ensureFullUrl = (url: string): string => {
  if (url.startsWith("http")) {
    return url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

// Default placeholder image path - make sure this file exists in your public folder
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

export default function LandingPageContent() {
  const [content, setContent] = useState<LandingPageData | null>(null);
  const [events, setEvents] = useState<EventAttributes[]>([]);
  const [projects, setProjects] = useState<ProjectAttributes[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorContent, setErrorContent] = useState<string | null>(null);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{
    hero: boolean;
    intro: boolean;
  }>({ hero: false, intro: false });

  // Debug function that returns a string (never null) to satisfy TypeScript
  const debugImageUrl = (imageUrl: string | null, type: string): string => {
    console.log(`DEBUG ${type} image URL:`, imageUrl);
    // Return the actual URL or a placeholder to satisfy TypeScript
    return imageUrl || PLACEHOLDER_IMAGE;
  };

  useEffect(() => {
    async function getLandingPageData() {
      try {
        // Use strapiService.single for single type content
        const landingPage = strapiService.single("landing-page");
        const response = await landingPage.find({
          populate: "*",
        });

        if (!response.data) {
          throw new Error("Ingen 'data' funnet i Strapi-respons");
        }

        console.log("Full Strapi response:", response.data);

        const heroComponent = response.data.Hero;
        const hero = {
          title: heroComponent?.Title || "Mangler tittel",
          subtitle: heroComponent?.Subtitle || "Mangler undertittel",
        };

        // Get hero image using enhanced error handling
        let heroImageUrl = null;
        const heroImage = response.data.HeroImage;
        console.log("Raw hero image data:", heroImage);

        if (heroImage && typeof heroImage === "object") {
          try {
            // First check if we're dealing with a valid media object with new Strapi structure
            if (heroImage.data && heroImage.data.attributes) {
              // Directly access the URL from the attributes
              const urlPath = heroImage.data.attributes.url;
              if (urlPath) {
                // Build the full URL with base URL if needed
                heroImageUrl = ensureFullUrl(urlPath);

                // Add a cache-busting parameter
                heroImageUrl = `${heroImageUrl}?t=${Date.now()}`;
                console.log("Hero image URL built directly:", heroImageUrl);
              }
            }
            // Try the helper method as fallback
            else if (strapiService.media.isValidMedia(heroImage)) {
              heroImageUrl = strapiService.media.getMediaUrl(heroImage);
              if (heroImageUrl) {
                heroImageUrl = `${heroImageUrl}?t=${Date.now()}`;
                console.log("Hero image URL from helper:", heroImageUrl);
              }
            }
            // Try the old structure directly
            else if (heroImage.url) {
              heroImageUrl = ensureFullUrl(heroImage.url);
              heroImageUrl = `${heroImageUrl}?t=${Date.now()}`;
              console.log(
                "Hero image URL from direct url property:",
                heroImageUrl
              );
            }
          } catch (err) {
            console.error("Error processing hero image:", err);
          }
        }

        // Get intro image using enhanced error handling
        let introImageUrl = null;
        const introImage = response.data.IntroductionImage;
        console.log("Raw intro image data:", introImage);

        if (introImage && typeof introImage === "object") {
          try {
            // First check if we're dealing with a valid media object with new Strapi structure
            if (introImage.data && introImage.data.attributes) {
              // Directly access the URL from the attributes
              const urlPath = introImage.data.attributes.url;
              if (urlPath) {
                // Build the full URL with base URL if needed
                introImageUrl = ensureFullUrl(urlPath);

                // Add a cache-busting parameter
                introImageUrl = `${introImageUrl}?t=${Date.now()}`;
                console.log("Intro image URL built directly:", introImageUrl);
              }
            }
            // Try the helper method as fallback
            else if (strapiService.media.isValidMedia(introImage)) {
              introImageUrl = strapiService.media.getMediaUrl(introImage);
              if (introImageUrl) {
                introImageUrl = `${introImageUrl}?t=${Date.now()}`;
                console.log("Intro image URL from helper:", introImageUrl);
              }
            }
            // Try the old structure directly
            else if (introImage.url) {
              introImageUrl = ensureFullUrl(introImage.url);
              introImageUrl = `${introImageUrl}?t=${Date.now()}`;
              console.log(
                "Intro image URL from direct url property:",
                introImageUrl
              );
            }
          } catch (err) {
            console.error("Error processing intro image:", err);
          }
        }

        const introduction = {
          title: response.data.intoductionTitle || "Mangler tittel",
          text: response.data.introductionText || "Mangler tekst",
          imageUrl: introImageUrl,
        };

        setContent({ hero: { ...hero, imageUrl: heroImageUrl }, introduction });
        setErrorContent(null);
      } catch (err) {
        setErrorContent(
          "Klarte ikke å hente data: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
        console.error("Error fetching landing page data:", err);
      } finally {
        setLoadingContent(false);
      }
    }

    getLandingPageData();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true);
      try {
        const eventsData = await eventsService.getAll({
          sort: ["startDate:asc"],
          populate: ["eventCardImage"],
        });
        setEvents(eventsData);
        setErrorEvents(null);
      } catch (err) {
        setErrorEvents(
          "Klarte ikke å hente eventer: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const projectData = await projectService.getAll({
          sort: ["createdAt:desc"],
          populate: "*", // Make sure to populate all fields for better display
        });
        setProjects(projectData);
        setErrorProjects(null);
      } catch (err) {
        setErrorProjects(
          "Klarte ikke å hente prosjekter: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  // Handle image load errors with improved logging
  const handleImageError = (imageType: "hero" | "intro") => {
    console.error(`Image load error for ${imageType} image`);
    setImageLoadError((prev) => ({
      ...prev,
      [imageType]: true,
    }));
  };

  if (loadingContent || loadingEvents || loadingProjects) {
    return <p className="text-center py-10">Laster innhold...</p>;
  }

  if (errorContent || errorEvents || errorProjects || !content) {
    return (
      <div className="text-center text-red-500 py-10">
        {errorContent ||
          errorEvents ||
          errorProjects ||
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
          {content.hero.imageUrl && !imageLoadError.hero ? (
            <>
              {console.log("Rendering hero image:", content.hero.imageUrl)}
              <Image
                src={debugImageUrl(content.hero.imageUrl, "hero")}
                alt="Hero Background Image"
                fill
                className="object-cover opacity-50"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
                onError={() => {
                  console.error(
                    "Hero image failed to load:",
                    content.hero.imageUrl
                  );
                  handleImageError("hero");
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            {content.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Introduction Section - Image moved to the left */}
      <section className="py-16 px-4 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
        {/* Image section - now first in the grid order */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          {content.introduction.imageUrl && !imageLoadError.intro ? (
            <>
              {console.log(
                "Rendering intro image:",
                content.introduction.imageUrl
              )}
              <Image
                src={debugImageUrl(content.introduction.imageUrl, "intro")}
                alt="Introduction Image"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                onError={() => {
                  console.error(
                    "Intro image failed to load:",
                    content.introduction.imageUrl
                  );
                  handleImageError("intro");
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Bilde mangler</p>
            </div>
          )}
        </div>

        {/* Text section - now second in the grid order */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {content.introduction.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {content.introduction.text}
          </p>
        </div>
      </section>

      {/* Projects Section - Now with Carousel */}
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

      {/* Events Section - Vertical Layout with exact dimensions */}
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
