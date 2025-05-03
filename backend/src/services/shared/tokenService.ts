// backend/src/services/shared/tokenService.ts

export interface TokenData {
  code: string;
  action: string;
  expiresAt: string;
  requestedAt: string;
  [key: string]: any; // For ekstra data som kan variere mellom ulike operasjoner
}

/**
 * Oppretter et token-objekt for verifiseringsoperasjoner
 */
export function createTokenData(code: string, action: string, additionalData: Record<string, any> = {}): TokenData {
  return {
    code,
    action,
    // 15 minutter utløpstid
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    requestedAt: new Date().toISOString(),
    ...additionalData
  };
}

/**
 * Lagrer token i brukerens resetPasswordToken-felt
 */
export async function storeTokenInUser(userId: number, tokenData: TokenData): Promise<void> {
  await strapi.entityService.update('plugin::users-permissions.user', userId, {
    data: {
      resetPasswordToken: JSON.stringify(tokenData)
    }
  });
    
  console.log(`Token stored for user ${userId}, action: ${tokenData.action}`);
}

/**
 * Henter og validerer token fra bruker
 */
export async function validateToken(userId: number, code: string, action: string): Promise<{valid: boolean; tokenData?: TokenData; error?: string}> {
  const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
    
  if (!user.resetPasswordToken) {
    return { valid: false, error: 'No token found' };
  }
    
  try {
    const tokenData = JSON.parse(user.resetPasswordToken) as TokenData;
        
    if (tokenData.code !== code) {
      return { valid: false, error: 'Invalid verification code' };
    }
        
    if (tokenData.action !== action) {
      return { valid: false, error: 'Invalid action type' };
    }
        
    if (new Date() > new Date(tokenData.expiresAt)) {
      return { valid: false, error: 'Verification code has expired' };
    }
        
    return { valid: true, tokenData };
  } catch (e) {
    console.error('Error parsing token data:', e);
    return { valid: false, error: 'Invalid token format' };
  }
}

/**
 * Fjerner token etter vellykket operasjon
 */
export async function clearToken(userId: number): Promise<void> {
  await strapi.entityService.update('plugin::users-permissions.user', userId, {
    data: {
      resetPasswordToken: null
    }
  });
    
  console.log(`Token cleared for user ${userId}`);
}

/**
 * Import the necessary mail service functions 
 */
import { 
  sendAccountDeletionVerification 
} from '../../services/mailServices/accountAdministrationMail';
import { 
  sendUsernameChangeVerification, 
  sendEmailChangeVerification 
} from '../../services/mailServices/credentialsMail';

/**
 * Resends verification code for a specific action
 */
export async function resendVerificationCode(userId: number, action: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find the user
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Check if there's an existing token
    if (!user.resetPasswordToken) {
      return { success: false, message: 'No verification in progress' };
    }
    
    let tokenData: TokenData;
    try {
      tokenData = JSON.parse(user.resetPasswordToken);
    } catch (e) {
      return { success: false, message: 'Invalid token format' };
    }
    
    // Check if the token is for the requested action
    if (tokenData.action !== action) {
      return { success: false, message: `No ${action} verification in progress` };
    }
    
    // Generate a new verification code and send the appropriate email
    let newCode: string;
    
    // Reuse the same verification code for consistency
    const existingCode = tokenData.code;
    
    switch (action) {
      case 'username':
        newCode = await sendUsernameChangeVerification(user.email, user.username, existingCode);
        break;
      case 'email':
        // For email change, we need the new email from the token
        if (!tokenData.newEmail) {
          return { success: false, message: 'Missing email information in token' };
        }
        newCode = await sendEmailChangeVerification(tokenData.newEmail, user.username, existingCode);
        break;
      case 'account-deletion':
        newCode = await sendAccountDeletionVerification(user.email, user.username, existingCode);
        break;
      default:
        return { success: false, message: 'Unsupported action type' };
    }
    
    // Update token expiration time
    tokenData.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    tokenData.requestedAt = new Date().toISOString();
    
    // Store updated token
    await storeTokenInUser(userId, tokenData);
    
    return { 
      success: true, 
      message: 'Verification code resent successfully'
    };
  } catch (error) {
    console.error(`Error resending verification for ${action}:`, error);
    return { 
      success: false, 
      message: `Could not resend verification: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}