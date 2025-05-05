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

export async function requestUsernameChange(
  username: string, 
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    return await strapiService.fetch<{ success: boolean; message: string }>(
      "user-credentials/request-username-change",
      {
        method: "POST",
        body: { username, password }
      }
    );
  } catch (error) {
    console.error("Feil ved forespørsel om brukernavn:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Kunne ikke sende forespørsel om endring av brukernavn";
    throw new Error(errorMessage);
  }
}

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
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Kunne ikke endre brukernavn";
    throw new Error(errorMessage);
  }
}

export async function requestEmailChange(
  newEmail: string,
  password: string
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
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Kunne ikke sende forespørsel om endring av e-post";
    throw new Error(errorMessage);
  }
}

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
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Kunne ikke verifisere e-postendring";
    throw new Error(errorMessage);
  }
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResponse> {
    try {
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Kunne ikke endre passord";
      throw new Error(errorMessage);
    }
  }

  export async function resendUsernameVerification(): Promise<{ success: boolean; message: string }> {
    try {
      return await strapiService.fetch<{ success: boolean; message: string }>(
        "user-credentials/resend-username-verification",
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

  export async function resendEmailVerification(): Promise<{ success: boolean; message: string }> {
    try {
      return await strapiService.fetch<{ success: boolean; message: string }>(
        "user-credentials/resend-email-verification",
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