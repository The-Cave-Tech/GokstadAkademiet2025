"use client";
import { useState } from "react";
import { signInSchema, signUpSchema } from "@/lib/validation/userAuthValidation";
import { SignUpValidationErrors, SignInValidationErrors, SignUpValidationErrorKeys, SignInValidationErrorKeys } from "@/types/auth.types";

export function useSignUpValidation() {
  const [validationErrors, setValidationErrors] = useState<SignUpValidationErrors>({
    username: [],
    email: [],
    password: [],
    repeatPassword: [],
  });

  const validateField = (name: SignUpValidationErrorKeys, value: string, formValues: Record<string, string>) => {
    if (!value) {
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
      return;
    }

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
    const formValues: Record<string, string> = { identifier: "", password: "" };
    formValues[name] = value;
    
    if (!value) {
      setValidationErrors((prev) => ({ ...prev, [name]: [] }));
      return;
    }

    const validation = signInSchema.safeParse(formValues);

    if (!validation.success) {
      const fieldError = validation.error.flatten().fieldErrors[name]?.slice(0, 1) ?? [];
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  return { validationErrors, validateField };
}