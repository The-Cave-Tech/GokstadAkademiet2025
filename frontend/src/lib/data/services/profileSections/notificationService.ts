import { strapiService } from "../strapiClient";
import { getUserProfile } from "../userProfile";
import { NotificationSettings, NotificationResponse } from "@/types/notificationSettings.types";

export async function updateImportantUpdates(enabled: boolean): Promise<NotificationResponse> {
  return updateNotificationSetting('importantUpdates', enabled);
}

export async function updateNewsletter(enabled: boolean): Promise<NotificationResponse> {
  return updateNotificationSetting('newsletter', enabled);
}

async function updateNotificationSetting(
  setting: keyof NotificationSettings, 
  value: boolean
): Promise<NotificationResponse> {
  try {
    const profile = await getUserProfile('notificationSettings');
    const currentSettings = profile.notificationSettings || {};
  
    const updatedSettings = {
      ...currentSettings,
      [setting]: value
    };
    
    return await strapiService.fetch<NotificationResponse>(
      "user-profiles/me/notification-settings", 
      {
        method: "PUT",
        body: { data: updatedSettings }
      }
    );
  } catch (error) {
    console.error(`Feil ved oppdatering av ${setting}:`, error);
    throw new Error(error instanceof Error ? error.message : `Kunne ikke oppdatere ${setting}`);
  }
}