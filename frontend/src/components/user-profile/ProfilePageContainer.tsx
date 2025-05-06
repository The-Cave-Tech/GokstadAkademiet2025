// src/components/user-profile/ProfilePageContainer.tsx
"use client";
import React from 'react';
import { PublicProfile } from './sections/PublicProfile';
import { PersonalInfo } from './sections/PersonalInfo';
import { Notification } from './sections/Notification';
import { LoginInfoManage } from './sections/LoginInfoManage';
import { AccountAdministration } from './sections/AccountAdministration';
import { useProfileState } from '@/hooks/useProfileState';

export function ProfilePageContainer() {
  const { profile, isLoading, error, refreshProfile, updateProfile } = useProfileState();
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Laster profil...</div>;
  }
  
  if (error || !profile) {
    return <div className="text-red-500 p-8">{error || 'Ingen profildata funnet'}</div>;
  }
  
  return (
    <section className="space-y-6">
      <PublicProfile 
        profile={profile} 
        onProfileUpdate={updateProfile} 
        refreshProfile={refreshProfile}
      />
      <PersonalInfo 
        profile={profile} 
        refreshProfile={refreshProfile}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoginInfoManage refreshProfile={refreshProfile} />
        <Notification 
          profile={profile} 
          refreshProfile={refreshProfile}
        />
      </div>
      <AccountAdministration />
    </section>
  );
}