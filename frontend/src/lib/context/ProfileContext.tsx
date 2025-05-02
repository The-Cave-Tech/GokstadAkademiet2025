// src/lib/context/ProfileContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserProfile, UserProfile } from '@/lib/data/services/userProfile';

type ProfileContextType = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updatedProfile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      const fetchedProfile = await getUserProfile();
      setProfile(fetchedProfile);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente brukerprofil. Vennligst prøv igjen senere.');
      console.error('Feil ved henting av profil:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      isLoading, 
      error, 
      updateProfile, 
      refreshProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}