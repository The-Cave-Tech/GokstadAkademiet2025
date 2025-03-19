import { useState } from "react";
import { signInSchema, signUpSchema } from "@/lib/validation/authInput";
import { SignUpValidationErrors, SignInValidationErrors, SignUpValidationErrorKeys, SignInValidationErrorKeys } from "@/types/auth.types";

export function useSignUpValidation() {
  const [validationErrors, setValidationErrors] = useState<SignUpValidationErrors>({
    username: [],
    email: [],
    password: [],
    repeatPassword: [],
  });

  const validateField = (name: SignUpValidationErrorKeys, value: string, formValues: Record<string, string>) => {
    // Hvis feltet er tomt, fjern feilmeldingen med mindre skjemaet er sendt
    if (!value) {
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
      return;
    }

    // Valider hele skjemaet for å håndtere avhengigheter (f.eks. password vs repeatPassword)
    const validation = signUpSchema.safeParse({ ...formValues, [name]: value });

    setValidationErrors((prev) => ({
      ...prev,
      [name]: validation.success
        ? []
        : validation.error.flatten().fieldErrors[name]?.slice(0, 1) ?? [],
    }));
  };

  return { validationErrors, validateField };
}

export function useSignInValidation() {
  const [validationErrors, setValidationErrors] = useState<SignInValidationErrors>({
    identifier: [],
    password: [],
  });

  const validateField = (name: SignInValidationErrorKeys, value: string) => {
    // Oppretter en objekt med alle verdier for validering
    const formValues: Record<string, string> = { identifier: "", password: "" };
    formValues[name] = value;
    
    // Hvis feltet er tomt, fjern feilmeldingen
    if (!value) {
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
      return;
    }

    const validation = signInSchema.safeParse(formValues);

    // Hvis validering feiler, legg til feilmelding
    if (!validation.success) {
      const fieldError = validation.error.flatten().fieldErrors[name]?.slice(0, 1) ?? [];
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      // Hvis validering er vellykket, fjern feilmelding
      setValidationErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  return { validationErrors, validateField };
}