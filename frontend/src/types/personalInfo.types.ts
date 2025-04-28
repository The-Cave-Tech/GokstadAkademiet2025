// src/types/personalInfo.types.ts
import { UserProfile as BaseUserProfile } from "@/lib/data/services/userProfile";


export interface PersonalInformation {
  fullName?: string;
  birthDate?: string;
  gender?: string;
  phoneNumber?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
}

export interface ExtendedUserProfile extends BaseUserProfile {
  personalInformation: PersonalInformation;
}

export interface PersonalInfoProps {
  profile?: BaseUserProfile | null;
  onProfileUpdate?: (updatedProfile: BaseUserProfile) => void;
}

export type FieldType = 'text' | 'select' | 'tel' | 'date';

export interface FieldConfig {
  id: keyof PersonalInformation;  // Ensure IDs match PersonalInformation keys
  label: string;
  type: FieldType;
  placeholder: string;
  required?: boolean;
  options?: string[];
  description: string;
  updateFn: (value: string) => Promise<unknown>;
}

export type FormValues = Record<keyof PersonalInformation, string>;
export type LoadingStates = Record<keyof PersonalInformation, boolean>;

export interface DatePickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  'aria-describedby'?: string;
}