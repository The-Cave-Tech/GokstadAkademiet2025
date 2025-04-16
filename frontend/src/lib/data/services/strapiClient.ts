// lib/data/services/strapiClient.ts
import { strapi } from "@strapi/client";

// Define types for fetch options
type StrapiRequestOptions = {
  method?: "get" | "post" | "put" | "delete";
  body?: Record<string, unknown>;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

// Get the base URL without the /api suffix for media URLs
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL 
  ? process.env.NEXT_PUBLIC_STRAPI_API_URL.replace("/api", "")
  : "http://localhost:1337";

// Create the Strapi client with the full API URL
export const client = strapi({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api",
});

// Export helper functions
export const strapiService = {
  // Add the fetch method
  async fetch<T>(endpoint: string, options: StrapiRequestOptions = {}): Promise<T> {
    try {
      // Convert options to what Strapi Client expects
      const fetchOptions: RequestInit & { params?: Record<string, string | number | boolean> } = {
        method: options.method,
        headers: options.headers,
        params: options.params,
      };
      
      // If body is provided, stringify it and set proper content type
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        };
      }
      
      const response = await client.fetch(endpoint, fetchOptions);
      return await response.json() as T;
    } catch (error) {
      console.error("Strapi Client Error:", error);
      throw error;
    }
  },
  
  // Hjelpefunksjoner for collection types
  collection(name: string) {
    return client.collection(name);
  },
  
  // Hjelpefunksjoner for single types
  single(name: string) {
    return client.single(name);
  },
  
  // Mediahåndtering
  media: {
    getMediaUrl(media: unknown): string {
      if (!media) return "";
      
      // Handle string
      if (typeof media === "string") {
        return media.startsWith("http") ? media : `${baseUrl}${media}`;
      }
      
      // Handle object with url property
      if (media && typeof media === "object" && "url" in media && typeof media.url === "string") {
        const url = media.url;
        return url.startsWith("http") ? url : `${baseUrl}${url}`;
      }
      
      return "";
    }
  }
};