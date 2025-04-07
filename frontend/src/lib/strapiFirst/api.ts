// Helper function to build the full image URL
export function getImageUrl(imagePath: string): string {
  // Check if the image URL already starts with http/https
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Otherwise, prepend the base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  return `${baseUrl}${imagePath}`;
}
import { strapiClient } from "./strapi";

// Define TypeScript interfaces for the project data structure based on your actual API response
export interface ProjectData {
  id: number;
  documentId: string;
  Title: string;
  Slug: number;
  Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large?: ImageFormat;
      medium?: ImageFormat;
      small?: ImageFormat;
      thumbnail?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  dynamicZone: any[];
  [key: string]: any; // For any additional fields
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface QueryParams {
  sort?: string | string[];
  filters?: Record<string, any>;
  pagination?: {
    page?: number;
    pageSize?: number;
    withCount?: boolean;
  };
  fields?: string[];
  populate?: string | string[] | Record<string, any>;
  [key: string]: any;
}

/**
 * Fetch all projects from the Strapi collection
 * @param {QueryParams} params - Optional query parameters
 * @returns {Promise<StrapiResponse<ProjectData>>} - Projects data
 */
export async function getProjects(
  params: QueryParams = {}
): Promise<StrapiResponse<ProjectData>> {
  try {
    const response = await strapiClient.get<StrapiResponse<ProjectData>>(
      "/api/projects",
      {
        params: {
          populate: "*", // Use "*" for first-level relations
          sort: "publishedAt:desc",
          ...params,
        },
      }
    );

    console.log("Raw API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }
}

/**
 * Fetch a single project by ID
 * @param {number} id - The project ID
 * @returns {Promise<ProjectData|null>} - Project data or null if not found
 */
export async function getProject(id: number): Promise<ProjectData | null> {
  try {
    const response = await strapiClient.get<{ data: ProjectData }>(
      `/api/projects/${id}`,
      {
        params: {
          populate: "*",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetch a project by slug
 * @param {number} slug - The project slug (as number in your schema)
 * @returns {Promise<ProjectData|null>} - Project data or null if not found
 */
export async function getProjectBySlug(
  slug: number
): Promise<ProjectData | null> {
  try {
    const response = await strapiClient.get<StrapiResponse<ProjectData>>(
      "/api/projects",
      {
        params: {
          filters: {
            Slug: {
              $eq: slug,
            },
          },
          populate: "*",
        },
      }
    );

    // If no projects match the slug, return null
    if (!response.data.data || response.data.data.length === 0) {
      return null;
    }

    // Return the first matching project
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Create a new project
 * @param formData - FormData containing project data and optional image
 * @returns {Promise<ProjectData>} - Created project data
 */
export async function createProject(formData: FormData): Promise<ProjectData> {
  try {
    const response = await strapiClient.post<{ data: ProjectData }>(
      "/api/projects",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error creating project:", error);
    throw error;
  }
}
