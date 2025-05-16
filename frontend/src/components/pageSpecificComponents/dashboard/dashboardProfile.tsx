"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileDisplayCard from "../user-profile/UserPublicInfo/ProfileDisplayCard";
import { useProfileState } from "@/hooks/useProfileState";

export default function DashboardProfile() {
  const { profile, isLoading, error, refreshProfile } = useProfileState();
  const router = useRouter();

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile, router]); 

  if (isLoading) {
    return <div className="flex justify-center p-8">Laster profil...</div>;
  }

  if (error || !profile) {
    return <div className="text-danger p-8">{error || "Ingen profildata funnet"}</div>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto">
      <ProfileDisplayCard
        profile={profile}
        size="lg"
        className="shadow-none"
        avatarSize={200}
      />
    </section>
  );
}