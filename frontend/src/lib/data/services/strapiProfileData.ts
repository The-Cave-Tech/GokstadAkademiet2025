export async function fetchLoggedInUserProfile(): Promise<any | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    // Make request with credentials included to send cookies
    const response = await fetch(`${baseUrl}/api/users/me?populate=*`, {
      method: "GET",
      credentials: "include", // This tells fetch to include cookies in the request
      headers: {
        "Content-Type": "application/json",
        // You could also explicitly extract and add the authentication cookie if needed
        // 'Authorization': `Bearer ${getCookieValue('your-auth-cookie-name')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!result || !result.data) {
      console.warn("User profile not found");
      return null;
    }

    console.log(`Successfully fetched user profile`);
    return result.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
