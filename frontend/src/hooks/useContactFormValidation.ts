// src/hooks/useContactFormValidation.ts
"use client";

import { useState, useCallback } from "react";
import { contactFormSchema } from "@/lib/validation/contactFormValidation";
import { ContactFormData } from "@/types/contact.types";

type ContactFormValidationErrors = {
  [K in keyof ContactFormData]?: string[];
};

export function useContactFormValidation() {
  const [validationErrors, setValidationErrors] = useState<ContactFormValidationErrors>({
    name: [],
    email: [],
    phoneNumber: [],
    message: []
  });

  const validateField = useCallback((name: keyof ContactFormData, value: string) => {
    if (value === "" && name !== 'phoneNumber') {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ["Dette feltet er påkrevd"]
      }));
      return;
    }

    try {
      const dataToValidate = { [name]: value } as Partial<ContactFormData>;
      const subSchema = contactFormSchema.pick({ [name]: true });
      
      const validation = subSchema.safeParse(dataToValidate);

      if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        setValidationErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name] || []
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          [name]: []
        }));
      }
    } catch (error) {
      console.error(`Validation error for field ${String(name)}:`, error);
      setValidationErrors(prev => ({
        ...prev,
        [name]: ["Det oppstod en valideringsfeil"]
      }));
    }
  }, []);

  const validateForm = useCallback((formData: ContactFormData): boolean => {
    try {
      const result = contactFormSchema.safeParse(formData);
      
      if (!result.success) {
        const allErrors = result.error.flatten().fieldErrors;
        
        setValidationErrors({
          name: allErrors.name?.slice(0, 1) || [],
          email: allErrors.email?.slice(0, 1) || [],
          phoneNumber: allErrors.phoneNumber?.slice(0, 1) || [],
          message: allErrors.message?.slice(0, 1) || []
        });
        
        return false;
      }
      
      setValidationErrors({
        name: [],
        email: [],
        phoneNumber: [],
        message: []
      });
      
      return true;
    } catch (error) {
      console.error("Form validation error:", error);
      return false;
    }
  }, []);

  return { validationErrors, validateField, validateForm };
}