"use server";

import { signUpSchema } from "@/lib/validation/authInput";
import { redirect } from "next/navigation";

/**
 * Registrerer en ny bruker basert på skjema-data.
 * @param prevState - Tidligere tilstand fra skjemaet
 * @param formData - Skjemadata sendt fra klienten
 * @returns FormState - Oppdatert tilstand med feil eller suksess
 */
export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const fields = Object.fromEntries(formData.entries());

  
  console.log("[Server] Register - Input data:", fields);

  // Valider data mot Zod-skjemaet
  const validation = signUpSchema.safeParse(fields);
  console.log("[Server] Register - Validation result:", {
    success: validation.success,
    errors: validation.success ? null : validation.error.flatten().fieldErrors,
  });

  if (!validation.success) {
    console.warn("[Server] Register - Validation failed:", validation.error.flatten().fieldErrors);

    return {
      ...prevState,
      zodErrors: validation.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Registrering mislyktes på grunn av ugyldige data.",
      values: fields, // Returner innsendte verdier for gjenbruk i skjemaet
    };
  }

  // TODO: Legg til faktisk API-kall registreringslogikk til Strapi 
  console.log("[Server] Register - User validated successfully, redirecting to signin");


  redirect("/signin");
}
  

/* // SignIn event
export async function login(formData: FormData) {
    
  }
  
  // SignOut event
  export async function logout() {
   
  } */
  
