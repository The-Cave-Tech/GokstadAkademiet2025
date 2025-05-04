// src/hooks/useProfileValidation.ts
"use client";
import { useState, useCallback } from "react";
import { 
  publicProfileSchema, 
  personalInfoSchema,
  usernameChangeSchema,
  emailChangeSchema,
  passwordChangeSchema,
  accountDeletionSchema,
  accountDeletionVerificationSchema,
  notificationSettingsSchema,
  PublicProfileFormData,
  PersonalInfoFormData,
  UsernameChangeFormData,
  EmailChangeFormData,
  PasswordChangeFormData,
  AccountDeletionFormData,
  AccountDeletionVerificationFormData,
  NotificationSettingsFormData,
} from "@/lib/validation/profileSectionValidation";
import { z } from "zod";
import { 
  AccountDeletionValidationErrors, 
  AccountDeletionVerificationValidationErrors, 
  EmailChangeValidationErrors, 
  PasswordChangeValidationErrors, 
  PersonalInfoValidationErrors, 
  PublicProfileValidationErrors, 
  UsernameChangeValidationErrors,
  NotificationSettingsValidationErrors,
} from "@/types/validationError.types";

// Generic validation hook with improved typings and logging
function useValidation<
  T extends Record<string, unknown>,
  E extends Record<string, string[]>
>(
  schema: z.ZodSchema, 
  initialErrors: E
) {
  const [validationErrors, setValidationErrors] = useState<E>(initialErrors);

  const validateField = useCallback((name: keyof T & string, value: string | boolean, formValues: Partial<T> = {}) => {
    // Type safe way to update errors
    const updateErrors = (fieldName: string, fieldErrors: string[]) => {
      setValidationErrors(prev => {
        // Create a new object to avoid mutation
        const newErrors = { ...prev } as E;
        // Safe indexing with type casting
        (newErrors as Record<string, string[]>)[fieldName] = fieldErrors;
        return newErrors;
      });
    };

    // Skip validation for empty non-required fields
    if (value === "" && name !== 'fullName' && name !== 'displayName') {
      updateErrors(name, []);
      return;
    }

    // Special handling for password confirmation
    if (name === 'confirmPassword' && 'newPassword' in formValues) {
      if (value !== formValues.newPassword) {
        updateErrors(name, ["Passordene må være like"]);
        return;
      } else {
        updateErrors(name, []);
        return;
      }
    }

    // Special handling for boolean values
    let valueToValidate = value;
    if (typeof value === 'boolean') {
      valueToValidate = value;
    }

    // Normal field validation
    try {
      const dataToValidate = { ...formValues, [name]: valueToValidate } as Record<string, unknown>;
      const validation = schema.safeParse(dataToValidate);

      if (!validation.success) {
        // Extract field errors safely
        const fieldErrors = validation.error.flatten().fieldErrors;
        const errorMessages = fieldErrors[name] || [];
        updateErrors(name, errorMessages.slice(0, 1));
      } else {
        updateErrors(name, []);
      }
    } catch (error) {
      console.error(`Validation error for field ${String(name)}:`, error);
      updateErrors(name, ["Det oppstod en valideringsfeil"]);
    }
  }, [schema]);

  const validateForm = useCallback((formData: Partial<T>): boolean => {
    try {
      const result = schema.safeParse(formData);
      
      if (!result.success) {
        // Update all errors
        const allErrors = result.error.flatten().fieldErrors;
        
        setValidationErrors(prev => {
          const newErrors = { ...prev } as E;
          
          // For each field in our error template
          Object.keys(initialErrors).forEach(field => {
            const fieldErrors = allErrors[field] || [];
            (newErrors as Record<string, string[]>)[field] = fieldErrors.slice(0, 1);
          });
          
          return newErrors;
        });
        
        return false;
      }
      
      // Clear all errors if validation passes
      setValidationErrors(initialErrors);
      return true;
    } catch (error) {
      console.error("Form validation error:", error);
      return false;
    }
  }, [schema, initialErrors]);

  return { validationErrors, validateField, validateForm };
}

// Public Profile Validation Hook
export function usePublicProfileValidation() {
  return useValidation<PublicProfileFormData, PublicProfileValidationErrors>(
    publicProfileSchema, 
    {
      displayName: [],
      biography: [],
      showEmail: [],
      showPhone: [],
      showAddress: [],
    }
  );
}

// Personal Info Validation Hook
export function usePersonalInfoValidation() {
  return useValidation<PersonalInfoFormData, PersonalInfoValidationErrors>(
    personalInfoSchema, 
    {
      fullName: [],
      birthDate: [],
      gender: [],
      phoneNumber: [],
      streetAddress: [],
      postalCode: [],
      city: [],
    }
  );
}

// Username Change Validation Hook
export function useUsernameChangeValidation() {
  return useValidation<UsernameChangeFormData, UsernameChangeValidationErrors>(
    usernameChangeSchema, 
    {
      username: [],
      currentPassword: [],
    }
  );
}

// Email Change Validation Hook
export function useEmailChangeValidation() {
  return useValidation<EmailChangeFormData, EmailChangeValidationErrors>(
    emailChangeSchema, 
    {
      email: [],
      currentPassword: [],
    }
  );
}

// Password Change Validation Hook
export function usePasswordChangeValidation() {
  return useValidation<PasswordChangeFormData, PasswordChangeValidationErrors>(
    passwordChangeSchema, 
    {
      currentPassword: [],
      newPassword: [],
      confirmPassword: [],
    }
  );
}

// Account Deletion Validation Hook
export function useAccountDeletionValidation() {
  return useValidation<AccountDeletionFormData, AccountDeletionValidationErrors>(
    accountDeletionSchema, 
    {
      password: [],
    }
  );
}

// Account Deletion Verification Validation Hook
export function useAccountDeletionVerificationValidation() {
  return useValidation<
    AccountDeletionVerificationFormData, 
    AccountDeletionVerificationValidationErrors
  >(
    accountDeletionVerificationSchema, 
    {
      verificationCode: [],
      deletionReason: [],
    }
  );
}

// Notification Settings Validation Hook
export function useNotificationSettingsValidation() {
  return useValidation<
    NotificationSettingsFormData,
    NotificationSettingsValidationErrors
  >(
    notificationSettingsSchema,
    {
      importantUpdates: [],
      newsletter: [],
    }
  );
}

