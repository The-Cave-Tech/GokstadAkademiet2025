import { SignUpValidationErrors, SignInValidationErrors } from "@/types/auth.types";

export function authFieldError(
  validationErrors: SignUpValidationErrors | SignInValidationErrors,
  formStateErrors: SignUpValidationErrors | SignInValidationErrors,
  fieldName: keyof SignUpValidationErrors | keyof SignInValidationErrors
): string[] {
  return validationErrors[fieldName as keyof typeof validationErrors].length > 0
    ? validationErrors[fieldName as keyof typeof validationErrors]
    : formStateErrors[fieldName as keyof typeof formStateErrors];
}
  