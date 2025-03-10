// hooks/useValidation.ts
import { useState } from "react";
import { signInSchema, signUpSchema } from "@/lib/validation/authInput";
import { SignUpValidationErrors, SignInValidationErrors, SignUpValidationErrorKeys, SignInValidationErrorKeys } from "@/types/auth";

export function useSignUpValidation() {
  const [validationErrors, setValidationErrors] = useState<SignUpValidationErrors>({
    username: [],
    email: [],
    password: [],
    repeatPassword: [],
  });

  const validateField = (name: SignUpValidationErrorKeys, value: string) => {
    const validation = signUpSchema.safeParse({ [name]: value });

    setValidationErrors((prev) => ({
      ...prev,
      [name]: validation.success
        ? []
        : validation.error.flatten().fieldErrors[name]?.slice(0, 1) ?? [], // Tar kun første feil
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
    const validation = signInSchema.safeParse({ [name]: value });

    setValidationErrors((prev) => ({
      ...prev,
      [name]: validation.success
        ? []
        : validation.error.flatten().fieldErrors[name]?.slice(0, 1) ?? [], // Tar kun første feil
    }));
  };

  return { validationErrors, validateField };
}