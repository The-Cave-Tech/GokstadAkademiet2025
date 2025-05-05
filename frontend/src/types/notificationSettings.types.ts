// src/types/notificationSettings.types.ts

import { UserProfile } from "@/lib/data/services/userProfile";

export interface NotificationSettings {
  importantUpdates: boolean;
  newsletter: boolean;
}

export interface NotificationProps {
  profile?: UserProfile | null;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

export interface NotificationResponse {
  id: number;
  importantUpdates: boolean;
  newsletter: boolean;
}

export interface NotificationFormData {
  importantUpdates: boolean;
  newsletter: boolean;
}

export interface NotificationLoadingStates {
  importantUpdates: boolean;
  newsletter: boolean;
}