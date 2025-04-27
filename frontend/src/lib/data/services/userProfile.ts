// src/lib/data/services/userProfile.tsx

import { strapiService } from "./strapiClient";

export interface UserProfile {
  id: number;
  documentId?: string;
  users_permissions_user: number;
  publicProfile?: {
    displayName?: string;
    biography?: string;
    showEmail?: boolean;
    showPhone?: boolean;
    showAddress?: boolean;
    profileimage?: {
      id: number;
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


export interface UploadedFile {
  id: number;
  name: string;
  url: string;
  size: number;
  mime: string;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
}


export async function getUserProfile(populate: string = 'publicProfile,personalInformation,notificationSettings,accountAdministration'): Promise<UserProfile> {
  try {
    return await strapiService.fetch<UserProfile>(`user-profiles/me?populate=${populate}`);
  } catch (error) {
    console.error("Feil ved henting av brukerprofil:", error);
    throw new Error("Kunne ikke hente brukerprofil");
  }
}


