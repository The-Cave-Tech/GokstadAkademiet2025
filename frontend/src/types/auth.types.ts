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

export interface StrapiError {
  message: string;
}

export interface RegisterFormState {
  zodErrors: SignUpValidationErrors | null;
  strapiErrors: StrapiError | null;
  values: Record<string, string>;
}

export interface LoginFormState {
  zodErrors: SignInValidationErrors | null;
  strapiErrors: StrapiError | null;
  values: Record<string, string>;
}

export type SignUpValidationErrorKeys = keyof SignUpValidationErrors;
export type SignInValidationErrorKeys = keyof SignInValidationErrors;