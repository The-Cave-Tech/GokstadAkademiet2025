import { 
  SignUpValidationErrors, 
  SignInValidationErrors 
} from "@/types/auth.types";

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
  if (errorMessage.includes("Invalid current password")) {
    return "Ugyldig nåværende passord";
  }
  
  if (errorMessage.includes("Invalid verification code")) {
    return "Ugyldig verifiseringskode";
  }
  
  if (errorMessage.includes("Username is already taken")) {
    return "Brukernavnet er allerede tatt";
  }
  
  if (errorMessage.includes("Email is already taken")) {
    return "E-postadressen er allerede i bruk";
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

