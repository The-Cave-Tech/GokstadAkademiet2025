export interface SignUpValidationErrors {
    username: string[];
    email: string[];
    password: string[];
    repeatPassword: string[];
  }
  
  export interface SignInValidationErrors {
    identifier: string[];
    password: string[];
  }
  
  export interface RegisterFormState {
    zodErrors: SignUpValidationErrors | null;
    strapiErrors: SignUpValidationErrors | null;
    values: Record<string, string>;
  }
  
  export interface LoginFormState {
    zodErrors: SignInValidationErrors | null;
    strapiErrors: SignInValidationErrors | null;
    values: Record<string, string>;
  }
  
  export type SignUpValidationErrorKeys = keyof SignUpValidationErrors;
  export type SignInValidationErrorKeys = keyof SignInValidationErrors;