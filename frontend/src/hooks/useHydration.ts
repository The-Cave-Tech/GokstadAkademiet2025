// src/hooks/useHydration.ts
import { useState, useEffect } from 'react';

export function useHydration() {
  const [hasHydrated, setHasHydrated] = useState(false);
  
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  
  return hasHydrated;
}