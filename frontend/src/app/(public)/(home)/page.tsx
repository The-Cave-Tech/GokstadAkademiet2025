"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";
import { eventsService } from "@/lib/data/services/eventService";
import { projectService } from "@/lib/data/services/projectService";
import ClientMessage from "@/components/ClientMessage";
import { EventAttributes } from "@/types/content.types";

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

interface Project {
  id: number;
  title: string;
  description: string;
  projectImage?: string | null;
  link?: string | null;
}

export default function LandingPageContent() {
  const [content, setContent] = useState<LandingPageData | null>(null);
  const [events, setEvents] = useState<EventAttributes[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
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

      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Kommende Eventer
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition"
                >
                  {event.eventCardImage ? (
                    <div className="relative h-40 w-full rounded-md overflow-hidden mb-4">
                      <Image
                        src={
                          event.eventCardImage.url.startsWith("http")
                            ? event.eventCardImage.url
                            : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${event.eventCardImage.url}`
                        }
                        alt={event.title || "Event Image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center mb-4">
                      <span className="text-gray-400 text-sm">Ingen bilde</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {event.Description || "Ingen beskrivelse tilgjengelig"}
                  </p>
                  <span className="text-gray-500 text-sm">
                    Startdato: {event.startDate || "Ukjent startdato"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Ingen kommende eventer
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Prosjekter
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition"
                >
                  {project.projectImage ? (
                    <div className="relative h-40 w-full rounded-md overflow-hidden mb-4">
                      <Image
                        src={project.projectImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center mb-4">
                      <span className="text-gray-400 text-sm">Ingen bilde</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description || "Ingen beskrivelse tilgjengelig"}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Besøk prosjekt
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Ingen prosjekter tilgjengelig
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
