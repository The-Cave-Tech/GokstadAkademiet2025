//profileSectionValidation.ts:
import { z } from "zod";
import {
  universalUsernameValidation,
  universalEmailValidation,
  universalStrongPasswordValidation,
  universalConfirmPasswordValidation,
  universalCurrentPasswordValidation,
  universalVerificationCodeValidation,
  dangerousCharsRegex,
} from "@/lib/validation/universalValidation";

export const norwegianPhoneNumberValidation = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) =>
      !val ||
      val.replace(/\D/g, "").length === 8 ||
      (val.startsWith("+47") && val.replace(/\D/g, "").length === 10),
    {
      message: "Telefonnummer må bestå av 8 siffer",
    }
  )
  .refine(
    (val) => {
      if (!val) return true;
      const digitsOnly = val.replace(/\D/g, "");
      const localNumber = digitsOnly.startsWith("47")
        ? digitsOnly.slice(2)
        : digitsOnly;

      return localNumber.length === 8;
    },
    {
      message: "Telefonnummer må bestå av 8 siffer",
    }
  );

export const norwegianDateValidation = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^\d{2}\.\d{2}\.\d{4}$/.test(val), {
    message: "Datoen må være på format DD.MM.ÅÅÅÅ",
  })
  .refine(
    (val) => {
      if (!val) return true;
      let date: Date;
      if (val.includes(".")) {
        const [day, month, year] = val.split(".").map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(val);
      }

      return !isNaN(date.getTime());
    },
    {
      message: "Ugyldig dato",
    }
  )
  .refine(
    (val) => {
      if (!val) return true;

      let date: Date;
      if (val.includes(".")) {
        const [day, month, year] = val.split(".").map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(val);
      }

      return date <= new Date();
    },
    {
      message: "Datoen kan ikke være i fremtiden",
    }
  );

// Public Profile Validation
export const publicProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, { message: "Navn må være minst 2 tegn" })
    .max(50, { message: "Navn kan maksimalt være 50 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Navn inneholder forbudte tegn",
    }),
  biography: z
    .string()
    .trim()
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

// Personal Information Validation
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Navn må være minst 2 tegn" })
    .max(100, { message: "Navn kan maksimalt være 100 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Navn inneholder forbudte tegn",
    }),
  birthDate: norwegianDateValidation,
  gender: z
    .string()
    .trim()
    .refine((val) => !val || !dangerousCharsRegex.test(val), {
      message: "Kjønn inneholder forbudte tegn",
    })
    .optional(),
  phoneNumber: norwegianPhoneNumberValidation,
  streetAddress: z
    .string()
    .trim()
    .refine((val) => !val || !dangerousCharsRegex.test(val), {
      message: "Adresse inneholder forbudte tegn",
    })
    .optional(),
  postalCode: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "Postnummer må bestå av 4 siffer",
    }),
  city: z
    .string()
    .trim()
    .refine((val) => !val || !dangerousCharsRegex.test(val), {
      message: "By inneholder forbudte tegn",
    })
    .optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Username Change Validation
export const usernameChangeSchema = z.object({
  username: universalUsernameValidation,
  currentPassword: universalCurrentPasswordValidation.refine(
    (val) => !dangerousCharsRegex.test(val),
    {
      message: "Passord inneholder forbudte tegn",
    }
  ),
});

export type UsernameChangeFormData = z.infer<typeof usernameChangeSchema>;

