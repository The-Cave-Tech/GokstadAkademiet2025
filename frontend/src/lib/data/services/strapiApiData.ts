export async function fetchStrapiData(url: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const response = await fetch(baseUrl + url, {
      method: "GET",
      cache: "no-store",  // <=== henter alltid fersk data:) la den stå der gutta:) Mvh Aslan:)
      ...options,
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
