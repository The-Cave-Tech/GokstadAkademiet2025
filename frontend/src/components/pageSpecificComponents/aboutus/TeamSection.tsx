"use client";

import React from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

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

export function getStrapiImageUrl(imageArray: any): string {
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    const image = imageArray[0];
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    const strapiBaseUrl = baseUrl.replace(/\/api$/, "");

    let imageUrl = "";
    if (image.formats && image.formats.medium) {
      imageUrl = image.formats.medium.url;
    } else {
      imageUrl = image.url;
    }

    if (imageUrl.startsWith("/")) {
      imageUrl = `${strapiBaseUrl}${imageUrl}`;
    }

    return imageUrl;
  }

  return "/images/placeholder.jpg";
}

export function getStrapiImageAlt(imageArray: any): string {
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    return imageArray[0].alternativeText || "";
  }
  return "";
}

interface TeamSectionProps {
  description?: string;
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  description = "",
  teamMembers = [],
}) => {
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];

  if (!safeTeamMembers || safeTeamMembers.length === 0) {
    return (
      <section className={`w-full py-12 bg-white ${roboto.className}`}>
        <div className="container mx-auto px-4 md:px-6 text-center">
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
    <section className={`w-full py-12 bg-white ${roboto.className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {description && (
            <p className="text-lg text-center text-gray-700 mb-10">
              {description}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {safeTeamMembers.map((member, index) => {
              const cleanNumber = member.phoneNumber.replace(/\D/g, "");
              const numberOnly = cleanNumber.startsWith("47")
                ? cleanNumber
                : `47${cleanNumber}`;
              const formatted =
                numberOnly.length === 10
                  ? `+47 ${numberOnly.slice(2, 5)} ${numberOnly.slice(
                      5,
                      7
                    )} ${numberOnly.slice(7, 10)}`
                  : `+${numberOnly}`;
              const telLink = `+${numberOnly}`;

              return (
                <div
                  key={member.id || index}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ width: "482px" }}
                >
                  <div className="flex">
                    {/* Bilde - venstre side */}
                    <div className="flex items-center">
                      {member.image && member.image.length > 0 ? (
                        <div className="h-auto w-48">
                          <img
                            src={getStrapiImageUrl(member.image)}
                            alt={
                              getStrapiImageAlt(member.image) ||
                              `Bilde av ${member.name}`
                            }
                            className="object-cover w-full h-auto"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center bg-gray-200 w-48 h-full">
                          <span className="text-gray-400 text-5xl">👤</span>
                        </div>
                      )}
                    </div>

                    {/* Informasjon - høyre side */}
                    <div className="p-4 pl-6 flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-black font-light italic mb-3">
                        {member.role}
                      </p>
                      <div className="text-black text-sm">
                        {member.email && (
                          <p className="mb-1">
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
                            <a
                              href={`tel:${telLink}`}
                              className="text-black hover:underline"
                            >
                              {formatted}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
