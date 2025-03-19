export async function fetchStrapiData(url: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const response = await fetch(baseUrl + url, {
      method: "GET",
      ...options, // Sprer inn alternativer for å overstyre metode, headers, body, etc.
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Forespørsel feilet");
    }
    return data;
  } catch (error) {
    console.error("Strapi Fetch Error:", error);
    throw error; 
  }
}