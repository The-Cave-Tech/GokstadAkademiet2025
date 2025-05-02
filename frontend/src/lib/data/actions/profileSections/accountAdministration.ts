"use server";

import { 
  accountDeletionSchema, 
  accountDeletionVerificationSchema 
} from "@/lib/validation/profileSectionValidation";
import { 
  requestAccountDeletion, 
  verifyAndDeleteAccount 
} from "@/lib/data/services/profileSections/accountAdministrationService";

import { handleValidationErrors, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { removeAuthCookie } from "@/lib/utils/cookie";
import { redirect } from "next/navigation";
import {
  AccountDeletionFormState,
  AccountDeletionVerificationFormState
} from "@/types/profileValidation.types";
import { AccountDeletionValidationErrors, AccountDeletionVerificationValidationErrors } from "@/types/validationError.types";

// Request account deletion
export async function requestAccountDeletionAction(
  prevState: AccountDeletionFormState,
  formData: FormData
): Promise<AccountDeletionFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = accountDeletionSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      password: [],
    }) as AccountDeletionValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const response = await requestAccountDeletion(fields.password);
    
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

// Verify and delete account
export async function verifyAndDeleteAccountAction(
  prevState: AccountDeletionVerificationFormState,
  formData: FormData
): Promise<AccountDeletionVerificationFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = accountDeletionVerificationSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      verificationCode: [],
      deletionReason: [],
    }) as AccountDeletionVerificationValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const response = await verifyAndDeleteAccount(
      fields.verificationCode, 
      fields.deletionReason
    );
    
    if (response.success) {
      await removeAuthCookie();
      redirect("/?message=Din konto er nå slettet");
    }
    
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