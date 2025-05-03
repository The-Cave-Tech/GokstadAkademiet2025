import type { UserProfile } from '@/lib/data/services/userProfile';

export type CardSize = 'sm' | 'md' | 'lg';

export interface ProfileDisplayCardProps {
  profile: UserProfile;
  size?: CardSize;
  avatarSize?: number;
  showBio?: boolean;
  showIcons?: boolean;
  className?: string;
}
