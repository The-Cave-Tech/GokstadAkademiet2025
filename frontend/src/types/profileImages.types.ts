import { UserProfile } from "@/lib/data/services/userProfile";

export interface ProfileImageUploadState {
  error: string | null;
  success: boolean;
  updatedProfile: UserProfile | null;
}

export const initialProfileImageState: ProfileImageUploadState = {
  error: null,
  success: false,
  updatedProfile: null
};