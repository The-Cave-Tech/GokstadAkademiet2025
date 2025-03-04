export async function fetchUserProfile() {

    // Assume we get the token later for JWT
    const token = localStorage.getItem('auth_token');  // Example: Storing JWT in localStorage
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
    // Define the user profile endpoint (assuming `me` route is supported in Strapi)
    const profileUrl = `${baseUrl}/user-profile/me`;
  
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      // If JWT is available, add it to the authorization header
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      // Perform the fetch request with or without JWT
      const response = await fetch(profileUrl, {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;  // Return the user profile data
  
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;  // Handle error gracefully
    }
  }
  