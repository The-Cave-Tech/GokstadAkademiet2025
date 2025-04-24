import { ProfilePageContainer } from "@/components/user-profile/ProfilePageContainer";
import { Suspense } from "react";

export default function MyAccountPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Min Profil</h1>
      
      <Suspense fallback={<div className="text-center py-10">Laster profilinformasjon...</div>}>
      <ProfilePageContainer />
      </Suspense>
    </div>
  );
}
