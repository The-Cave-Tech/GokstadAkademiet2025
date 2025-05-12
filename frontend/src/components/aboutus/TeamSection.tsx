"use client";

import React from "react";
import Image from "next/image";

// Forenklet TypeScript-type som nøyaktig matcher din Strapi-modell
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  image: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
}

// Helper-funksjoner for å håndtere Strapi-medier
export function getStrapiImageUrl(imageArray: any): string {
  // Sjekk om det er et array
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    const image = imageArray[0];

    // Lag full URL
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    const strapiBaseUrl = baseUrl.replace(/\/api$/, "");

    // Bruk medium format hvis tilgjengelig, ellers original URL
    let imageUrl = "";
    if (image.formats && image.formats.medium) {
      imageUrl = image.formats.medium.url;
    } else {
      imageUrl = image.url;
    }

    // Sikre at URL-en har komplett domene
    if (imageUrl.startsWith("/")) {
      imageUrl = `${strapiBaseUrl}${imageUrl}`;
    }

    return imageUrl;
  }

  return "/images/placeholder.jpg"; // Fallback
}

export function getStrapiImageAlt(imageArray: any): string {
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    return imageArray[0].alternativeText || "";
  }
  return "";
}

interface TeamSectionProps {
  title: string;
  description: string;
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  title = "Vårt Team",
  description = "",
  teamMembers = [],
}) => {
  // Sikre at teamMembers er et array
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

  if (!safeTeamMembers || safeTeamMembers.length === 0) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          {description && (
            <p className="text-lg text-center text-gray-700 mb-10">
              {description}
            </p>
          )}
          <p>Ingen teammedlemmer tilgjengelig</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {title}
          </h2>

          {description && (
            <p className="text-lg text-center text-gray-700 mb-10">
              {description}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {safeTeamMembers.map((member, index) => (
              <div
                key={member.id || index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ width: "482px", height: "212px" }}
              >
                <div className="flex h-full">
                  {/* Bilde - venstre side */}
                  <div className="flex items-center">
                    {member.image && member.image.length > 0 ? (
                      <div
                        className="relative"
                        style={{ height: "193px", width: "197px" }}
                      >
                        <Image
                          src={getStrapiImageUrl(member.image)}
                          alt={
                            getStrapiImageAlt(member.image) ||
                            `Bilde av ${member.name}`
                          }
                          fill
                          sizes="197px"
                          priority={index < 2}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center bg-gray-200"
                        style={{ height: "193px", width: "197px" }}
                      >
                        <span className="text-gray-400 text-5xl">👤</span>
                      </div>
                    )}
                  </div>

                  {/* Informasjon - høyre side */}
                  <div className="p-4 flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-black font-medium mb-3">{member.role}</p>
                    <div className="text-black text-sm">
                      {member.email && (
                        <p className="mb-1">
                          <span className="font-medium">E-post:</span>{" "}
                          <a
                            href={`mailto:${member.email}`}
                            className="text-black hover:underline break-words"
                          >
                            {member.email}
                          </a>
                        </p>
                      )}
                      {member.phoneNumber && (
                        <p>
                          <span className="font-medium">Telefon:</span>{" "}
                          <a
                            href={`tel:${member.phoneNumber}`}
                            className="text-black hover:underline"
                          >
                            {member.phoneNumber}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
