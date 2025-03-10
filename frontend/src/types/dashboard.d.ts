export interface UserProfile {
  id: number;
  profileName: string;
  bio?: string;
  profilePicture?: {
    url: string;
  };
  backgroundImage?: {
    url: string;
  };
}

export interface DashboardProps {
  profile: UserProfile | null;
  role: string;
  isLoading: boolean;
}

export interface MenuItem {
  href: string;
  title: string;
  desc: string;
}
