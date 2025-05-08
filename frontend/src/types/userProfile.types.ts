export type UserAuthProvider = 'local' | 'google' | 'facebook' | null;

export function getProviderDisplayName(provider?: string): string {
  if (!provider || provider === 'local') return 'E-post og passord';
  
  const providerMap: Record<string, string> = {
    google: 'Google',
    facebook: 'Facebook',
    microsoft: 'Microsoft',
  };
  
  return providerMap[provider] || provider;
}

export function getProviderLoginUrl(provider: string): string {
  const providerMap: Record<string, string> = {
    google: 'https://accounts.google.com/',
    facebook: 'https://www.facebook.com/settings'
  };
  
  return providerMap[provider] || '#';
}