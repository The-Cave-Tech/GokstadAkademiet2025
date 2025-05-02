import { useState } from "react";
import { 
  publicProfileSchema, 
  personalInfoSchema,
  usernameChangeSchema,
  emailChangeSchema,
  passwordChangeSchema,
  accountDeletionSchema,
  accountDeletionVerificationSchema,
  PublicProfileFormData,
  PersonalInfoFormData,
  UsernameChangeFormData,
  EmailChangeFormData,
  PasswordChangeFormData,
  AccountDeletionFormData,
  AccountDeletionVerificationFormData
} from "@/lib/validation/profileSectionValidation";
import { z } from "zod";
import { 
  AccountDeletionValidationErrors, 
  AccountDeletionVerificationValidationErrors, 
  EmailChangeValidationErrors, 
  PasswordChangeValidationErrors, 
  PersonalInfoValidationErrors, 
  PublicProfileValidationErrors, 
  UsernameChangeValidationErrors 
} from "@/types/validationError.types";

// Generic validation hook
function useValidation<
  T extends Record<string, unknown>,
  E extends Record<string, string[]>
>(
  schema: z.ZodSchema, 
  initialErrors: E
) {
  const [validationErrors, setValidationErrors] = useState<E>(initialErrors);

  const validateField = (name: keyof T & string, value: string, formValues: Partial<T> = {}) => {
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

    if (!value && name !== 'fullName' && name !== 'displayName') {
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

    // Normal field validation
    try {
      const dataToValidate = { ...formValues, [name]: value } as Record<string, unknown>;
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
    }
  };

  return { validationErrors, validateField };
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