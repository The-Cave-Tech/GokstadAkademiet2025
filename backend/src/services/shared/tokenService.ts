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