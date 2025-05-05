"use server";

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/validation/profileSectionValidation";
import { uploadProfileImage, deleteProfileImage } from "@/lib/data/services/profileSections/publicProfileService";
import { handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { ProfileImageUploadState } from "@/types/profileImages.types";

/**
 * Server action for uploading a profile image with validation
 */
export async function uploadProfileImageAction(
  _prevState: ProfileImageUploadState,
  formData: FormData
) {
  try {
    // Get file from the form data
    const file = formData.get('profileImage') as File;
    
    // Validate file exists
    if (!file || file.size === 0) {
      return {
        error: "Ingen fil opplastet",
        success: false,
        updatedProfile: null
      };
    }
    
    // Validate file size on the server
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        error: `Maksimal størrelse er ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
        success: false,
        updatedProfile: null
      };
    }
    
    // Validate file type on the server
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        error: `Ugyldig filtype. Tillatte formater: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')}`,
        success: false,
        updatedProfile: null
      };
    }
    
    const updatedProfile = await uploadProfileImage(file);
    
    return {
      error: null,
      success: true,
      updatedProfile
    };
  } catch (error) {
    // Handle Strapi errors consistently
    const errorMessage = handleStrapiError(error);
    
    return {
      error: errorMessage,
      success: false,
      updatedProfile: null
    };
  }
}

/**
 * Server action for deleting a profile image
 */
export async function deleteProfileImageAction() {
  try {
    const updatedProfile = await deleteProfileImage();
    
    return {
      error: null,
      success: true,
      updatedProfile
    };
  } catch (error) {
    // Handle Strapi errors consistently
    const errorMessage = handleStrapiError(error);
    
    return {
      error: errorMessage,
      success: false,
      updatedProfile: null
    };
  }
}