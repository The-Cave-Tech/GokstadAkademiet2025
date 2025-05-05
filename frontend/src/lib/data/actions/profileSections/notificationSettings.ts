"use server";

import { 
  updateImportantUpdates, 
  updateNewsletter 
} from "@/lib/data/services/profileSections/notificationService";
import { handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { NotificationSettingsFormState } from "@/types/profileValidation.types";

export async function updateNotificationSettings(
  prevState: NotificationSettingsFormState,
  formData: FormData
): Promise<NotificationSettingsFormState> {
  const importantUpdates = formData.get('importantUpdates') === 'on';
  const newsletter = formData.get('newsletter') === 'on';
  
  const fields = { importantUpdates, newsletter };
  
  try {
    await updateImportantUpdates(importantUpdates);
    await updateNewsletter(newsletter);
    
    return {
      strapiErrors: null,
      values: fields,
      success: true,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      strapiErrors: { message: errorMessage },
      values: fields,
      success: false,
    };
  }
}