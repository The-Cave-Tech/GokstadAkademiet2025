// src/lib/data/services/profileSections/personalInfoService.ts
import { strapiService } from "../strapiClient";
import { getUserProfile } from "../userProfile";
import { UserProfile } from "../userProfile";

type ProfileFieldValue = string | number | boolean | null | { id: number } | undefined;

export async function updateFullName(fullName: string): Promise<unknown> {
  return sendProfileUpdate('fullName', fullName);
}

export async function updateBirthDate(birthDate: string): Promise<unknown> {
  if (birthDate && birthDate.includes('.')) {
    const [day, month, year] = birthDate.split('.');
    if (day && month && year) {
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log(`Konverterer dato fra ${birthDate} til ${isoDate}`);
      return sendProfileUpdate('birthDate', isoDate);
    }
  }
  
  return sendProfileUpdate('birthDate', birthDate);
}

export async function updateGender(gender: string): Promise<unknown> {
  return sendProfileUpdate('gender', gender);
}

export async function updatePhoneNumber(phoneNumber: string): Promise<unknown> {
  return sendProfileUpdate('phoneNumber', phoneNumber);
}

export async function updateStreetAddress(streetAddress: string): Promise<unknown> {
  return sendProfileUpdate('streetAddress', streetAddress);
}

export async function updatePostalCode(postalCode: string): Promise<unknown> {
  return sendProfileUpdate('postalCode', postalCode);
}

export async function updateCity(city: string): Promise<unknown> {
  return sendProfileUpdate('city', city);
}

async function sendProfileUpdate(
  field: keyof NonNullable<UserProfile['personalInformation']>, 
  value: ProfileFieldValue
): Promise<unknown> {
  try {
    const profile = await getUserProfile('personalInformation');

    const personalInfo = profile.personalInformation || {};
    
    const mergedData = {
      ...personalInfo,
      [field]: value
    };
    
    return await strapiService.fetch("user-profiles/me/personal-information", {
      method: "PUT",
      body: { data: mergedData }
    });
  } catch (error) {
    console.error(`Feil ved oppdatering av ${field}:`, error);
    throw error;
  }
}