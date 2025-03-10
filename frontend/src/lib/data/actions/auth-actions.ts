"use server";

import { signInSchema, signUpSchema } from "@/lib/validation/authInput";
import { redirect } from "next/navigation";
import { RegisterFormState, LoginFormState, SignUpValidationErrors, SignInValidationErrors } from "@/types/auth";

/**
 * Håndterer autentisering (registrering/innlogging) med validering og tilstandsoppdatering.
 * @param schema - Zod skjema for validering
 * @param prevState - Forrige tilstand av skjemaet
 * @param formData - Skjemadata fra klienten
 * @param redirectPath - URL til hvor brukeren skal sendes ved suksess
 * @returns Oppdatert skjema-tilstand eller redirect ved suksess
 */
async function handleAuth<T extends typeof signUpSchema | typeof signInSchema>(
  schema: T,
  prevState: T extends typeof signUpSchema ? RegisterFormState : LoginFormState,
  formData: FormData,
  redirectPath: string
): Promise<T extends typeof signUpSchema ? RegisterFormState : LoginFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  console.log("[Server] Auth - Raw input data:", fields); // Logger rådata ("on" eller fraværende)

 
  const dataForValidation = {
    identifier: fields.identifier,
    password: fields.password,
    rememberMe: fields.remember === "on" ? true : false, // Konverterer "on" til true, ellers false
  };
  console.log("[Server] Auth - Data for validation:", dataForValidation); // Logger behandlet data

  const validation = schema.safeParse(dataForValidation);
  console.log("[Server] Auth - Validation result:", {
    success: validation.success,
    errors: validation.success ? null : validation.error.flatten().fieldErrors,
  });

  if (!validation.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([key, errors]) => [
        key,
        errors ? [errors[0]] : [],
      ])
    );

    const errors = schema === signUpSchema
      ? {
          username: [],
          email: [],
          password: [],
          repeatPassword: [],
          ...fieldErrors,
        } as SignUpValidationErrors
      : {
          identifier: [],
          password: [],
          ...fieldErrors,
        } as SignInValidationErrors;

    console.warn("[Server] Auth - Validation failed:", errors);

    return {
      ...prevState,
      zodErrors: errors as T extends typeof signUpSchema ? SignUpValidationErrors : SignInValidationErrors,
      strapiErrors: null,
      values: fields,
    };
  }

  // Forberedelse for fremtidig token-håndtering basert på rememberMe
  if (schema === signInSchema) {
    const rememberMe = dataForValidation.rememberMe; // Bruk den transformerte verdien
    console.log("[Server] Auth - Remember me status:", rememberMe);
    // TODO: Legge til token-generering her senere
  }

  // TODO: Legg til API-kall til Strapi for registrering/innlogging
  redirect(redirectPath);
}

/**
 * Registrerer en ny bruker.
 */
export async function register(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  return handleAuth(signUpSchema, prevState, formData, "/signin");
}

/**
 * Logger inn en bruker.
 */
export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  return handleAuth(signInSchema, prevState, formData, "/dashboard");
}