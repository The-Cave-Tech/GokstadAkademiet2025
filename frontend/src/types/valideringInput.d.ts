type ValidationErrorKeys = keyof z.infer<typeof signUpSchema>;
type ValidationErrorKeys = keyof z.infer<typeof signInSchema>;
type ValidationErrors = Partial<Record<ValidationErrorKeys, string[]>>;

type RegisterFormState = {
     zodErrors: Partial<Record<keyof z.infer<typeof signUpSchema>, string[]>> | null;
     strapiErrors: null;
     values?: Partial<z.infer<typeof signUpSchema>>; 
  }

  
  type LoginFormState = {
   zodErrors: Partial<Record<keyof z.infer<typeof signInSchema>, string[]>> | null;
   strapiErrors: null;
   values?: Partial<z.infer<typeof signInSchema>>; 
}
