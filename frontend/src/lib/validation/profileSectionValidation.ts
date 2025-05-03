// src/lib/validation/profileSectionValidation.ts
import { z } from "zod";
import { 
  universalUsernameValidation,
  universalEmailValidation,
  universalStrongPasswordValidation,
  universalConfirmPasswordValidation,
  universalCurrentPasswordValidation,
  universalVerificationCodeValidation,
  dangerousCharsRegex,
  validatePassword
} from "@/lib/validation/universalValidation";
import { ValidationResult } from "@/types/universalPassword.types";

// Public Profile Validation Schema
export const publicProfileSchema = z.object({
  displayName: z.string().trim()
    .min(2, { message: "Navn må være minst 2 tegn" })
    .max(50, { message: "Navn kan maksimalt være 50 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Navn inneholder forbudte tegn",
    }),
  biography: z.string().trim()
    .max(256, { message: "Biografi kan maksimalt være 256 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Biografi inneholder forbudte tegn",
    })
    .optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showAddress: z.boolean().optional(),
});

export type PublicProfileFormData = z.infer<typeof publicProfileSchema>;

// Personal Information Validation Schema
export const personalInfoSchema = z.object({
  fullName: z.string().trim()
    .min(2, { message: "Navn må være minst 2 tegn" })
    .max(100, { message: "Navn kan maksimalt være 100 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Navn inneholder forbudte tegn",
    }),
  birthDate: z.string()
    .optional()
    .refine(val => !val || /^\d{2}\.\d{2}\.\d{4}$/.test(val) || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Fødselsdato må være på format DD.MM.ÅÅÅÅ eller ÅÅÅÅ-MM-DD"
    })
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "Fødselsdato inneholder forbudte tegn",
    }),
  gender: z.string().trim()
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "Kjønn inneholder forbudte tegn",
    })
    .optional(),
  streetAddress: z.string().trim()
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "Adresse inneholder forbudte tegn",
    })
    .optional(),
  postalCode: z.string().trim()
    .optional()
    .refine(val => !val || /^\d{4}$/.test(val), {
      message: "Postnummer må bestå av 4 siffer"
    })
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "Postnummer inneholder forbudte tegn",
    }),
  city: z.string().trim()
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "By inneholder forbudte tegn",
    })
    .optional()
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Username Change Validation Schema - matches userAuth approach
export const usernameChangeSchema = z.object({
  username: universalUsernameValidation,
  currentPassword: universalCurrentPasswordValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    })
});

export type UsernameChangeFormData = z.infer<typeof usernameChangeSchema>;

// Email Change Validation Schema - matches userAuth approach
export const emailChangeSchema = z.object({
  email: universalEmailValidation,
  currentPassword: universalCurrentPasswordValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    })
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// Password Change Validation Schema - matches userAuth approach for password confirmation
export const passwordChangeSchema = z.object({
  currentPassword: universalCurrentPasswordValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    }),
  newPassword: universalStrongPasswordValidation,
  confirmPassword: universalConfirmPasswordValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    })
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
  if (newPassword !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passordene må være like",
      path: ["confirmPassword"],
    });
  }
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Account Deletion Validation Schema
export const accountDeletionSchema = z.object({
  password: universalCurrentPasswordValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    })
});

export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;

// Account Deletion Verification Schema
export const accountDeletionVerificationSchema = z.object({
  verificationCode: universalVerificationCodeValidation
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Verifiseringskode inneholder forbudte tegn",
    }),
  deletionReason: z.string()
    .max(256, { message: "Grunn kan maksimalt være 256 tegn" })
    .refine(val => !val || !dangerousCharsRegex.test(val), {
      message: "Grunn inneholder forbudte tegn",
    })
    .optional()
});

export type AccountDeletionVerificationFormData = z.infer<typeof accountDeletionVerificationSchema>;

// Notification Settings Validation Schema
export const notificationSettingsSchema = z.object({
  importantUpdates: z.boolean(),
  newsletter: z.boolean()
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

/**
 * Hjelpefunksjon for å validere profilendringer
 */
export function validateProfileForm<T>(schema: z.ZodType<any>, formData: Partial<T>): ValidationResult {
  try {
    schema.parse(formData);
    return { isValid: true };
  } catch (error) {
    const zodError = error as z.ZodError;
    return { 
      isValid: false, 
      error: zodError.errors[0]?.message || "Validering feilet" 
    };
  }
}

/**
 * Hjelpefunksjon for passordvalidering
 */
export function validateProfilePassword(password: string): ValidationResult {
  return validatePassword(password);
}