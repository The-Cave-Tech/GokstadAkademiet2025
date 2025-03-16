"use server";

import { signInSchema, signUpSchema } from "@/lib/validation/authInput";
import { redirect } from "next/navigation";
import {
  RegisterFormState,
  LoginFormState,
  SignUpValidationErrors,
  SignInValidationErrors,
} from "@/types/auth.types";
import { registerUserService} from "@/lib/data/services/userAuth";

/**
 * Registrerer en ny bruker.
 */
export async function register(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  console.log("[Server] Auth - Input data:", fields);

  const validation = signUpSchema.safeParse(fields);
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

    const errors: SignUpValidationErrors = {
      username: [],
      email: [],
      password: [],
      repeatPassword: [],
      ...fieldErrors,
    };
    console.warn("[Server] Auth - Validation failed:", errors);

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
    };
  }

  try {
    const { username, email, password } = fields;
    const response = await registerUserService({ username, email, password });
    console.log("[Server] Register - Success:", response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ukjent feil oppstod";
    console.error("[Server] Register - Error:", error);

    // Oversett Strapi-feil til norsk
    if (errorMessage.includes("Email or Username are already taken")) {
      return {
        ...prevState,
        zodErrors: null,
        strapiErrors: { message: "E-post eller brukernavn er allerede tatt" },
        values: fields,
      };
    }

    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
    };
  }

  redirect("/signin");
}

/**
 * Logger inn en bruker.
 */
export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  console.log("[Server] Auth - Input data:", fields);

  const validation = signInSchema.safeParse(fields);
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

    const errors: SignInValidationErrors = {
      identifier: [],
      password: [],
      ...fieldErrors,
    };
    console.warn("[Server] Auth - Validation failed:", errors);

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
    };
  }

  try {
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ukjent feil oppstod";
    console.error("[Server] Login - Error:", error);
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
    };
  }

  redirect("/dashboard");
}