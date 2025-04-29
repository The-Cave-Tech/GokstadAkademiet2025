export interface ValidationResult {
    isValid: boolean;
    error?: string;
  }

  export interface PasswordStrengthInfo {
    color: string;
    text: string;
    textColor: string;
  }

  export interface PasswordValidationOptions {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    disallowSpaces?: boolean;
    minStrength?: number;
  }
  
  export interface PasswordChangeValidation {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface PasswordStrengthMeterProps {
    password: string;
    showLabel?: boolean;
    className?: string;
  }