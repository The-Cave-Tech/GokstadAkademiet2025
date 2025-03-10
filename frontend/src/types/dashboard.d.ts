export interface UserProfile {
  id: number;
  profileName: string;
  bio?: string;
  profilePicture: {
    url: string;
  };
  backgroundImage: {
    url: string;
  };
}
