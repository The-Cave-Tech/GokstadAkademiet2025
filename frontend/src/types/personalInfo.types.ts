// src/types/personalInfo.types.ts
import { UserProfile } from "@/lib/data/services/userProfile";

export interface PersonalInfoProps {
  profile?: UserProfile | null;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

export type FieldType = 'text' | 'select' | 'tel' | 'date';

export interface FieldConfig {
  id: keyof NonNullable<UserProfile['personalInformation']>;
  label: string;
  type: FieldType;
  placeholder: string;
  required?: boolean;
  options?: string[];
  description: string;
  updateFn: (value: string) => Promise<unknown>;
}

export type FormValues = Record<keyof NonNullable<UserProfile['personalInformation']>, string>;

export interface ExtendedUserProfile extends UserProfile {
  personalInformation: NonNullable<UserProfile['personalInformation']>;
}

export interface DatePickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  'aria-describedby'?: string;
}