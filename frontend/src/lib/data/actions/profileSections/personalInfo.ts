"use server";

import { personalInfoSchema } from "@/lib/validation/profileSectionValidation";
import { 
  updateFullName,
  updateBirthDate,
  updateGender,
  updatePhoneNumber,
  updateStreetAddress,
  updatePostalCode,
  updateCity
} from "@/lib/data/services/profileSections/personalInfoService";
import { handleValidationErrors, handleStrapiError } from "@/lib/utils/serverAction-errorHandler";
import { getUserProfile } from "@/lib/data/services/userProfile";
import { PersonalInfoFormState } from "@/types/profileValidation.types";
import { PersonalInfoValidationErrors } from "@/types/validationError.types";

export async function updatePersonalInfo(
  prevState: PersonalInfoFormState,
  formData: FormData
): Promise<PersonalInfoFormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const validation = personalInfoSchema.safeParse(fields);

  if (!validation.success) {
    const errors = handleValidationErrors(validation.error, {
      fullName: [],
      birthDate: [],
      gender: [],
      phoneNumber: [],
      streetAddress: [],
      postalCode: [],
      city: [],
    }) as PersonalInfoValidationErrors;

    return {
      ...prevState,
      zodErrors: errors,
      strapiErrors: null,
      values: fields,
      success: false,
    };
  }

  try {
    const currentProfile = await getUserProfile();
    const currentPersonalInfo = currentProfile.personalInformation || {};

    // Format birth date if needed
    if (fields.birthDate && fields.birthDate.includes('.')) {
      const [day, month, year] = fields.birthDate.split('.');
      if (day && month && year) {
        fields.birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    // Only update fields that have changed
    if (fields.fullName !== currentPersonalInfo.fullName) {
      await updateFullName(fields.fullName);
    }
    
    if (fields.birthDate !== currentPersonalInfo.birthDate) {
      await updateBirthDate(fields.birthDate);
    }
    
    if (fields.gender !== currentPersonalInfo.gender) {
      await updateGender(fields.gender);
    }
    
    if (fields.phoneNumber !== currentPersonalInfo.phoneNumber) {
      await updatePhoneNumber(fields.phoneNumber);
    }
    
    if (fields.streetAddress !== currentPersonalInfo.streetAddress) {
      await updateStreetAddress(fields.streetAddress);
    }
    
    if (fields.postalCode !== currentPersonalInfo.postalCode) {
      await updatePostalCode(fields.postalCode);
    }
    
    if (fields.city !== currentPersonalInfo.city) {
      await updateCity(fields.city);
    }
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      values: fields,
      success: true,
    };
  } catch (error) {
    const errorMessage = handleStrapiError(error);
    
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: { message: errorMessage },
      values: fields,
      success: false,
    };
  }
}