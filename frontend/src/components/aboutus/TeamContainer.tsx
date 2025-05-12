"use client";

import React, { useEffect, useState } from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import TeamSection, { TeamMember } from "./TeamSection";

// Definere typene for Strapi-responsen
interface StrapiTeamCardItem {
  id: number;
  attributes: {
    name: string;
    role: string;
    email: string;
    phoneNumber: string;
    image: {
      data?: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
          formats?: {
            thumbnail?: { url: string };
            small?: { url: string };
            medium?: { url: string };
            large?: { url: string };
          };
        };
      };
    };
  };
}

// Definer mulige Strapi responsstrukturer
interface StrapiAboutUsResponse {
  data: {
    id: number;
    attributes?: {
      title?: string;
      text?: string;
      teamCard?: {
        data: StrapiTeamCardItem[] | null;
      };
    };
    title?: string;
    text?: string;
    teamCard?: StrapiTeamCardItem[] | null;
  };
  meta: any;
}

export default function TeamContainer() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [title, setTitle] = useState<string>("Vårt Team");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await strapiService.fetch<StrapiAboutUsResponse>(
          "about-us",
          {
            params: {
              populate: "teamCard.image",
            },
          }
        );

        // Default til tom array (vil fylles hvis vi finner data)
        let foundMembers: TeamMember[] = [];
        let teamMembersFound = false;

        // Sjekk først om data-strukturen ligner på history-strukturen
        if (response.data?.teamCard && Array.isArray(response.data.teamCard)) {
          // Dette er samme struktur som history i HistoryContainer
          const teamData = response.data.teamCard as unknown as TeamMember[];
          foundMembers = teamData;
          teamMembersFound = true;

          // Sett eventuell tittel og beskrivelse
          if (response.data.title) setTitle(response.data.title);
          if (response.data.text) setDescription(response.data.text);
        }
        // Sjekk for teamCard.data-strukturen
        else if (
          response.data?.attributes?.teamCard?.data &&
          Array.isArray(response.data.attributes.teamCard.data)
        ) {
          const teamCardData = response.data.attributes.teamCard.data;

          // Transformer dataene til TeamMember-format
          const members: TeamMember[] = teamCardData.map(
            (item: StrapiTeamCardItem) => {
              const attrs = item.attributes;

              // Extract image data
              let imageData: any[] = [];
              if (attrs.image?.data) {
                const imgData = attrs.image.data;

                if (imgData?.attributes) {
                  imageData = [
                    {
                      id: imgData.id,
                      url: imgData.attributes.url,
                      alternativeText: imgData.attributes.alternativeText || "",
                      formats: imgData.attributes.formats || {},
                    },
                  ];
                }
              }

              return {
                id: item.id,
                name: attrs.name || "",
                role: attrs.role || "",
                email: attrs.email || "",
                phoneNumber: String(attrs.phoneNumber || ""),
                image: imageData,
              };
            }
          );

          if (members.length > 0) {
            foundMembers = members;
            teamMembersFound = true;
          }

          // Sett eventuell tittel og beskrivelse
          if (response.data.attributes?.title) {
            setTitle(response.data.attributes.title);
          }

          if (response.data.attributes?.text) {
            setDescription(response.data.attributes.text);
          }
        }

        // Sett team-medlemmer
        setTeamMembers(foundMembers);

        // Sett feilmelding hvis vi ikke fant noen medlemmer
        if (!teamMembersFound) {
          setError(
            "Ingen team-data funnet. Legg til teammedlemmer i Strapi admin-panelet."
          );
        }
      } catch (error: any) {
        setError(
          `Kunne ikke hente team-data: ${error.message || "Ukjent feil"}`
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg shadow p-6">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 mt-4">Laster team-innhold...</p>
      </div>
    );
  }

  // Vis feilmelding hvis vi har en feil
  if (error && teamMembers.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          {description && (
            <p className="text-lg text-gray-700 mb-10">{description}</p>
          )}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-auto max-w-4xl mb-4">
            <p className="text-yellow-700">{error}</p>
          </div>
          <p className="text-gray-500 mt-4">
            For å legge til team-medlemmer, gå til Strapi admin-panelet, åpne
            'About Us' single type, og legg til innhold i teamCard-komponenten
            med bilder.
          </p>
        </div>
      </div>
    );
  }

  // Vanlig rendering med team-medlemmer
  return (
    <TeamSection
      title={title}
      description={description}
      teamMembers={teamMembers}
    />
  );
}
