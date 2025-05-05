// types/dashboard.ts

export interface MenuItem {
  href: string;
  title: string;
  desc: string;
}

// types/dashboard.ts
export interface UserProfile {
  id: number;
  profileName: string;
  bio?: string;
  userRole?: string;
  profilePicture?: unknown;
  // Add any other fields from the API response
}

export interface DashboardProps {
  profile: UserProfile | null;
  role: string;
  isLoading: boolean;
}

// This is the interface that's missing
export interface StrapiProfileResponse {
  id: number;
  attributes: UserProfile;
}
