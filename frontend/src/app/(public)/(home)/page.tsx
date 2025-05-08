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
  return {
    hero: {
      Title: responseData.hero?.Title || "",
      Subtitle: responseData.hero?.Subtitle || "",
      heroImage: responseData.hero?.heroImage || null,
    },
    introduction: {
      Title: responseData.introduction?.Title || "",
      IntroductionText: responseData.introduction?.IntroductionText || "",
      introductionImage: responseData.introduction?.introductionImage || null,
    },
  };
};

// Helper function to get image URL from Strapi media object
const getImageUrl = (mediaObject: any): string | null => {
  if (!mediaObject) return null;

  try {
    // Check for new Strapi structure (v4)
    if (
      mediaObject.data &&
      mediaObject.data.attributes &&
      mediaObject.data.attributes.url
    ) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      const url = mediaObject.data.attributes.url;
      return url.startsWith("http")
        ? url
        : `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
    }

    // Try using the helper if available
    if (
      strapiService.media &&
      typeof strapiService.media.getMediaUrl === "function" &&
      strapiService.media.isValidMedia(mediaObject)
    ) {
      return strapiService.media.getMediaUrl(mediaObject);
    }

    // Legacy structure
    if (mediaObject.url) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";
      return mediaObject.url.startsWith("http")
        ? mediaObject.url
        : `${baseUrl}${
            mediaObject.url.startsWith("/")
              ? mediaObject.url
              : `/${mediaObject.url}`
          }`;
    }
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
  useEffect(() => {
    async function getLandingPageData() {
      try {
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

        console.log("Strapi response:", response.data);

        // Transform the response data to match our LandingPageData interface
        const transformedData = transformResponseToPageData(response.data);

        // Store the transformed data
        setPageData(transformedData);

        // Extract and process image URLs
        const heroImageUrl = getImageUrl(transformedData.hero.heroImage);
        const introImageUrl = getImageUrl(
          transformedData.introduction.introductionImage
        );

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
  const handleImageError = (imageType: "hero" | "intro") => {
    console.error(`Image load error for ${imageType} image`);
    setImageLoadError((prev) => ({
      ...prev,
      [imageType]: true,
    }));
  };

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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
              onError={() => handleImageError("hero")}
            />
          ) : (
            <div className="w-full h-full bg-gray-700" />
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              onError={() => handleImageError("intro")}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Bilde mangler</p>
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
