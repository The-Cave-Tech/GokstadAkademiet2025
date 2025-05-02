/**
 * Utility functions for calculating and evaluating password strength
 */

// Regex patterns for password validation
export const PASSWORD_PATTERNS = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    numbers: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    spaces: /\s/
  };
  
  // Farlige tegn som ikke bør være i passord
  export const dangerousCharsRegex = /[<>"'%;()&+`|/\\[\]=]/;
  
  /**
   * Calculate password strength score (0-100)
   * @param password The password to evaluate
   * @returns A numeric score from 0-100 representing the password strength
   */
  export const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length gives points
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    
    // Different character types give points
    if (PASSWORD_PATTERNS.uppercase.test(password)) strength += 15;
    if (PASSWORD_PATTERNS.lowercase.test(password)) strength += 15;
    if (PASSWORD_PATTERNS.numbers.test(password)) strength += 15;
    if (PASSWORD_PATTERNS.special.test(password)) strength += 15;
    
    return Math.min(100, strength);
  };
  
  /**
   * Sjekker om passord oppfyller minimumskrav til styrke
   * @param password Passordet som skal sjekkes
   * @param minimumStrength Minimum styrke som kreves (standard: 50)
   * @returns boolean som indikerer om passordet møter minimumskravet
   */
  export const meetsMinimumStrength = (password: string, minimumStrength: number = 50): boolean => {
    return calculatePasswordStrength(password) >= minimumStrength;
  };
  
  /**
   * Hjelpefunksjon for å få informasjon om passordstyrke
   * @param password Passordet som skal evalueres
   * @returns Objekt med farger og tekst for visuell representasjon
   */
  export const getPasswordStrengthInfo = (password: string) => {
    const strength = calculatePasswordStrength(password);
    
    if (strength < 30) return { 
      color: "bg-red-500", 
      text: "Svakt", 
      textColor: "text-red-600" 
    };
    
    if (strength < 60) return { 
      color: "bg-yellow-500", 
      text: "Middels", 
      textColor: "text-yellow-600" 
    };
    
    if (strength < 80) return { 
      color: "bg-blue-500", 
      text: "Sterkt", 
      textColor: "text-blue-600" 
    };
    
    return { 
      color: "bg-green-500", 
      text: "Meget sterkt", 
      textColor: "text-green-600" 
    };
  };