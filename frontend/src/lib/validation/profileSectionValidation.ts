import { z } from "zod";
import { 
  universalUsernameValidation,
  universalEmailValidation,
  universalStrongPasswordValidation,
  universalCurrentPasswordValidation,
  universalVerificationCodeValidation
} from "@/lib/validation/universalValidation";

// Public Profile Validation Schema
export const publicProfileSchema = z.object({
  displayName: z.string().trim().min(2, { message: "Navn må være minst 2 tegn" }).max(50, { message: "Navn kan maksimalt være 50 tegn" }),
  biography: z.string().trim().max(256, { message: "Biografi kan maksimalt være 256 tegn" }).optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showAddress: z.boolean().optional(),
});

export type PublicProfileFormData = z.infer<typeof publicProfileSchema>;

// Personal Information Validation Schema
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Navn må være minst 2 tegn" }).max(100, { message: "Navn kan maksimalt være 100 tegn" }),
  birthDate: z.string().optional(),
  gender: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  streetAddress: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  city: z.string().trim().optional()
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Username Change Validation Schema
export const usernameChangeSchema = z.object({
  username: universalUsernameValidation,
  currentPassword: universalCurrentPasswordValidation
});

export type UsernameChangeFormData = z.infer<typeof usernameChangeSchema>;

// Email Change Validation Schema
export const emailChangeSchema = z.object({
  email: universalEmailValidation,
  currentPassword: universalCurrentPasswordValidation
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// Password Change Validation Schema
export const passwordChangeSchema = z.object({
  currentPassword: universalCurrentPasswordValidation,
  newPassword: universalStrongPasswordValidation,
  confirmPassword: z.string().trim().min(1, { message: "Bekreft passordet ditt" })
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
});

export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;

// Account Deletion Verification Schema
export const accountDeletionVerificationSchema = z.object({
  verificationCode: universalVerificationCodeValidation,
  deletionReason: z.string().optional()
});

export type AccountDeletionVerificationFormData = z.infer<typeof accountDeletionVerificationSchema>;


