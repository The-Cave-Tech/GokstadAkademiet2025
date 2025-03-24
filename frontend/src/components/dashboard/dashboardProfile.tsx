import { UserProfile } from "@/types/dashboard";

// Add the props interface
interface DashboardProfileProps {
  profile: UserProfile;
}

export default function DashboardProfile({ profile }: DashboardProfileProps) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  // Helper function to get image URL
  const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.url) return `${baseUrl}${imageField.url}`;
    return null;
  };

  const profilePictureUrl = getImageUrl(profile.profilePicture);
  const backgroundImageUrl = getImageUrl(profile.backgroundImage);

  return (
    <section className="w-screen mx-auto px-4 py-8">
      {/* Background Image */}
      <div
        className="relative h-[40vh] sm:h-64 md:h-80 bg-cover bg-center mb-16 sm:mb-20"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : "none",
          backgroundColor: backgroundImageUrl ? "transparent" : "#e0e0e0",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Profile Picture */}
        <div
          className="absolute bottom-[-40px] left-[50%] sm:left-10 transform -translate-x-[50%] sm:translate-x-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-lg bg-cover bg-center"
          style={{
            backgroundImage: profilePictureUrl
              ? `url(${profilePictureUrl})`
              : "url(/default-avatar.png)",
            backgroundColor: profilePictureUrl ? "transparent" : "#e0e0e0",
          }}
        />
      </div>

      {/* Profile Name & Bio */}
      <div className="flex flex-col sm:items-start items-center gap-4 px-4 sm:px-10">
        <h1 className="text-3xl sm:text-4xl">{profile.profileName}</h1>
        <p className="text-center sm:text-left">
          {profile.bio ?? "No bio available"}
        </p>
      </div>
    </section>
  );
}
