// lib/data/services/profileService.ts
import { getAuthCookie } from "@/lib/utils/cookie";
import { UserProfile } from "@/types/dashboard";

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const token = await getAuthCookie();
    console.log("getUserProfile Token:", token);

    if (!token) throw new Error("No authentication token found");

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user profile: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    console.log("getUserProfile Response:", userData);

    return {
      profileName: userData.username || "User",
      id: userData.id || 0,
      bio: userData.bio || "",
      profilePicture: userData.profilePicture || null,
    };
  } catch (error) {
    console.error("[ProfileService] Error fetching user profile:", error);
    throw error;
  }
}

export async function getUserRole(): Promise<string> {
  const token = await getAuthCookie();
  if (!token) throw new Error("No authentication token found");

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const response = await fetch(`${baseUrl}/api/users/me?populate[role][fields][0]=name`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch user role");
  const userData = await response.json();
  return userData.role?.name || "Authenticated users";
}