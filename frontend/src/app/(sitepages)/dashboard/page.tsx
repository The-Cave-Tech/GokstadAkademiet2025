"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import { fetchProfileByName } from "@/lib/data/services/strapiProfileData";
import { UserProfile } from "@/types/dashboard";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>("admin"); // Default role
  const [error, setError] = useState<string | null>(null);

  // Map roles to profile indices (not IDs)
  const profileNameMap = {
    user: "Adam",
    user_member_1: "Bendik",
    user_member_2: "Aslan",
    admin: "Simen",
  };

  // Fetch profile based on selected role
  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      const profileName =
        profileNameMap[role as keyof typeof profileNameMap] || "UX/UI Designer";
      console.log(
        `Loading profile for role ${role}, looking for name: ${profileName}`
      );

      try {
        const profileData = await fetchProfileByName(profileName);

        if (profileData) {
          setProfile(profileData);
          console.log(
            `Profile loaded successfully: ${profileData.profileName}`
          );
        } else {
          const errorMsg =
            "Failed to load profile. Check Strapi configuration.";
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

    loadProfile();
  }, [role]);

  // Role selection buttons
  const roleOptions = [
    { id: 1, name: "Adam", role: "user" },
    { id: 2, name: "Bendik", role: "user_member_1" },
    { id: 3, name: "Aslan", role: "user_member_2" },
    { id: 4, name: "Simen", role: "admin" },
  ];

  return (
    <div>
      {/* Role switcher */}
      <div className="bg-gray-100 p-4 m-4 rounded">
        <h2 className="text-lg font-bold mb-2">Profile Switcher</h2>
        <div className="flex gap-2 flex-wrap">
          {roleOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setRole(option.role)}
              className={`px-3 py-1 rounded ${
                role === option.role ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {option.role}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
          <p>{error}</p>
        </div>
      )}

      <Dashboard profile={profile} role={role} isLoading={isLoading} />
    </div>
  );
}
