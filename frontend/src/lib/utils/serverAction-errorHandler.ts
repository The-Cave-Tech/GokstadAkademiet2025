import { SignUpValidationErrors, SignInValidationErrors } from "@/types/auth.types";
import { ZodError } from "zod";

/**
 * Håndterer Zod-valideringsfeil og formaterer dem for bruk i UI
 */
export function handleValidationErrors<T extends Record<string, string[]>>(
  error: ZodError,
  errorTemplate: T
): T {
  const fieldErrors = Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([key, errors]) => [
      key,
      errors && errors.length > 0 ? [errors[0]] : [],
    ])
  );

  return {
    ...errorTemplate,
    ...fieldErrors,
  } as T;
}

/**
 * Konverterer Strapi-feilmeldinger til brukervennlige norske meldinger
 */
export function handleStrapiError(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : "Ukjent feil oppstod";
  
  if (errorMessage.includes("Email or Username are already taken")) {
    return "E-post eller brukernavn er allerede tatt";
  }
  
  if (errorMessage.includes("Invalid identifier or password")) {
    return "Ugyldig brukernavn/e-post eller passord";
  }
  
  return errorMessage;
}

/**
 * Hjelpefunksjon for å få riktig feilmelding for skjemafelt
 */
export function authFieldError(
  validationErrors: SignUpValidationErrors | SignInValidationErrors,
  formStateErrors: SignUpValidationErrors | SignInValidationErrors,
  fieldName: keyof SignUpValidationErrors | keyof SignInValidationErrors
): string[] {
  return validationErrors[fieldName as keyof typeof validationErrors].length > 0
    ? validationErrors[fieldName as keyof typeof validationErrors]
    : formStateErrors[fieldName as keyof typeof formStateErrors];
}