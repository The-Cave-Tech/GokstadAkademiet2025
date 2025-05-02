"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";
import { eventsService } from "@/lib/data/services/eventService";
import { projectService } from "@/lib/data/services/projectService";
import ClientMessage from "@/components/ClientMessage";
import { EventAttributes, ProjectAttributes } from "@/types/content.types";
import { ProjectCard } from "@/components/dashboard/contentManager/ProjectCard";
import { EventCard } from "@/components/dashboard/contentManager/EventCard";

interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
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

  useEffect(() => {
    async function getLandingPageData() {
      try {
        const response = await fetchStrapiData("/api/landing-page?populate=*");

        if (!response.data) {
          throw new Error("Ingen 'data' funnet i Strapi-respons");
        }

        const heroComponent = response.data.Hero;
        const hero = {
          title: heroComponent?.Title || "Mangler tittel",
          subtitle: heroComponent?.Subtitle || "Mangler undertittel",
        };

        const introImage = response.data.IntroductionImage;
        let imageUrl: string | null = null;
        if (introImage?.url) {
          imageUrl = introImage.url.startsWith("http")
            ? introImage.url
            : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${introImage.url}`;
        }

        const introduction = {
          title: response.data.intoductionTitle || "Mangler tittel",
          text: response.data.introductionText || "Mangler tekst",
          imageUrl,
        };

        setContent({ hero, introduction });
        setErrorContent(null);
      } catch (err) {
        setErrorContent(
          "Klarte ikke å hente data: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
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
        });
        setProjects(projectData);
        setErrorProjects(null);
      } catch (err) {
        setErrorProjects(
          "Klarte ikke å hente prosjekter: " +
            (err instanceof Error ? err.message : "Ukjent feil")
        );
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

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
      <section className="relative text-center py-20 px-4 bg-gray-900 text-white">
        <ClientMessage />
        <div className="absolute inset-0 z-0">
          {content.introduction.imageUrl ? (
            <Image
              src={content.introduction.imageUrl}
              alt="Landing Image"
              fill
              className="object-cover opacity-50"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
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

      <section className="py-16 px-4 max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {content.introduction.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed">
            {content.introduction.text}
          </p>
        </div>
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          {content.introduction.imageUrl ? (
            <Image
              src={content.introduction.imageUrl}
              alt="Introduction Image"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Bilde mangler</p>
            </div>
          )}
        </div>
      </section>

      <section className="flex py-20 px-4 bg-secondary gap-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Prosjekter
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Ingen prosjekter funnet
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Arrangementer
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-center text-gray-500">
                Ingen arrangementer funnet
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
