import axios, { AxiosRequestConfig } from "axios";
import { ContentResponse } from "../components/ContentGrid";

// Create Strapi client
const strapiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch a collection of content items from Strapi
 * @param type Content type (e.g., 'projects', 'blogs', 'activities')
 * @param params Additional query parameters
 * @returns Promise resolved with content data
 */
export async function getContentItems(
  type: string,
  params: Record<string, any> = {}
): Promise<ContentResponse> {
  try {
    const response = await strapiClient.request({
      method: "GET",
      url: `/${type}`,
      params: {
        populate: "*", // Fetch all relations
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }
}

/**
 * Fetch a single content item from Strapi
 * @param type Content type (e.g., 'projects', 'blogs', 'activities')
 * @param id Content item ID
 * @returns Promise resolved with content item data
 */
export async function getContentItem(
  type: string,
  id: string | number
): Promise<any> {
  try {
    const response = await strapiClient.request({
      method: "GET",
      url: `/${type}/${id}`,
      params: {
        populate: "deep", // Fetch all nested relations
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} item:`, error);
    throw error;
  }
}

/**
 * Create a new content item in Strapi
 * @param type Content type (e.g., 'projects', 'blogs', 'activities')
 * @param data Content data
 * @returns Promise resolved with created content data
 */
export async function createContentItem(type: string, data: any): Promise<any> {
  try {
    const response = await strapiClient.request({
      method: "POST",
      url: `/${type}`,
      data: { data },
    });

    return response.data;
  } catch (error) {
    console.error(`Error creating ${type} item:`, error);
    throw error;
  }
}

/**
 * Update an existing content item in Strapi
 * @param type Content type (e.g., 'projects', 'blogs', 'activities')
 * @param id Content item ID
 * @param data Updated content data
 * @returns Promise resolved with updated content data
 */
export async function updateContentItem(
  type: string,
  id: string | number,
  data: any
): Promise<any> {
  try {
    const response = await strapiClient.request({
      method: "PUT",
      url: `/${type}/${id}`,
      data: { data },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating ${type} item:`, error);
    throw error;
  }
}

/**
 * Delete a content item from Strapi
 * @param type Content type (e.g., 'projects', 'blogs', 'activities')
 * @param id Content item ID
 * @returns Promise resolved with deletion response
 */
export async function deleteContentItem(
  type: string,
  id: string | number
): Promise<any> {
  try {
    const response = await strapiClient.request({
      method: "DELETE",
      url: `/${type}/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error(`Error deleting ${type} item:`, error);
    throw error;
  }
}
