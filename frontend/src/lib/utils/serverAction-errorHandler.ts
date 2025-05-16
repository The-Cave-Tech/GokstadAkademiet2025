// src/lib/utils/serverAction-errorHandler.ts
import { 
  SignUpValidationErrors, 
  SignInValidationErrors 
} from "@/types/auth.types";

import { 
  ProfileValidationErrorTypes 
} from "@/types/validationError.types";

import { ZodError } from "zod";

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
 * Standardisert håndtering av API-feil fra Strapi
 * @param error Feilen fra Strapi
 * @returns Brukervennlig feilmelding
 */
export function handleStrapiError(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : "Ukjent feil oppstod";
  
  // Auth-relaterte feilmeldinger
  if (errorMessage.includes("Email or Username are already taken")) {
    return "E-post eller brukernavn er allerede tatt";
  }
  
  if (errorMessage.includes("Invalid identifier or password")) {
    return "Ugyldig brukernavn/e-post eller passord";
  }
  
  // Profil-relaterte feilmeldinger
  if (errorMessage.includes("Invalid password") || 
      errorMessage.includes("Current password is incorrect") ||
      errorMessage.includes("Invalid current password")) {
    return "Ugyldig passord";
  }
  
  if (errorMessage.includes("Invalid verification code") || 
      errorMessage.includes("Verification code has expired")) {
    return "Ugyldig eller utløpt verifiseringskode";
  }
  
  if (errorMessage.includes("Username already in use") ||
      errorMessage.includes("Username is already taken") || 
      errorMessage.toLowerCase().includes("username already taken")) {
    return "Brukernavnet er allerede tatt";
  }
  
  if (errorMessage.includes("Email already in use") ||
      errorMessage.includes("Email is already taken") || 
      errorMessage.toLowerCase().includes("email already taken") ||
      errorMessage.toLowerCase().includes("email address already in use")) {
    return "E-postadressen er allerede i bruk";
  }

  // Nye spesifikke feilmeldinger for kontoendringer
  if (errorMessage.includes("No verification in progress")) {
    return "Ingen aktiv verifiseringsprosess funnet";
  }

  if (errorMessage.includes("Missing email information")) {
    return "Manglende e-postinformasjon";
  }

  if (errorMessage.includes("No token found")) {
    return "Ingen verifiseringskode funnet. Start prosessen på nytt.";
  }

  // Generic error handling
  if (errorMessage.includes("Network Error")) {
    return "Tilkoblingsproblem. Sjekk internettforbindelsen din.";
  }
  
  if (errorMessage.includes("timeout")) {
    return "Forespørselen tok for lang tid. Prøv igjen senere.";
  }
  
  return errorMessage;
}

export function authFieldError(
  validationErrors: SignUpValidationErrors | SignInValidationErrors,
  formStateErrors: SignUpValidationErrors | SignInValidationErrors | null,
  fieldName: keyof SignUpValidationErrors | keyof SignInValidationErrors
): string[] {
  return (validationErrors[fieldName as keyof typeof validationErrors]?.length > 0)
    ? validationErrors[fieldName as keyof typeof validationErrors]
    : (formStateErrors?.[fieldName as keyof typeof formStateErrors] || []);
}

export function profileFieldError<T extends Record<string, string[]>>(
  validationErrors: T,
  formStateErrors: T | null,
  fieldName: keyof T
): string[] {
  return validationErrors[fieldName]?.length > 0
    ? validationErrors[fieldName]
    : formStateErrors?.[fieldName] || [];
}

export function hasValidationErrors(errors: ProfileValidationErrorTypes | null): boolean {
  if (!errors) return false;
  
  return Object.values(errors).some(errorArray => 
    Array.isArray(errorArray) && errorArray.length > 0
  );
}

export function logValidationErrors(
  errors: ProfileValidationErrorTypes, 
  context: string
): void {
  const hasErrors = hasValidationErrors(errors);
  
  if (hasErrors) {
    console.group(`Validation errors in ${context}:`);
    Object.entries(errors).forEach(([messages]) => {
      if (messages.length > 0) {
      }
    });
    console.groupEnd();
  }
}