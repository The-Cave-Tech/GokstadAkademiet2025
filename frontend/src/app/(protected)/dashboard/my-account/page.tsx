// src/app/(protected)/dashboard/my-acoount.page.tsx
"use client";

import { ProfilePageContainer } from "@/components/features/user-profile/ProfilePageContainer";
import { Suspense } from "react";
import "@/styles/profile-page.css";
import BackButton from "@/components/ui/BackButton";
import { useHydration } from "@/hooks/useHydration";

export default function MyAccountPage() {
  const hasHydrated = useHydration();

  // Vis en enkel loading-tilstand før hydrering
  if (!hasHydrated) {
    return (
      <div className="w-full max-w-7xl mx-auto py-8 px-6">
        <div className="text-center py-10">Laster profilinformasjon...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Min Profil</h1>
      
      <Suspense fallback={<div className="text-center py-10">Laster profilinformasjon...</div>}>
        <ProfilePageContainer />
      </Suspense>
    </div>
  );
}