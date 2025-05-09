"use client";

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, UserProfile } from '@/lib/data/services/userProfile';

export function useProfileState() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedProfile = await getUserProfile();
      setProfile(fetchedProfile);
      setError(null);
    } catch (err) {
      setError('Could not fetch user profile. Please try again later.');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updateProfile = useCallback((updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  }, []);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile
  };
}