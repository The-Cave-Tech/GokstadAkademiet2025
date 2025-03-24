export async function fetchProfileByName(
  name: string = "UX/UI Designer"
): Promise<any | null> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  if (!baseUrl) {
    console.error(
      "No API URL found. Please configure NEXT_PUBLIC_STRAPI_API_URL"
    );
    return null;
  }

  try {
    // Fetch all profiles
    const response = await fetch(`${baseUrl}/api/user-profiles?populate=*`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      console.warn("No profiles found");
      return null;
    }

    // Find profile by name
    const foundProfile = result.data.find(
      (profile: any) => profile.profileName === name
    );

    if (foundProfile) {
      console.log(`Successfully found profile: ${foundProfile.profileName}`);
      return foundProfile;
    } else {
      console.warn(
        `Profile with name "${name}" not found, returning first profile`
      );
      return result.data[0];
    }
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }
}
