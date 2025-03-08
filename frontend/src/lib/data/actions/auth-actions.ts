"use server";

import { signUpSchema } from "@/lib/validation/authInput";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Registrerer en ny bruker basert på skjema-data.
 * @param prevState - Tidligere tilstand fra skjemaet
 * @param formData - Skjemadata sendt fra klienten
 * @returns FormState - Oppdatert tilstand med feil eller suksess
 */
export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const fields = Object.fromEntries(formData.entries());
  console.log("[Server] Register - Input data:", fields);

  const validation = signUpSchema.safeParse(fields);
  console.log("[Server] Register - Validation result:", {
    success: validation.success,
    errors: validation.success ? null : validation.error.flatten().fieldErrors,
  });

  if (!validation.success) {
    const firstErrors = Object.fromEntries(
      Object.entries(validation.error.flatten().fieldErrors).map(([key, errors]) => [
        key,
        [errors[0]],
      ])
    ) as Partial<Record<keyof z.infer<typeof signUpSchema>, string[]>>;

    console.warn("[Server] Register - Validation failed:", firstErrors);

    return {
      ...prevState,
      zodErrors: firstErrors,
      strapiErrors: null,
      values: fields,
    };
  }

  // TODO: Legg til faktisk API-kall registreringslogikk til Strapi
  redirect("/signin");
}




  

/* // SignIn event
export async function login(formData: FormData) {
    
  }
  
  // SignOut event
  export async function logout() {
   
  } */
  
