import axios from "axios";

// Create Strapi client
const strapiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
strapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Strapi API error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

/**
 * Fetch a list of content items
 * @param contentType The type of content to fetch (projects, blogs, etc.)
 * @param params Optional query parameters
 * @returns Promise with content data
 */
export async function getContentItems(contentType: string, params = {}) {
  try {
    const response = await strapiClient.get(`/${contentType}`, {
      params: {
        populate: "*", // Populate all first-level relations
        sort: "createdAt:desc", // Sort by creation date (newest first)
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }
}

/**
 * Fetch a specific content item by ID
 * @param contentType The type of content
 * @param id The item ID
 * @returns Promise with content item data
 */
export async function getContentItem(contentType: string, id: string | number) {
  try {
    const response = await strapiClient.get(`/${contentType}/${id}`, {
      params: {
        populate: "*", // Populate all first-level relations
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${contentType} item:`, error);
    throw error;
  }
}

/**
 * Create a new content item
 * @param contentType The type of content to create
 * @param data The content data (can be JSON or FormData)
 * @returns Promise with created content data
 */
export async function createContent(contentType: string, data: any) {
  try {
    // Handle both FormData and regular JSON
    const isFormData = data instanceof FormData;

    const response = await strapiClient.post(`/${contentType}`, data, {
      headers: isFormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    });

    return response.data;
  } catch (error) {
    console.error(`Error creating ${contentType}:`, error);
    throw error;
  }
}

/**
 * Update an existing content item
 * @param contentType The type of content to update
 * @param id The item ID to update
 * @param data The updated content data (can be JSON or FormData)
 * @returns Promise with updated content data
 */
export async function updateContent(
  contentType: string,
  id: string | number,
  data: any
) {
  try {
    // Handle both FormData and regular JSON
    const isFormData = data instanceof FormData;

    const response = await strapiClient.put(`/${contentType}/${id}`, data, {
      headers: isFormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating ${contentType}:`, error);
    throw error;
  }
}

/**
 * Delete a content item
 * @param contentType The type of content to delete
 * @param id The item ID to delete
 * @returns Promise with deletion result
 */
export async function deleteContent(contentType: string, id: string | number) {
  try {
    const response = await strapiClient.delete(`/${contentType}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${contentType}:`, error);
    throw error;
  }
}

/**
 * Get full URL for a Strapi image
 * @param imageUrl Relative URL from Strapi
 * @returns Complete image URL
 */
export function getStrapiMediaUrl(imageUrl: string) {
  if (!imageUrl) return "";

  // Return full URL for external images
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Combine with base URL for relative paths
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  return `${baseUrl}${imageUrl}`;
}
