import { z } from "zod";

// Regex for validering
const usernameRegex = /^[a-zA-Z0-9_-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Brukernavn-validering
const usernameValidation = z
  .string()
  .min(6, { message: "Brukernavn må være minst 6 tegn" })
  .max(20, { message: "Brukernavn må være maks 20 tegn" })
  .regex(usernameRegex, { 
    message: "Brukernavn kan kun inneholde bokstaver, tall, bindestrek og understrek" 
  })
  .trim()
  .transform(val => val.toLowerCase());

// Passord-validering
const passwordValidation = z
  .string()
  .min(8, { message: "Passord må være minst 8 tegn" })
  .max(100, { message: "Passord må være maks 100 tegn" })
  .regex(/[A-Z]/, { message: "Passord må inneholde minst én stor bokstav" })
  .regex(/[0-9]/, { message: "Passord må inneholde minst ett tall" })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { 
    message: "Passord må inneholde minst ett spesialtegn" 
  })
  .trim();

// E-post-validering
const emailValidation = z
  .string()
  .email({ message: "Vennligst skriv inn en gyldig e-postadresse" })
  .max(100, { message: "E-post må være maks 100 tegn" })
  .trim()
  .transform(val => val.toLowerCase());

// Validering for gjentatt passord (trimmet)
const repeatPasswordValidation = z.string().trim();

// **Registreringsskjema (sign up)**
export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
    repeatPassword: repeatPasswordValidation,
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

// **Innloggingsskjema (sign in)**
export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Skriv inn minst 3 tegn" })
    .max(100, { message: "Maks 100 tegn" })
    .trim()
    .refine((val) => emailRegex.test(val) || usernameRegex.test(val), {
      message: "Må være en gyldig e-post eller brukernavn",
    }),
  password: passwordValidation,
  rememberMe: z.boolean().optional(),
});



