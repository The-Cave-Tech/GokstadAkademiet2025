import { useState } from "react";
import { signUpSchema } from "@/lib/validation/authInput";

export function useValidation() {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: [],
    email: [],
    password: [],
    repeatPassword: [],
  });

  const validateField = (name: ValidationErrorKeys, value: string) => {
    const validation = signUpSchema.safeParse({ [name]: value });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors as ValidationErrors;
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name]?.[0] ? [fieldErrors[name]![0]] : [],
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
