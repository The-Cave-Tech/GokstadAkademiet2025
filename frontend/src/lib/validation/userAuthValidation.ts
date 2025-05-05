/**
 * Valideringsskjemaer for autentisering (pålogging og registrering)
 */
import { z } from "zod";
import { 
  universalUsernameValidation,
  universalEmailValidation,
  universalStrongPasswordValidation,
  universalConfirmPasswordValidation,
  dangerousCharsRegex
} from "@/lib/validation/universalValidation";
import { ValidationResult } from "@/types/universalPassword.types";

/**
 * Skjema for registrering
 */
export const signUpSchema = z
  .object({
    username: universalUsernameValidation,
    email: universalEmailValidation,
    password: universalStrongPasswordValidation,
    repeatPassword: universalConfirmPasswordValidation,
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passordene må være like",
        path: ["repeatPassword"],
      });
    }
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Skjema for innlogging
 */
export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Fyll inn brukernavn eller e-post" })
    .max(100, { message: "Maks 100 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Identifikator inneholder forbudte tegn",
    })
    .transform((val) =>
      val
        .toLowerCase()
        .replace(dangerousCharsRegex, "") 
    ),
  password: z
    .string()
    .trim()
    .min(1, { message: "Fyll inn passord" })
    .max(100, { message: "Maks 100 tegn" })
    .refine((val) => !dangerousCharsRegex.test(val), {
      message: "Passord inneholder forbudte tegn",
    }),
  remember: z.enum(["on"]).optional(),
});

export type SignInFormData = {
  identifier: string;
  password: string;
  remember?: boolean;
};

/**
 * Hjelpefunksjoner for validering av registreringsskjema
 */
export function validateSignUpForm(formData: Partial<SignUpFormData>): ValidationResult {
  try {
    signUpSchema.parse(formData);
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
 * Hjelpefunksjoner for validering av innloggingsskjema
 */
export function validateSignInForm(formData: Partial<SignInFormData>): ValidationResult {
  try {
    signInSchema.parse(formData);
    return { isValid: true };
  } catch (error) {
    const zodError = error as z.ZodError;
    return { 
      isValid: false, 
      error: zodError.errors[0]?.message || "Validering feilet" 
    };
  }
}