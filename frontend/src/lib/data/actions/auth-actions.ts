"use server";

import { signInSchema, signUpSchema } from "@/lib/validation/authInput";
import { redirect } from "next/navigation";
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
  const fields = Object.fromEntries(formData.entries());
  console.log("[Server] Auth - Input data:", fields);

  const validation = schema.safeParse(fields);
  console.log("[Server] Auth - Validation result:", {
    success: validation.success,
    errors: validation.success ? null : validation.error.flatten().fieldErrors,
  });

  if (!validation.success) {
    const firstErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([key, errors]) => [
        key,
        [errors[0]],
      ])
    ) as ValidationErrors;

    console.warn("[Server] Auth - Validation failed:", firstErrors);

    return {
      ...prevState,
      zodErrors: firstErrors,
      strapiErrors: null,
      values: fields,
    } as T extends typeof signUpSchema ? RegisterFormState : LoginFormState;
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