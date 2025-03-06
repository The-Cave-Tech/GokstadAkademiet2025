export interface UserProfile {
  id: number;
  profileName: string;
  bio?: string;
  profileImage: {
    url: string;
  };
  backgroundImage: {
    url: string;
  };
}
