// src/types/profileValidation.types.ts

import { 
    PublicProfileValidationErrors,
    PersonalInfoValidationErrors,
    UsernameChangeValidationErrors,
    EmailChangeValidationErrors,
    PasswordChangeValidationErrors,
    AccountDeletionValidationErrors,
    AccountDeletionVerificationValidationErrors
  } from "./validationError.types";
  
  export interface PublicProfileFormState {
    zodErrors: PublicProfileValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string | boolean>;
    success: boolean;
  }
  
  export interface PersonalInfoFormState {
    zodErrors: PersonalInfoValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface UsernameChangeFormState {
    zodErrors: UsernameChangeValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface EmailChangeFormState {
    zodErrors: EmailChangeValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface PasswordChangeFormState {
    zodErrors: PasswordChangeValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface AccountDeletionFormState {
    zodErrors: AccountDeletionValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface AccountDeletionVerificationFormState {
    zodErrors: AccountDeletionVerificationValidationErrors | null;
    strapiErrors: { message: string } | null;
    values: Record<string, string>;
    success: boolean;
  }
  
  export interface NotificationSettingsFormState {
    strapiErrors: { message: string } | null;
    values: Record<string, boolean>;
    success: boolean;
  }