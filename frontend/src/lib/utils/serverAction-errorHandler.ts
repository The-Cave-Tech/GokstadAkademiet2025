import { SignUpValidationErrors, SignInValidationErrors } from "@/types/auth.types";
import { ZodError } from "zod";

// Define a proper type for Strapi API errors
interface StrapiErrorResponse {
  response?: {
    data?: {
      error?: {
        status?: number;
        name?: string;
        message?: string;
        details?: Record<string, unknown>;
      };
    };
    status?: number;
  };
  message?: string;
}

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
  // Handle Strapi's error response structure
  const strapiError = error as StrapiErrorResponse;
  
  // Check for Strapi's nested error structure
  if (strapiError.response?.data?.error?.message) {
    const strapiErrorMessage = strapiError.response.data.error.message;
    
    // Map common Strapi error messages to user-friendly Norwegian messages
    if (strapiErrorMessage.includes("Email or Username are already taken")) {
      return "E-post eller brukernavn er allerede tatt";
    }
    
    if (strapiErrorMessage.includes("Invalid identifier or password")) {
      return "Ugyldig brukernavn/e-post eller passord";
    }
    
    if (strapiErrorMessage.includes("password must be at least")) {
      return "Passordet må være minst 6 tegn langt";
    }
    
    if (strapiErrorMessage.includes("email must be a valid email")) {
      return "Vennligst oppgi en gyldig e-postadresse";
    }
    
    // Return the original message if no specific mapping is found
    return strapiErrorMessage;
  }
  
  // Check for HTTP status code-based errors
  if (strapiError.response?.status === 400) {
    return "Ugyldig forespørsel. Sjekk at all informasjon er korrekt.";
  }
  
  if (strapiError.response?.status === 401) {
    return "Du er ikke autorisert. Vennligst logg inn på nytt.";
  }
  
  if (strapiError.response?.status === 403) {
    return "Du har ikke tilgang til denne ressursen.";
  }
  
  if (strapiError.response?.status === 404) {
    return "Ressursen ble ikke funnet.";
  }
  
  if (strapiError.response?.status === 429) {
    return "For mange forespørsler. Vennligst prøv igjen senere.";
  }
  
  if (strapiError.response?.status && strapiError.response.status >= 500) {
    return "En serverfeil oppstod. Vennligst prøv igjen senere.";
  }
  
  // Fallback to standard error message
  const errorMessage = strapiError.message || "Ukjent feil oppstod";
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