import { getUserProfile } from "@/lib/data/services/userProfile";
import ProfileDisplayCard from "../user-profile/UserPublicInfo/ProfileDisplayCard";

export default async function DashboardProfile() {

  const profile = await getUserProfile('publicProfile,personalInformation');
  
  return (
    <section className="w-full max-w-7xl mx-auto">
      <ProfileDisplayCard 
        profile={profile} 
        size="lg"
        className="shadow-none"
        avatarSize={200}
      />
    </section>
  );
}