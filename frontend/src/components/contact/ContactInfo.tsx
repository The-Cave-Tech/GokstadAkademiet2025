// src/components/contact/ContactInfo.tsx - Updated
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
    <>
      {/* Address Section */}
      <article className="flex mb-16">
        <figure className="mr-6" aria-hidden="true">
          <PageIcons
            name="location"
            directory="profileIcons"
            size={94}
            alt=""
            className="w-24 h-24"
            
          />
        </figure>
        <div>
          <h2 className="text-xl font-medium mb-1">Adresse</h2>
          <address className="text-lg not-italic">
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

      {/* Phone Section */}
      <article className="flex mb-16">
        <figure className="mr-6" aria-hidden="true">
          <PageIcons
            name="phone"
            directory="profileIcons"
            size={94}
            alt=""
            className="w-24 h-24"
          />
        </figure>
        <div>
          <h2 className="text-xl font-medium mb-1">Telefon</h2>
          <p className="text-lg">
            {contactInfo.phoneNumber ? (
              <a
                href={`tel:${contactInfo.phoneNumber.replace(/\s+/g, "")}`}
                className="hover:underline"
                aria-label={`Ring oss på ${contactInfo.phoneNumber}`}
              >
                {contactInfo.phoneNumber}
              </a>
            ) : (
              "Telefonnummer ikke tilgjengelig"
            )}
          </p>
        </div>
      </article>

      {/* Email Section */}
      <article className="flex mb-16">
        <figure className="mr-6" aria-hidden="true">
          <PageIcons
            name="email"
            directory="profileIcons"
            size={94}
            alt=""
            className="w-24 h-24"
          />
        </figure>
        <div>
          <h2 className="text-xl font-medium mb-1">E-post</h2>
          <p className="text-lg">
            {contactInfo.email ? (
              <a
                href={`mailto:${contactInfo.email}`}
                className="hover:underline"
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
    </>
  );
}
