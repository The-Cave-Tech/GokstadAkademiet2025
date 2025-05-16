// src/lib/data/services/contactService.ts - Endelig løsning
import { strapiService } from "./strapiClient";

export interface ContactPageData {
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
}

export const contactService = {
  /**
   * Fetch contact page data from Strapi
   */
  async getContactPageData(): Promise<ContactPageData> {
    try {
      const response = await strapiService.fetch<any>("contact-page");

      // Based on your logs, the data is nested inside response.data
      if (response && response.data) {
        return response.data as ContactPageData;
      }

      throw new Error("Unexpected response structure from Strapi");
    } catch (error) {
      console.error("Failed to fetch contact page data:", error);
      throw new Error("Kunne ikke hente kontaktinformasjon");
    }
  },

  /**
   * Submit contact form to Strapi
   */
  async submitContactForm(formData: ContactSubmission): Promise<any> {
    try {
      // Opprett et objekt med valgfrie felter som kan håndtere dynamisk tildeling
      const submissionData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      // Legg til telefonnummer kun hvis det finnes
      if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
        submissionData.phoneNumber = formData.phoneNumber;
      }

      // Sender med nødvendig data-wrapper
      return await strapiService.fetch("contact-submissions", {
        method: "POST",
        body: {
          data: submissionData,
        },
      });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      throw new Error("Kunne ikke sende kontaktskjema");
    }
  },
};
