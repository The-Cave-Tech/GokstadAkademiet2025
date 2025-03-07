type SignUpSchema = z.infer<typeof signUpSchema>;

type SignInSchema = z.infer<typeof signInSchema>;

// valideringInput.d.ts
type FormState = {
     zodErrors: Partial<Record<keyof z.infer<typeof signUpSchema>, string[]>> | null;
     strapiErrors: null;
     message: string;
     values?: Partial<z.infer<typeof signUpSchema>>; 
  }