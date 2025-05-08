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

        const heroComponent = response.data.Hero;
        const hero = {
          title: heroComponent?.Title || "Mangler tittel",
          subtitle: heroComponent?.Subtitle || "Mangler undertittel",
        };

        // Get hero image using enhanced error handling
        let heroImageUrl = null;
        const heroImage = response.data.HeroImage;
        if (strapiService.media.isValidMedia(heroImage)) {
          try {
            heroImageUrl = strapiService.media.getMediaUrl(heroImage);
            // Add a cache-busting parameter to avoid cached 404 responses
            if (heroImageUrl) {
              heroImageUrl = `${heroImageUrl}?t=${Date.now()}`;
            }
          } catch (err) {
            console.error("Error processing hero image:", err);
          }
        }

        // Get intro image using enhanced error handling
        let introImageUrl = null;
        const introImage = response.data.IntroductionImage;
        if (strapiService.media.isValidMedia(introImage)) {
          try {
            introImageUrl = strapiService.media.getMediaUrl(introImage);
            // Add a cache-busting parameter to avoid cached 404 responses
            if (introImageUrl) {
              introImageUrl = `${introImageUrl}?t=${Date.now()}`;
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

  // Handle image load errors
  const handleImageError = (imageType: "hero" | "intro") => {
    setImageLoadError((prev) => ({
      ...prev,
      [imageType]: true,
    }));
    console.error(`Failed to load ${imageType} image`);
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
            <Image
              src={content.hero.imageUrl}
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
            <Image
              src={content.introduction.imageUrl}
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
