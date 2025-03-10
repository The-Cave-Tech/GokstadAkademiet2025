export async function fetchUserProfile() {
  // Assume we get the token later for JWT
  const token = localStorage.getItem("auth_token"); // Example: Storing JWT in localStorage
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const userId = 4; // Hardcoded for testing, replace with JWT later

  // Define the user profile endpoint
  const profileUrl = `${baseUrl}/api/user-profiles?${userId}&populate=*`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // If JWT is available, add it to the authorization header
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Perform the fetch request with or without JWT
    const response = await fetch(profileUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
    }

    const results = await response.json();

    const profile = results.data[0]; // Fetch first instance

    console.log(`Fetched data from user profile API`, profile);

    return profile; // Return the user profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null; // Handle error gracefully
  }
}
