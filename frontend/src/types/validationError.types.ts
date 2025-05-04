// src/types/validationError.types.ts

// Hjelpetype for å sikre at typene kan indekseres med strenger
export type ValidationErrorRecord = Record<string, string[]>;

export interface PublicProfileValidationErrors extends ValidationErrorRecord {
  displayName: string[];
  biography: string[];
  showEmail: string[];
  showPhone: string[];
  showAddress: string[];
}

export interface PersonalInfoValidationErrors extends ValidationErrorRecord {
  fullName: string[];
  birthDate: string[];
  gender: string[];
  phoneNumber: string[];
  streetAddress: string[];
  postalCode: string[];
  city: string[];
}

export interface UsernameChangeValidationErrors extends ValidationErrorRecord {
  username: string[];
  currentPassword: string[];
}

export interface EmailChangeValidationErrors extends ValidationErrorRecord {
  email: string[];
  currentPassword: string[];
}

export interface PasswordChangeValidationErrors extends ValidationErrorRecord {
  currentPassword: string[];
  newPassword: string[];
  confirmPassword: string[];
}

export interface AccountDeletionValidationErrors extends ValidationErrorRecord {
  password: string[];
}

export interface AccountDeletionVerificationValidationErrors extends ValidationErrorRecord {
  verificationCode: string[];
  deletionReason: string[];
}

export interface NotificationSettingsValidationErrors extends ValidationErrorRecord {
  importantUpdates: string[];
  newsletter: string[];
}

export interface ProfileImageValidationErrors extends ValidationErrorRecord {
  file: string[];
}

// Type alias for alle profil-relaterte valideringsfeiltyper for enklere bruk
export type ProfileValidationErrorTypes = 
  | PublicProfileValidationErrors
  | PersonalInfoValidationErrors
  | UsernameChangeValidationErrors
  | EmailChangeValidationErrors
  | PasswordChangeValidationErrors
  | AccountDeletionValidationErrors
  | AccountDeletionVerificationValidationErrors
  | NotificationSettingsValidationErrors
  | ProfileImageValidationErrors;