import { HeroSection } from "@/types/hero.types";
import { fetchStrapiData } from "@/lib/data/services/strapiApiData";

export async function getHero(): Promise<HeroSection> {
  const json = await fetchStrapiData("/api/landing-page?populate=*");

  if (!json.data || !json.data.attributes) {
    throw new Error("Unexpected data structure returned from Strapi");
  }

  const data = json.data.attributes;
  
  if (
    !data.Title ||
    !data.Subtitle ||
    !data.landingImage?.data?.attributes?.url
  ) {
    console.error("Missing expected data from Strapi:", data);
    throw new Error("Missing required hero data from Strapi");
  }

  return {
    title: data.Title,
    subtitle: data.Subtitle,
    landingImage: {
      url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.landingImage.data.attributes.url}`,
    },
  };
}
