// src/lib/data/services/strapiClient.ts
import { strapi } from "@strapi/client";
import { getAuthCookie } from "@/lib/utils/cookie";

// Basisurl for Strapi API
const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

// Opprett Strapi-klienten
export const strapiClient = strapi({
  baseURL: BASE_URL,
});

// Definere typer for fetch-opsjoner som ikke utvider RequestInit
export interface StrapiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | boolean>;
}

// Hjelpefunksjon for å hente autentisert Strapi-klient
export async function getAuthenticatedClient() {
  const token = await getAuthCookie();

  return strapi({
    baseURL: BASE_URL,
    auth: token || undefined,
  });
}

// Grunnleggende hjelpefunksjoner for enklere bruk
export const strapiService = {
  // Fetch-metode med automatisk autentisering
  async fetch<T>(
    endpoint: string,
    options: StrapiRequestOptions = {}
  ): Promise<T> {
    try {
      const token = await getAuthCookie();

      // Sett opp headers på riktig måte
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Kopier over alle egendefinerte headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = value;
        });
      }

      // Konverter body basert på type
      let bodyToSend: BodyInit | null = null;
      if (options.body) {
        if (options.body instanceof FormData) {
          bodyToSend = options.body;
          delete headers["Content-Type"];
        } else {
          bodyToSend = JSON.stringify(options.body);
        }
      }

      // Lag en standard RequestInit
      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers,
        body: bodyToSend,
      };

      const response = await fetch(`${BASE_URL}/${endpoint}`, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || response.statusText || "Ukjent feil"
        );
      }

      return response.json();
    } catch (error) {
      console.error("strapiService fetch error:", error);
      throw error;
    }
  },

  // Hjelpefunksjoner for collection types
  collection(name: string) {
    return strapiClient.collection(name);
  },

  // Hjelpefunksjoner for single types
  single(name: string) {
    return strapiClient.single(name);
  },

  // Mediahåndtering
  media: {
    getMediaUrl(media: unknown): string {
      if (!media) return "";

      const baseMediaUrl =
        process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      // Håndter string
      if (typeof media === "string") {
        return media.startsWith("http") ? media : `${baseMediaUrl}${media}`;
      }

      // Håndter objekt med url property
      if (
        media &&
        typeof media === "object" &&
        "url" in media &&
        typeof media.url === "string"
      ) {
        const url = media.url;
        return url.startsWith("http") ? url : `${baseMediaUrl}${url}`;
      }

      // Håndter data.attributes.url struktur (vanlig i Strapi v4)
      if (media && typeof media === "object" && "data" in media && media.data) {
        const data = media.data;
        if (data && typeof data === "object" && "attributes" in data) {
          const attributes = data.attributes;
          if (
            attributes &&
            typeof attributes === "object" &&
            "url" in attributes
          ) {
            const url = attributes.url;
            return typeof url === "string"
              ? url.startsWith("http")
                ? url
                : `${baseMediaUrl}${url}`
              : "";
          }
        }
      }

      return "";
    },

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

      // Håndter data.attributes struktur
      if (
        "data" in media &&
        media.data &&
        typeof media.data === "object" &&
        "attributes" in media.data
      ) {
        const attributes = media.data.attributes;
        if (attributes && typeof attributes === "object") {
          if (
            "alternativeText" in attributes &&
            typeof attributes.alternativeText === "string"
          ) {
            return attributes.alternativeText;
          }
        }
      }

      return "";
    },

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
  },
};
