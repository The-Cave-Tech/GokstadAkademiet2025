// lib/data/services/mediaService.ts
import { strapiService } from "./strapiClient";

export const mediaService = {
  /**
   * Henter og formaterer media fra Strapi
   * @param media Mediaobjekt eller URL-streng fra Strapi
   * @returns Formatert URL klar til bruk i Image-komponenter
   */
  getMediaUrl(media: unknown): string {
    return strapiService.media.getMediaUrl(media);
  },

  /**
   * Henter alternativ tekst for et mediaobjekt
   * @param media Mediaobjekt fra Strapi
   * @returns Alternativ tekst eller tom streng
   */
  getAltText(media: unknown): string {
    if (!media || typeof media !== "object") return "";

    if (
      "alternativeText" in media &&
      typeof media.alternativeText === "string"
    ) {
      return media.alternativeText;
    }

    if ("alt" in media && typeof media.alt === "string") {
      return media.alt;
    }

    return "";
  },

  /**
   * Sjekker om et mediaobjekt er gyldig
   * @param media Mediaobjekt fra Strapi
   * @returns true hvis mediaobjektet er gyldig
   */
  isValidMedia(media: unknown): boolean {
    if (!media) return false;

    if (typeof media === "string") return true;

    if (typeof media === "object" && media !== null) {
      return (
        "url" in media ||
        ("data" in media && media.data !== null) ||
        "formats" in media
      );
    }

    return false;
  },
};
