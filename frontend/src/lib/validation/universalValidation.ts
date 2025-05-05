/**
 * Universell validering for felles bruk på tvers av applikasjonen
 */
import { z } from "zod";
import { 
  calculatePasswordStrength, 
  PASSWORD_PATTERNS,
  dangerousCharsRegex,
  meetsMinimumStrength,
  getPasswordStrengthInfo
} from "@/lib/utils/passwordStrength";
import { ValidationResult } from "@/types/universalPassword.types";

export { 
  calculatePasswordStrength, 
  meetsMinimumStrength, 
  getPasswordStrengthInfo,
  dangerousCharsRegex,
  PASSWORD_PATTERNS
};

export const universalUsernameValidation = z
  .string()
  .trim() 
  .min(6, { message: "Brukernavn må være minst 6 tegn" })
  .max(20, { message: "Brukernavn må være maks 20 tegn" })
  .regex(/[0-9]/, { message: "Brukernavn må inneholde minst ett tall" })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Brukernavn kan kun inneholde bokstaver, tall, bindestrek og understrek",
  })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "Brukernavn inneholder forbudte tegn",
  })
  .transform((val) =>
    val
      .toLowerCase()
      .replace(dangerousCharsRegex, "") 
  );


export const universalEmailValidation = z
  .string()
  .trim()
  .email({ message: "Ugyldig e-postadresse, f.eks. ola@nordmann.no" })
  .max(100, { message: "E-post må være maks 100 tegn" })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "E-post inneholder forbudte tegn",
  })
  .transform((val) =>
    val
      .toLowerCase()
      .replace(dangerousCharsRegex, "") 
  );


export const universalPasswordValidation = z
  .string()
  .trim()
  .min(8, { message: "Passord må være minst 8 tegn" })
  .max(100, { message: "Passord må være maks 100 tegn" })
  .regex(PASSWORD_PATTERNS.uppercase, { 
    message: "Passord må inneholde minst én stor bokstav" 
  })
  .regex(PASSWORD_PATTERNS.lowercase, { 
    message: "Passord må inneholde minst én liten bokstav" 
  })
  .regex(PASSWORD_PATTERNS.numbers, { 
    message: "Passord må inneholde minst ett tall" 
  })
  .regex(PASSWORD_PATTERNS.special, {
    message: "Passord må inneholde minst ett spesialtegn",
  })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "Passord inneholder forbudte tegn",
  })
  .refine((val) => !PASSWORD_PATTERNS.spaces.test(val), {
    message: "Passord kan ikke inneholde mellomrom",
  });


export const universalStrongPasswordValidation = universalPasswordValidation
  .refine(
    (val) => meetsMinimumStrength(val, 50),
    { 
      message: "Passordet er for svakt. Bruk en kombinasjon av store og små bokstaver, tall og spesialtegn." 
    }
  );

export const universalConfirmPasswordValidation = z
  .string()
  .trim()
  .min(1, { message: "Bekreft passordet ditt" });


export const universalCurrentPasswordValidation = z
  .string()
  .trim()
  .min(1, { message: "Nåværende passord er påkrevd" });

export const universalVerificationCodeValidation = z
  .string()
  .trim()
  .refine((val) => /^\d{6}$/.test(val), {
    message: "Verifiseringskoden må bestå av 6 siffer",
  });

export function validatePassword(password: string): ValidationResult {
  try {
    universalStrongPasswordValidation.parse(password);
    return { isValid: true };
  } catch (error) {
    const zodError = error as z.ZodError;
    return { 
      isValid: false, 
      error: zodError.errors[0]?.message || "Passordvalidering feilet" 
    };
  }
}