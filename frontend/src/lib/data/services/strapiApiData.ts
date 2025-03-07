export async function getStrapiData(url: string) {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    try {
      const response = await fetch(baseUrl + url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }