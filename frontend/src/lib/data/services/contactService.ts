// src/lib/data/services/contactService.ts - Updated
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
  createdAt?: string;
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
      return await strapiService.fetch("contact-submissions", {
        method: "POST",
        body: {
          data: formData,
        },
      });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      throw new Error("Kunne ikke sende kontaktskjema");
    }
  },
};
