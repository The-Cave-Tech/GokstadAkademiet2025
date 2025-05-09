// src/lib/data/actions/contact.ts
"use server";

import { z } from "zod";
import { strapiService } from "@/lib/data/services/strapiClient";
import { ContactFormData } from "@/types/contact.types";
import { contactFormSchema } from "@/lib/validation/contactFormValidation";

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate the form data
    const validation = contactFormSchema.safeParse(formData);
    
    if (!validation.success) {
      return {
        success: false,
        error: "Ugyldig skjemadata. Vennligst sjekk feltene og prøv igjen."
      };
    }
    
    // Submit to Strapi
    await strapiService.fetch("contact-submissions", {
      method: "POST",
      body: {
        data: {
          ...formData,
          createdAt: new Date().toISOString()
        }
      }
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Det oppstod en feil ved sending av skjemaet. Vennligst prøv igjen senere."
    };
  }
}