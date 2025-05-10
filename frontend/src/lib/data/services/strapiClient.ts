//from frontend/src/lib/data/services/strapiClient.ts
import { strapi } from "@strapi/client";
import { getAuthCookie, removeAuthCookie } from "@/lib/utils/cookie";
import { isTokenExpired } from "@/lib/utils/jwt"; // Importer fra jwt.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

export const strapiClient = strapi({
  baseURL: BASE_URL,
});

export interface StrapiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | boolean>;
}

export async function getAuthenticatedClient() {
  const token = await getAuthCookie();

  return strapi({
    baseURL: BASE_URL,
    auth: token || undefined,
  });
}

export const strapiService = {
  async fetch<T>(
    endpoint: string,
    options: StrapiRequestOptions = {}
  ): Promise<T> {
    try {
      const token = await getAuthCookie();
      if (token) {
        if (isTokenExpired(token)) {
          console.log("[strapiClient] Token expired before making request");
          await removeAuthCookie();
          
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('auth-token-expired');
            window.dispatchEvent(event);
            throw new Error("Autentiseringen har utløpt. Vennligst logg inn på nytt.");
          }
        }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = value;
        });
      }

      let bodyToSend: BodyInit | null = null;
      if (options.body) {
        if (options.body instanceof FormData) {
          bodyToSend = options.body;
          delete headers["Content-Type"];
        } else {
          bodyToSend = JSON.stringify(options.body);
        }
      }

      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers,
        body: bodyToSend,
      };

      let url = `${BASE_URL}/${endpoint}`;
      if (options.params) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
        url += `?${searchParams.toString()}`;
      }

      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        console.error("[strapiClient] Authentication failed: 401 Unauthorized");
        
        await removeAuthCookie();
        
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('auth-token-expired');
          window.dispatchEvent(event);
        }
        
        throw new Error("Autentiseringen har utløpt. Vennligst logg inn på nytt.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        let errorMessage = "Ukjent feil";
        if (errorData.error) {
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.error.details?.message) {
            errorMessage = errorData.error.details.message;
          }
        } else if (response.statusText) {
          errorMessage = response.statusText;
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error("strapiService fetch error:", error);
      throw error;
    }
  },

  collection(name: string) {
    return strapiClient.collection(name);
  },

  single(name: string) {
    return strapiClient.single(name);
  },

  media: {
    getMediaUrl(media: unknown): string {
      if (!media) return "";

      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";
      const baseMediaUrl = apiUrl.replace(/\/api$/, "");

      if (typeof media === "string") {
        return media.startsWith("http") ? media : `${baseMediaUrl}${media}`;
      }

      if (
        media &&
        typeof media === "object" &&
        "url" in media &&
        typeof media.url === "string"
      ) {
        const url = media.url;
        return url.startsWith("http") ? url : `${baseMediaUrl}${url}`;
      }

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