// Decodes a JWT token and returns the payload as a JSON object.
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("[JWT] Error parsing JWT:", error);
    return null;
  }
}

// Token expiration check
export function isTokenExpired(token: string): boolean {
  const tokenData = parseJwt(token);
  if (!tokenData || !tokenData.exp) return true;
  return Date.now() >= tokenData.exp * 1000;
}

// Token expiration check with time remaining
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return "0 sekunder";
  
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds} sekunder`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minutt${minutes !== 1 ? 'er' : ''} og ${remainingSeconds} sekund${remainingSeconds !== 1 ? 'er' : ''}`;
}

// Get time to expiration in milliseconds
export function getTimeToExpiration(token: string): number {
  const tokenData = parseJwt(token);
  if (!tokenData?.exp) return 0;
  return (tokenData.exp * 1000) - Date.now();
}