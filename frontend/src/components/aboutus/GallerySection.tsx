"use client";

import React, { useState } from "react";
import Image from "next/image";

// Typer for data fra Strapi
type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category: string;
};

type GalleryCategory = {
  id: string;
  name: string;
};

type GallerySocialMedia = {
  id: number;
  name: string;
  icon: string;
  url: string;
  bgColor: string;
  hoverColor: string;
};

type GalleryContent = {
  title: string;
  description: string;
  categories: GalleryCategory[];
  images: GalleryImage[];
  footerText: string;
  socialMedia: GallerySocialMedia[];
};

// Mockup-data som simulerer det som vil komme fra Strapi
const mockGalleryContent: GalleryContent = {
  title: "Vårt Galleri",
  description:
    "Ta en titt på noen øyeblikk fra vår reise. Dette galleriet gir et innblikk i våre lokaler, arrangementer, produkter og mer.",
  categories: [
    { id: "alle", name: "Alle" },
    { id: "lokaler", name: "Våre lokaler" },
    { id: "arrangementer", name: "Arrangementer" },
    { id: "produkter", name: "Produkter" },
    { id: "samfunnsansvar", name: "Samfunnsansvar" },
    { id: "utmerkelser", name: "Utmerkelser" },
  ],
  images: [
    {
      id: 1,
      src: "/images/gallery/office-1.jpg",
      alt: "Vårt hovedkontor i Oslo",
      caption: "Vårt moderne hovedkontor i Oslo sentrum",
      category: "lokaler",
    },
    {
      id: 2,
      src: "/images/gallery/team-event-1.jpg",
      alt: "Teambyggingsaktivitet",
      caption: "Teambyggingsdag 2024",
      category: "arrangementer",
    },
    {
      id: 3,
      src: "/images/gallery/product-1.jpg",
      alt: "Vår nyeste produktlinje",
      caption: "Lansering av vår nyeste produktserie",
      category: "produkter",
    },
    {
      id: 4,
      src: "/images/gallery/office-2.jpg",
      alt: "Møterom",
      caption: "Vårt kreative møterom",
      category: "lokaler",
    },
    {
      id: 5,
      src: "/images/gallery/team-event-2.jpg",
      alt: "Sommerfest",
      caption: "Sommerfest 2023",
      category: "arrangementer",
    },
    {
      id: 6,
      src: "/images/gallery/product-2.jpg",
      alt: "Produktdemonstrasjon",
      caption: "Produktdemonstrasjon for kunder",
      category: "produkter",
    },
    {
      id: 7,
      src: "/images/gallery/community-1.jpg",
      alt: "Veldedighetsarrangement",
      caption: "Innsamlingsarrangement for lokalt samfunn",
      category: "samfunnsansvar",
    },
    {
      id: 8,
      src: "/images/gallery/award-1.jpg",
      alt: "Bransjepris",
      caption: "Mottakelse av innovasjonspris 2023",
      category: "utmerkelser",
    },
    {
      id: 9,
      src: "/images/gallery/community-2.jpg",
      alt: "Miljøinitiativ",
      caption: "Vårt team deltar i strandrydding",
      category: "samfunnsansvar",
    },
  ],
  footerText:
    "Galleriet vårt oppdateres jevnlig med nye bilder fra våre aktiviteter, prosjekter og viktige øyeblikk. Følg oss på sosiale medier for å se mer fra vår hverdag.",
  socialMedia: [
    {
      id: 1,
      name: "Facebook",
      icon: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>`,
      url: "https://facebook.com/",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      id: 2,
      name: "Instagram",
      icon: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`,
      url: "https://instagram.com/",
      bgColor: "bg-pink-600",
      hoverColor: "hover:bg-pink-700",
    },
    {
      id: 3,
      name: "Twitter",
      icon: `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>`,
      url: "https://twitter.com/",
      bgColor: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
    },
    {
      id: 4,
      name: "LinkedIn",
      icon: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>`,
      url: "https://linkedin.com/",
      bgColor: "bg-blue-800",
      hoverColor: "hover:bg-blue-900",
    },
  ],
};

const GallerySection: React.FC = () => {
  // I faktisk implementasjon vil dette komme fra en Strapi API-forespørsel
  const content = mockGalleryContent;

  const [selectedCategory, setSelectedCategory] = useState<string>("alle");

  const filteredImages =
    selectedCategory === "alle"
      ? content.images
      : content.images.filter((image) => image.category === selectedCategory);

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {content.title}
          </h2>

          <p className="text-lg text-gray-700 mb-8">{content.description}</p>

          {/* Kategorifiltre */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {content.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedCategory === category.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Bildegalleri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ikke nok bilder-melding */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Ingen bilder funnet i denne kategorien ennå. Prøv en annen
                kategori.
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-lg text-gray-700 mb-6">{content.footerText}</p>
            <div className="flex justify-center gap-4">
              {content.socialMedia.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  className={`p-3 ${social.bgColor} text-white rounded-full ${social.hoverColor}`}
                  aria-label={social.name}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: social.icon }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
