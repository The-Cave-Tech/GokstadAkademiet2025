"use client";

import React from "react";
import Image from "next/image";

// Typer som representerer data fra Strapi
type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

type TeamContent = {
  title: string;
  description: string;
  teamMembers: TeamMember[];
  callToAction: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
};

// Mockup-data som simulerer det som vil komme fra Strapi
const mockTeamContent: TeamContent = {
  title: "Vårt Team",
  description:
    "Vi er stolte av vårt dedikerte team av profesjonelle som arbeider utrettelig for å levere de beste produktene og tjenestene til våre kunder. Sammen kombinerer vi mange års erfaring, kreativitet og ekspertise.",
  teamMembers: [
    {
      id: 1,
      name: "Anne Hansen",
      role: "Administrerende Direktør",
      bio: "Anne har ledet selskapet siden starten i 2010. Med over 20 års erfaring i bransjen, bringer hun en unik kombinasjon av visjon og praktisk ekspertise.",
      imageUrl: "/images/team/anne-hansen.jpg",
    },
    {
      id: 2,
      name: "Per Olsen",
      role: "Teknisk Direktør",
      bio: "Per leder vår teknologiavdeling og har vært ansvarlig for mange av våre mest innovative produkter. Han har en bakgrunn innen datateknikk og har tidligere jobbet for ledende teknologiselskaper.",
      imageUrl: "/images/team/per-olsen.jpg",
    },
    {
      id: 3,
      name: "Kari Johansen",
      role: "Markedsdirektør",
      bio: "Kari har vært ansvarlig for å bygge vår merkevare og markedsføringsstrategi. Hennes kreative tilnærming har hjulpet oss med å nå ut til et bredere publikum.",
      imageUrl: "/images/team/kari-johansen.jpg",
    },
    {
      id: 4,
      name: "Lars Pedersen",
      role: "Økonomidirektør",
      bio: "Lars har solid erfaring innen finansiell planlegging og strategi. Under hans ledelse har selskapet oppnådd stabil vekst og økonomisk stabilitet.",
      imageUrl: "/images/team/lars-pedersen.jpg",
    },
  ],
  callToAction: {
    title: "Bli en del av teamet",
    description:
      "Vi er alltid på utkikk etter talentfulle og motiverte personer som kan bidra til vår fortsatte vekst og suksess. Se våre ledige stillinger og bli med på reisen vår.",
    buttonText: "Se Ledige Stillinger",
    buttonUrl: "/ledige-stillinger",
  },
};

const TeamSection: React.FC = () => {
  // I en faktisk implementasjon vil du hente data fra Strapi
  const content = mockTeamContent;

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {content.title}
          </h2>

          <p className="text-lg text-gray-700 mb-10">{content.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {content.teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.imageUrl}
                    alt={`Bilde av ${member.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {content.callToAction.title}
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              {content.callToAction.description}
            </p>
            <a
              href={content.callToAction.buttonUrl}
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-200"
            >
              {content.callToAction.buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
