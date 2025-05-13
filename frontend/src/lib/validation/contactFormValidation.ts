// src/lib/validation/contactFormValidation.ts

import { z } from "zod";

// Eksporterer interface for å bruke i komponenter
export interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// Definerer valideringsskjema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Navn må være minst 2 tegn.")
    .max(100, "Navn kan ikke være mer enn 100 tegn.")
    .trim(),
  email: z
    .string()
    .email("Ugyldig e-postadresse.")
    .max(100, "E-post kan ikke være mer enn 100 tegn.")
    .trim(),
  phoneNumber: z
    .string()
    .min(8, "Telefonnummer må være minst 8 siffer.")
    .max(15, "Telefonnummer kan ikke være mer enn 15 siffer.")
    .regex(
      /^[0-9+\s()-]*$/,
      "Telefonnummer kan bare inneholde tall og symbolene +()-."
    )
    .trim(),
  message: z
    .string()
    .min(10, "Beskrivelsen må være minst 10 tegn.")
    .max(500, "Beskrivelsen kan ikke være mer enn 500 tegn.")
    .trim(),
});
