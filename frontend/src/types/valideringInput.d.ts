type SignInSchema = z.infer<typeof signInSchema>;

type ValidationErrorKeys = keyof z.infer<typeof signUpSchema>;
type ValidationErrors = Partial<Record<ValidationErrorKeys, string[]>>;

type FormState = {
     zodErrors: Partial<Record<keyof z.infer<typeof signUpSchema>, string[]>> | null;
     strapiErrors: null;
     values?: Partial<z.infer<typeof signUpSchema>>; 
  }

  

