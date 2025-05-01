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
          body: { password: password } // Use explicit property name and value 
        }
      );
    } catch (error) {
      console.error("Feil ved forespørsel om kontosletting:", error);
      throw new Error(error instanceof Error ? error.message : "Kunne ikke sende forespørsel om kontosletting");
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
    throw new Error(error instanceof Error ? error.message : "Kunne ikke slette konto");
  }
}