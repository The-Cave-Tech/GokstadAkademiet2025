import { Suspense } from "react";

export default function MyAccountPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Min Profil</h1>
      
      <Suspense fallback={<div className="text-center py-10">Laster profilinformasjon...</div>}>
      </Suspense>
    </div>
  );
}
