"use server";

import { 
  usernameChangeSchema, 
  emailChangeSchema, 
  passwordChangeSchema 
} from "@/lib/validation/profileSectionValidation";
import { 
  requestUsernameChange, 
  changeUsername, 
  requestEmailChange, 
  verifyEmailChange, 
  changePassword 
} from "@/lib/data/services/profileSections/credentialsService";

import { handleValidationErrors, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { 
  UsernameChangeFormState,
  EmailChangeFormState,
  PasswordChangeFormState
} from "@/types/profileValidation.types";
import { EmailChangeValidationErrors, PasswordChangeValidationErrors, UsernameChangeValidationErrors } from "@/types/validationError.types";

// Request username change
export async function requestUsernameChangeAction(
  prevState: UsernameChangeFormState,
  formData: FormData
): Promise<UsernameChangeFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = usernameChangeSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      username: [],
      currentPassword: [],
    }) as UsernameChangeValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const response = await requestUsernameChange(fields.username, fields.currentPassword);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      values: fields,
      success: response.success,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
      success: false,
    };
  }
}

// Verify username change
export async function verifyUsernameChangeAction(
  prevState: { verificationCode: string; success: boolean; error: string | null },
  formData: FormData
): Promise<{ verificationCode: string; success: boolean; error: string | null }> {
  const verificationCode = formData.get('verificationCode') as string;
  const username = formData.get('username') as string;

  if (!verificationCode || verificationCode.length !== 6) {
    return {
      ...prevState,
      error: "Verifiseringskoden må være 6 siffer",
      success: false,
    };
  }

  try {
    const response = await changeUsername(username, verificationCode);
    
    return {
      verificationCode,
      success: response.success,
      error: null,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      verificationCode,
      success: false,
      error: errorMessage,
    };
  }
}

// Request email change
export async function requestEmailChangeAction(
  prevState: EmailChangeFormState,
  formData: FormData
): Promise<EmailChangeFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = emailChangeSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      email: [],
      currentPassword: [],
    }) as EmailChangeValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const response = await requestEmailChange(fields.email, fields.currentPassword);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      values: fields,
      success: response.success,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
      success: false,
    };
  }
}

// Verify email change
export async function verifyEmailChangeAction(
  prevState: { verificationCode: string; success: boolean; error: string | null },
  formData: FormData
): Promise<{ verificationCode: string; success: boolean; error: string | null }> {
  const verificationCode = formData.get('verificationCode') as string;

  if (!verificationCode || verificationCode.length !== 6) {
    return {
      ...prevState,
      error: "Verifiseringskoden må være 6 siffer",
      success: false,
    };
  }

  try {
    const response = await verifyEmailChange(verificationCode);
    
    return {
      verificationCode,
      success: response.success,
      error: null,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      verificationCode,
      success: false,
      error: errorMessage,
    };
  }
}

// Change password
export async function changePasswordAction(
  prevState: PasswordChangeFormState,
  formData: FormData
): Promise<PasswordChangeFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = passwordChangeSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      currentPassword: [],
      newPassword: [],
      confirmPassword: [],
    }) as PasswordChangeValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const response = await changePassword(fields.currentPassword, fields.newPassword);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      values: { ...fields, newPassword: '', confirmPassword: '', currentPassword: '' },
      success: response.success,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
      success: false,
    };
  }
}