//frontend/src/types/auth.types.ts
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
  success: boolean;
}

export interface OAuthCallbackResult {
  success: boolean;
  error?: string;
}

export interface SocialLoginButton {
  provider: string;
  text: string;
  src: string;
}

export type SignUpValidationErrorKeys = keyof SignUpValidationErrors;
export type SignInValidationErrorKeys = keyof SignInValidationErrors;