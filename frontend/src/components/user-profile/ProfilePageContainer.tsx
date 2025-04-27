// src/components/user-profile/ProfilePageContainer.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { PublicProfile } from './sections/PublicProfile';
import { PersonalInfo } from './sections/PersonalInfo';
import { Notification } from './sections/Notification';
import { LoginInfoManage } from './sections/LoginInfoManage';
import { AccountAdministration } from './sections/AccountAdministration';
import { getUserProfile, UserProfile } from '@/lib/data/services/userProfile';

export function ProfilePageContainer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Hent profil med alle relevante relasjoner
        const fetchedProfile = await getUserProfile();
        setProfile(fetchedProfile);
      } catch (err) {
        setError('Kunne ikke hente brukerprofil. Vennligst prøv igjen senere.');
        console.error('Feil ved henting av profil:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Laster profil...</div>;
  }
  
  if (error || !profile) {
    return <div className="text-red-500 p-8">{error || 'Ingen profildata funnet'}</div>;
  }
  
  return (
    <section className="space-y-6">
      <PublicProfile profile={profile} onProfileUpdate={handleProfileUpdate} />
      <PersonalInfo 
        profile={profile} 
        onProfileUpdate={handleProfileUpdate} 
      />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LoginInfoManage />
            <Notification />
          </div>
          <AccountAdministration />
        </section>
      );
    }