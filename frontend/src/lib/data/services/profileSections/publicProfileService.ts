import { strapiService } from "../strapiClient";
import { getUserProfile, UploadedFile, UserProfile } from "../userProfile";


type ProfileFieldValue = string | number | boolean | null | { id: number } | undefined;

export async function updateDisplayName(displayName: string): Promise<UserProfile> {
  return sendProfileUpdate('displayName', displayName);
}

/**
 * Oppdaterer biografi
 */
export async function updateBiography(biography: string): Promise<UserProfile> {
  return sendProfileUpdate('biography', biography);
}

/**
 * Oppdaterer innstilling for synlighet av e-post
 */
export async function updateShowEmail(showEmail: boolean): Promise<UserProfile> {
  return sendProfileUpdate('showEmail', showEmail);
}

/**
 * Oppdaterer innstilling for synlighet av telefon
 */
export async function updateShowPhone(showPhone: boolean): Promise<UserProfile> {
  return sendProfileUpdate('showPhone', showPhone);
}

/**
 * Oppdaterer innstilling for synlighet av adresse
 */
export async function updateShowAddress(showAddress: boolean): Promise<UserProfile> {
  return sendProfileUpdate('showAddress', showAddress);
}

export async function getProfileImage(): Promise<UserProfile> {
  return getUserProfile('publicProfile.profileimage');
}


export async function sendProfileUpdate(field: string, value: ProfileFieldValue): Promise<UserProfile> {
  try {
    const currentProfile = await getUserProfile('publicProfile.profileimage');
    const mergedData = {
      ...(currentProfile.publicProfile || {}),
      [field]: value
    };
    
    return await strapiService.fetch<UserProfile>("user-profiles/me/public-profile", {
      method: "PUT",
      body: { data: mergedData }
    });
  } catch (error) {
    console.error(`Feil ved oppdatering av ${field}:`, error);
    throw error;
  }
}

/**
 * Laster opp profilbilde og kobler det til brukerprofilen
 */
export async function uploadProfileImage(file: File): Promise<UserProfile> {
  // Opprett FormData for bildeopplasting
  const formData = new FormData();
  formData.append("files", file);

  console.log("Uploading profile image");
  try {
    // Last opp bildet til Strapi ved hjelp av strapiService.fetch
    const uploadedFiles = await strapiService.fetch<UploadedFile[]>("upload", {
      method: "POST",
      body: formData,
    });

    console.log("Uploaded files:", uploadedFiles);

    // Oppdater profileimage-feltet med upload id
    return sendProfileUpdate('profileimage', uploadedFiles[0].id);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Sletter profilbildet fra brukerprofilen
 */
export async function deleteProfileImage(): Promise<UserProfile> {
  try {
    return sendProfileUpdate('profileimage', null);
  } catch (error) {
    console.error("Feil ved sletting av profilbilde:", error);
    throw error;
  }
}


export function getProfileImageUrl(profile: UserProfile | null): string {
  if (!profile?.publicProfile?.profileimage) {
    return "/profileIcons/avatar-default.svg"; 
  }
  
  return strapiService.media.getMediaUrl(profile.publicProfile.profileimage);
}