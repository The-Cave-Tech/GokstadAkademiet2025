import { getAuthCookie } from "@/lib/utils/cookie";
import { strapiService } from "./strapiClient";

export interface UserProfile {
  id: number;
  documentId: string;
  users_permissions_user: number;
  publicProfile: {
    displayName: string;
    biography: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    profileimage?: {
      url: string;
      formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
      };
    };
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("Ingen autentiseringstoken funnet");
  }

  console.log("Fetching user profile");
  return strapiService.fetch<UserProfile>("user-profiles/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updatePublicProfile(
  data: Partial<UserProfile["publicProfile"]>
): Promise<UserProfile> {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("Ingen autentiseringstoken funnet");
  }

  console.log("Updating public profile with data:", data);
  const response = await strapiService.fetch<UserProfile>(
    "user-profiles/me/public-profile",
    {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { data },
    }
  );

  console.log("Updated public profile response:", response);
  return response;
}

export async function uploadProfileImage(file: File): Promise<UserProfile> {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("Ingen autentiseringstoken funnet");
  }

  const formData = new FormData();
  formData.append("files", file);

  console.log("Uploading profile image");
  try {
    // Upload the image to Strapi
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Upload error:", errorData);
      throw new Error(`Kunne ikke laste opp bildet: ${uploadResponse.status}`);
    }

    const uploadedFiles = await uploadResponse.json();
    console.log("Uploaded files:", uploadedFiles);

    // Fetch the current user profile to get existing publicProfile data
    const currentProfile = await getUserProfile();
    console.log("Current user profile:", currentProfile);

    // Merge existing publicProfile data with the new profileimage
    const updatedPublicProfile = {
      ...currentProfile.publicProfile,
      profileimage: uploadedFiles[0].id,
    };

    // Update the public profile with the merged data
    return updatePublicProfile(updatedPublicProfile);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export function getProfileImageUrl(profile: UserProfile | null): string {
  if (!profile?.publicProfile?.profileimage) return "";
  return strapiService.media.getMediaUrl(profile.publicProfile.profileimage);
}