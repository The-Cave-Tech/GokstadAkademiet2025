"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import { fetchLoggedInUserProfile } from "@/lib/data/services/strapiProfileData";
import { UserProfile } from "@/types/dashboard";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the logged-in user's profile
  useEffect(() => {
    async function loadUserProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const profileData = await fetchLoggedInUserProfile();

        if (profileData) {
          setProfile(profileData);
          console.log(`Profile loaded successfully`);
        } else {
          const errorMsg =
            "Failed to load user profile. Please log in again or contact support.";
          console.error(errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = `Error loading profile: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        console.error(errorMsg, err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  return (
    <div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
          <p>{error}</p>
        </div>
      )}

      <Dashboard
        profile={profile}
        isLoading={isLoading}
        role={profile?.userRole || "user"}
      />
    </div>
  );
}
