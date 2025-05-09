// src/lib/validation/contactFormValidation.ts
import { z } from "zod";
import {
  universalEmailValidation,
  dangerousCharsRegex,
} from "@/lib/validation/universalValidation";

// Updated phone number validation to ensure exactly 8 digits
export const norwegianPhoneNumberValidation = z
  .string()
  .trim()
  .refine((val) => val === "" || /^[0-9]{8}$/.test(val), {
    message: "Telefonnummeret må inneholde nøyaktig 8 sifre",
  });

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Navn må være minst 2 tegn" })
    .max(100, { message: "Navn kan maksimalt være 100 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Navn inneholder forbudte tegn",
    }),

  email: universalEmailValidation,

  phoneNumber: norwegianPhoneNumberValidation,

  message: z
    .string()
    .trim()
    .min(10, { message: "Meldingen må være minst 10 tegn" })
    .max(256, { message: "Meldingen kan maksimalt være 256 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Meldingen inneholder forbudte tegn",
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
