// components/dashboard/DashboardProfile.tsx
import { getImageUrl } from "@/lib/utils/getImage";
import { getUserProfile } from "@/lib/data/services/profileService";

export default async function DashboardProfile() {
  const profile = await getUserProfile();
  const profilePictureUrl = getImageUrl(profile.profilePicture);

  return (
    <section className="w-full mx-auto px-4 py-8">
      <div className="relative h-[40vh] sm:h-64 md:h-80 mb-16 sm:mb-20">
        <div
          className="absolute bottom-[-40px] left-[50%] sm:left-10 transform -translate-x-[50%] sm:translate-x-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-lg bg-cover bg-center"
          style={{
            backgroundImage: profilePictureUrl
              ? `url(${profilePictureUrl})`
              : "none",
            backgroundColor: profilePictureUrl ? "transparent" : "#e0e0e0",
          }}
        />
      </div>
      <div className="flex flex-col sm:items-start items-center gap-4 px-4 sm:px-10">
        <h1 className="text-3xl sm:text-4xl">{profile.profileName}</h1>
        <p className="text-center sm:text-left">
          {profile.bio || "No bio available"}
        </p>
      </div>
    </section>
  );
}
