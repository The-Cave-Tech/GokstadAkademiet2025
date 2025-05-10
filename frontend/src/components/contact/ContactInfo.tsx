// src/components/contact/ContactInfo.tsx - Updated with new styling
import React from "react";
import PageIcons from "@/components/ui/custom/PageIcons";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { contactService } from "@/lib/data/services/contactService";

export default async function ContactInfo() {
  let contactInfo;

  try {
    contactInfo = await contactService.getContactPageData();

    // Add priority to fix the LCP warning
    if (!contactInfo) {
      return <ErrorMessage message="Ingen kontaktinformasjon tilgjengelig." />;
    }
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return (
      <ErrorMessage message="Kunne ikke laste kontaktinformasjon. Vennligst prøv igjen senere." />
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
        Kontakt informasjon
      </h2>

      {/* Address Section */}
      <article className="flex items-start mb-10 group hover:bg-gray-50 p-4 rounded-lg transition-colors">
        <figure
          className="mr-6 bg-blue-100 p-3 rounded-full"
          aria-hidden="true"
        >
          <PageIcons
            name="location"
            directory="profileIcons"
            size={40}
            alt=""
            className="w-10 h-10"
          />
        </figure>
        <div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">
            Besøksadresse
          </h3>
          <address className="text-lg not-italic text-gray-600">
            <span>
              {contactInfo.streetAddress || "Adresse ikke tilgjengelig"}
            </span>
            <br />
            <span>
              {contactInfo.postalCode || ""} {contactInfo.city || ""}
            </span>
          </address>
        </div>
      </article>

      {/* Email Section */}
      <article className="flex items-start group hover:bg-gray-50 p-4 rounded-lg transition-colors">
        <figure
          className="mr-6 bg-green-100 p-3 rounded-full"
          aria-hidden="true"
        >
          <PageIcons
            name="email"
            directory="profileIcons"
            size={40}
            alt=""
            className="w-10 h-10"
          />
        </figure>
        <div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">E-post</h3>
          <p className="text-lg text-gray-600">
            {contactInfo.email ? (
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-blue-600 hover:underline transition-colors"
                aria-label={`Send e-post til ${contactInfo.email}`}
              >
                {contactInfo.email}
              </a>
            ) : (
              "E-post ikke tilgjengelig"
            )}
          </p>
        </div>
      </article>
    </div>
  );
}
