"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import { UserProfile } from "@/types/dashboard";
import { fetchUserProfile } from "@/lib/data/services/strapiProfileData";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>(""); // Placeholder, should come from auth context
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchUserProfile();
        setProfile(profileData);
        setRole("admin"); // Replace with actual role logic from authentication
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return <Dashboard profile={profile} role={role} isLoading={isLoading} />;
}
