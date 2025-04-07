export async function getStrapiData(url: string, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const response = await fetch(baseUrl + url, {
      credentials: "include", // Include cookies
      ...options, // Allow passing additional options
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
