//CredentialsSerivice.ts

import { strapiService } from "../strapiClient";


interface UsernameChangeResponse {
  success: boolean;
  message: string;
  username: string;
}

interface EmailChangeResponse {
  success: boolean;
  message: string;
  email: string;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

/**
 * Send forespørsel om å endre brukernavn
 * @param username Nytt brukernavn
 */
export async function requestUsernameChange(username: string): Promise<{ success: boolean; message: string }> {
  try {
    return await strapiService.fetch<{ success: boolean; message: string }>(
      "user-credentials/request-username-change",
      {
        method: "POST",
        body: { username }
      }
    );
  } catch (error) {
    console.error("Feil ved forespørsel om brukernavn:", error);
    throw new Error(error.message || "Kunne ikke sende forespørsel om endring av brukernavn");
  }
}

/**
 * Bekreft endring av brukernavn med verifiseringskode
 * @param username Nytt brukernavn
 * @param verificationCode Verifiseringskode mottatt på e-post
 */
export async function changeUsername(
  username: string,
  verificationCode: string
): Promise<UsernameChangeResponse> {
  try {
    return await strapiService.fetch<UsernameChangeResponse>(
      "user-credentials/change-username",
      {
        method: "POST",
        body: { username, verificationCode }
      }
    );
  } catch (error) {
    console.error("Feil ved endring av brukernavn:", error);
    throw new Error(error.message || "Kunne ikke endre brukernavn");
  }
}

/**
 * Send forespørsel om å endre e-postadresse
 * @param newEmail Ny e-postadresse
 * @param password Nåværende passord for verifisering
 */
export async function requestEmailChange(
  newEmail: string,
  password?: string
): Promise<{ success: boolean; message: string }> {
  try {
    return await strapiService.fetch<{ success: boolean; message: string }>(
      "user-credentials/request-email-change",
      {
        method: "POST",
        body: { newEmail, password }
      }
    );
  } catch (error) {
    console.error("Feil ved forespørsel om e-post:", error);
    throw new Error(error.message || "Kunne ikke sende forespørsel om endring av e-post");
  }
}

/**
 * Bekreft endring av e-postadresse med verifiseringskode
 * @param verificationCode Verifiseringskode mottatt på ny e-post
 */
export async function verifyEmailChange(
  verificationCode: string
): Promise<EmailChangeResponse> {
  try {
    return await strapiService.fetch<EmailChangeResponse>(
      "user-credentials/verify-email-change",
      {
        method: "POST",
        body: { verificationCode }
      }
    );
  } catch (error) {
    console.error("Feil ved verifisering av e-post:", error);
    throw new Error(error.message || "Kunne ikke verifisere e-postendring");
  }
}

/**
 * Endre passord
 * @param currentPassword Nåværende passord
 * @param newPassword Nytt passord
 */
/**
 * Endre passord
 * @param currentPassword Nåværende passord
 * @param newPassword Nytt passord
 */
export async function changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResponse> {
    try {
      // Bruk samme mønster som for brukernavn- og e-postendring
      return await strapiService.fetch<PasswordChangeResponse>(
        "user-credentials/change-password",
        {
          method: "POST",
          body: { 
            currentPassword,
            newPassword,
            passwordConfirmation: newPassword 
          }
        }
      );
    } catch (error) {
      console.error("Feil ved endring av passord:", error);
      throw new Error(error.message || "Kunne ikke endre passord");
    }
  }