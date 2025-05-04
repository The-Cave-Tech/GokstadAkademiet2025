// src/lib/data/services/profileSections/accountAdministrationService.ts

import { strapiService } from "../strapiClient";
import { removeAuthCookie } from "@/lib/utils/cookie";
import { AccountDeletionResponse } from "@/types/accountAdministration.types";

export async function requestAccountDeletion(password: string): Promise<AccountDeletionResponse> {
    try {
      return await strapiService.fetch<AccountDeletionResponse>(
        "user-profiles/request-account-deletion",
        {
          method: "POST",
          body: { password: password }
        }
      );
    } catch (error) {
      console.error("Feil ved forespørsel om kontosletting:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Kunne ikke sende forespørsel om kontosletting";
      throw new Error(errorMessage);
    }
  }

export async function verifyAndDeleteAccount(
  verificationCode: string,
  deletionReason?: string
): Promise<AccountDeletionResponse> {
  try {
    const result = await strapiService.fetch<AccountDeletionResponse>(
      "user-profiles/delete-account",
      {
        method: "POST",
        body: { verificationCode, deletionReason }
      }
    );
    
    await removeAuthCookie();
    
    return result;
  } catch (error) {
    console.error("Feil ved sletting av konto:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Kunne ikke slette konto";
    throw new Error(errorMessage);
  }
}

export async function resendDeletionVerification(): Promise<{ success: boolean; message: string }> {
    try {
      return await strapiService.fetch<{ success: boolean; message: string }>(
        "user-profiles/resend-deletion-verification",
        {
          method: "POST"
        }
      );
    } catch (error) {
      console.error("Feil ved sending av ny kode:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Kunne ikke sende ny kode";
      throw new Error(errorMessage);
    }
  }