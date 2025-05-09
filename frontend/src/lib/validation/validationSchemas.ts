import { z } from "zod";


const usernameRegex = /^[a-zA-Z0-9_-]+$/;
const dangerousCharsRegex = /[<>"'%;()&+`|/\\[\]=]/;

const usernameValidation = z
  .string()
  .trim() 
  .min(6, { message: "Brukernavn må være minst 6 tegn" })
  .max(20, { message: "Brukernavn må være maks 20 tegn" })
  .regex(/[0-9]/, { message: "Brukernavn må inneholde minst ett tall" })
  .regex(usernameRegex, {
    message: "Brukernavn kan kun inneholde bokstaver, tall, bindestrek og understrek",
  })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "Brukernavn inneholder forbudte tegn",
  })
  .transform((val) =>
    val
      .toLowerCase()
      .replace(dangerousCharsRegex, "") 
  );

const passwordValidation = z
  .string()
  .trim()
  .min(8, { message: "Passord må være minst 8 tegn" })
  .max(100, { message: "Passord må være maks 100 tegn" })
  .regex(/[A-Z]/, { message: "Passord må inneholde minst én stor bokstav" })
  .regex(/[a-z]/, { message: "Passord må inneholde minst én liten bokstav" })
  .regex(/[0-9]/, { message: "Passord må inneholde minst ett tall" })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Passord må inneholde minst ett spesialtegn",
  })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "Passord inneholder forbudte tegn",
  })
  .refine((val) => !val.includes(" "), {
    message: "Passord kan ikke inneholde mellomrom",
  });

const emailValidation = z
  .string()
  .trim()
  .email({ message: "Ugyldig e-postadresse, f.eks. ola@nordmann.no" })
  .max(100, { message: "E-post må være maks 100 tegn" })
  .refine((val) => !dangerousCharsRegex.test(val), {
    message: "E-post inneholder forbudte tegn",
  })
  .transform((val) =>
    val
      .toLowerCase()
      .replace(dangerousCharsRegex, "") 
  );

const repeatPasswordValidation = z
  .string()
  .trim()
  .min(1, { message: "Bekreft passordet ditt" });

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

  export type SignUpFormData = z.infer<typeof signUpSchema>;

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