// Email Change Validation
export const emailChangeSchema = z.object({
  email: universalEmailValidation,
  currentPassword: universalCurrentPasswordValidation.refine(
    (val) => !dangerousCharsRegex.test(val),
    {
      message: "Passord inneholder forbudte tegn",
    }
  ),
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// Password Change Validation
export const passwordChangeSchema = z
  .object({
    currentPassword: universalCurrentPasswordValidation.refine(
      (val) => !dangerousCharsRegex.test(val),
      {
        message: "Passord inneholder forbudte tegn",
      }
    ),
    newPassword: universalStrongPasswordValidation,
    confirmPassword: universalConfirmPasswordValidation.refine(
      (val) => !dangerousCharsRegex.test(val),
      {
        message: "Passord inneholder forbudte tegn",
      }
    ),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passordene må være like",
        path: ["confirmPassword"],
      });
    }
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Account Deletion Validation
export const accountDeletionSchema = z.object({
  password: universalCurrentPasswordValidation.refine(
    (val) => !dangerousCharsRegex.test(val),
    {
      message: "Passord inneholder forbudte tegn",
    }
  ),
});

export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;

// Account Deletion Verification
export const accountDeletionVerificationSchema = z.object({
  verificationCode: universalVerificationCodeValidation.refine(
    (val) => !dangerousCharsRegex.test(val),
    {
      message: "Verifiseringskode inneholder forbudte tegn",
    }
  ),
  deletionReason: z
    .string()
    .max(256, { message: "Grunn kan maksimalt være 256 tegn" })
    .refine((val) => !val || !dangerousCharsRegex.test(val), {
      message: "Grunn inneholder forbudte tegn",
    })
    .optional(),
});

export type AccountDeletionVerificationFormData = z.infer<
  typeof accountDeletionVerificationSchema
>;

// Notification Settings
export const notificationSettingsSchema = z.object({
  importantUpdates: z.boolean(),
  newsletter: z.boolean(),
});

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;

// Phone Number
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return "";

  const digitsOnly = phoneNumber.replace(/\D/g, "");

  if (digitsOnly.length === 0) return "";

  if (digitsOnly.length === 8 && !phoneNumber.startsWith("+")) {
    return `+47 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
      3,
      5
    )} ${digitsOnly.slice(5)}`;
  }

  if (digitsOnly.startsWith("47") && digitsOnly.length >= 10) {
    const localPart = digitsOnly.slice(2, 10);
    return `+47 ${localPart.slice(0, 3)} ${localPart.slice(
      3,
      5
    )} ${localPart.slice(5, 8)}`;
  }

  if (phoneNumber.startsWith("+")) {
    const countryCodeMatch = phoneNumber.match(/^\+(\d+)/);
    if (countryCodeMatch) {
      const countryCode = countryCodeMatch[1];
      const localPart = digitsOnly.slice(countryCode.length);

      if (localPart.length === 8) {
        return `+${countryCode} ${localPart.slice(0, 3)} ${localPart.slice(
          3,
          5
        )} ${localPart.slice(5, 8)}`;
      }
    }
  }

  if (!phoneNumber.includes("+")) {
    return `+47 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
      3,
      5
    )} ${digitsOnly.slice(5, 8)}`;
  }

  return phoneNumber;
}

export function extractPhoneDigits(phoneNumber: string): string {
  if (!phoneNumber) return "";

  const digitsOnly = phoneNumber.replace(/\D/g, "");

  return digitsOnly.startsWith("47") ? digitsOnly.slice(2) : digitsOnly;
}

export function formatDateForStorage(norwegianDate: string): string {
  if (!norwegianDate) return "";

  if (norwegianDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return norwegianDate;
  }

  if (!norwegianDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
    return norwegianDate;
  }

  const [day, month, year] = norwegianDate.split(".");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function formatDateForDisplay(isoDate: string): string {
  if (!isoDate) return "";

  if (isoDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
    return isoDate;
  }

  // Check if in ISO format
  if (!isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return isoDate;
  }

  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export function validatePhoneNumber(phoneNumber: string): {
  isValid: boolean;
  error?: string;
} {
  if (!phoneNumber) return { isValid: true };

  const result = norwegianPhoneNumberValidation.safeParse(phoneNumber);

  if (!result.success) {
    return {
      isValid: false,
      error: result.error.errors[0]?.message || "Ugyldig telefonnummer",
    };
  }

  return { isValid: true };
}

export function validateDate(dateString: string): {
  isValid: boolean;
  error?: string;
} {
  if (!dateString) return { isValid: true };

  const result = norwegianDateValidation.safeParse(dateString);

  if (!result.success) {
    return {
      isValid: false,
      error: result.error.errors[0]?.message || "Ugyldig dato",
    };
  }

  return { isValid: true };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateProfileForm<T>(
  schema: z.ZodType<T>,
  formData: Partial<T>
): ValidationResult {
  try {
    schema.parse(formData);
    return { isValid: true };
  } catch (error) {
    const zodError = error as z.ZodError;
    return {
      isValid: false,
      error: zodError.errors[0]?.message || "Validering feilet",
    };
  }
}

// Profile Image Validation
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
