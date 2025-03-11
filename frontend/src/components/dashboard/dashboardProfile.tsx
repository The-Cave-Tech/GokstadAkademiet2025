import { UserProfile } from "@/types/dashboard";

interface DashboardProfileProps {
  profile: UserProfile;
}

export default function DashboardProfile({ profile }: DashboardProfileProps) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  return (
    <section className="w-screen mx-auto px-4 py-8">
      {/* Background Image */}
      <div
        className="relative h-[40vh] sm:h-64 md:h-80 bg-cover bg-center mb-16 sm:mb-20"
        style={{
          backgroundImage: profile.backgroundImage?.url
            ? `url(${baseUrl}${profile.backgroundImage.url})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Profile Picture (Mobile: Centered, Desktop: Left) */}
        {profile.profilePicture?.url && (
          <div
            className="absolute bottom-[-40px] left-[50%] sm:left-10 transform -translate-x-[50%] sm:translate-x-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(${baseUrl}${profile.profilePicture.url})`,
            }}
          />
        )}
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
