// services/contentService.ts
import { strapiService } from "./strapiClient";
import {
  StrapiResponse,
  EventAttributes,
  EventResponse,
} from "@/types/content.types";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

// Helper function to build query params
function buildQueryParams(params: any = {}): Record<string, any> {
  const queryParams: Record<string, any> = {};

  if (params.filters) {
    queryParams.filters = params.filters;
  }

  if (params.sort) {
    queryParams.sort = params.sort;
  }

  if (params.pagination) {
    queryParams.pagination = params.pagination;
  }

  if (params.populate) {
    queryParams.populate = params.populate;
  }

  return queryParams;
}

// Helper function to handle file uploads
async function uploadFiles(
  files: File[],
  refId: number,
  ref: string,
  field: string
): Promise<void> {
  if (!files.length) return;

  const formData = new FormData();
  formData.append("ref", ref);
  formData.append("refId", refId.toString());
  formData.append("field", field);

  files.forEach((file) => {
    formData.append("files", file);
  });

  // Make upload request
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      // Let the browser set the content type for FormData
      // The token will be added automatically by the browser if it's in cookies
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }
}

// Create events service
export const eventsService = {
  // Get all events
  getAll: async (params: any = {}): Promise<EventResponse[]> => {
    try {
      const collection = strapiService.collection("events");
      const queryParams = buildQueryParams(params);
      const response = await collection.find(queryParams);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching events:`, error);
      return [];
    }
  },

  // Get a single event
  getOne: async (
    id: number | string,
    params: any = {}
  ): Promise<EventResponse | null> => {
    try {
      const collection = strapiService.collection("events");
      const queryParams = buildQueryParams(params);
      const response = await collection.findOne({
        id: Number(id),
        ...queryParams,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching event:`, error);
      return null;
    }
  },

  // Create a new event
  create: async (
    data: Partial<EventAttributes>,
    eventCardImage?: File | null,
    eventImages?: File[]
  ): Promise<EventResponse> => {
    // First create the event
    const collection = strapiService.collection("events");
    const response = await collection.create({ data });
    const eventId = response.data.id;

    // Then upload files if any
    try {
      if (eventCardImage) {
        await uploadFiles(
          [eventCardImage],
          eventId,
          "api::event.event",
          "eventCardImage"
        );
      }

      if (eventImages && eventImages.length > 0) {
        await uploadFiles(
          eventImages,
          eventId,
          "api::event.event",
          "eventImages"
        );
      }
    } catch (error) {
      console.error(`Error uploading files for event:`, error);
    }

    // Return the created event
    return response.data;
  },

  // Update an existing event
  update: async (
    id: number,
    data: Partial<EventAttributes>,
    eventCardImage?: File | null,
    eventImages?: File[]
  ): Promise<EventResponse> => {
    // First update the event data
    const collection = strapiService.collection("events");
    const response = await collection.update(id, { data });

    // Then upload files if any
    try {
      if (eventCardImage) {
        await uploadFiles(
          [eventCardImage],
          id,
          "api::event.event",
          "eventCardImage"
        );
      }

      if (eventImages && eventImages.length > 0) {
        await uploadFiles(eventImages, id, "api::event.event", "eventImages");
      }
    } catch (error) {
      console.error(`Error uploading files for event:`, error);
    }

    // Return the updated event
    return response.data;
  },

  // Delete an event
  delete: async (id: number): Promise<boolean> => {
    try {
      const collection = strapiService.collection("events");
      await collection.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting event:`, error);
      return false;
    }
  },

  // Helper to get the proper media URL
  getMediaUrl: (media: any): string => {
    return strapiService.media.getMediaUrl(media);
  },
};

// Generic function to create a content service (for future use with other content types)
export function createContentService<T extends Record<string, any>>(
  contentType: string
) {
  const collection = strapiService.collection(contentType);
  const ref = `api::${contentType}.${contentType}`;

  return {
    // Get a list of items
    getAll: async (params: any = {}): Promise<StrapiResponse<T>[]> => {
      try {
        const queryParams = buildQueryParams(params);
        const response = await collection.find(queryParams);
        return response.data || [];
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return [];
      }
    },

    // Get a single item
    getOne: async (
      id: number | string,
      params: any = {}
    ): Promise<StrapiResponse<T> | null> => {
      try {
        const queryParams = buildQueryParams(params);
        const response = await collection.findOne({
          id: Number(id),
          ...queryParams,
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return null;
      }
    },

    // Create a new item
    create: async (
      data: Partial<T>,
      uploads: Record<string, File | File[] | null> = {}
    ): Promise<StrapiResponse<T>> => {
      // First create the item
      const response = await collection.create({ data });
      const itemId = response.data.id;

      // Then upload files if any
      try {
        await Promise.all(
          Object.entries(uploads).map(async ([field, files]) => {
            if (!files) return;

            if (Array.isArray(files)) {
              if (files.length) {
                await uploadFiles(files, itemId, ref, field);
              }
            } else {
              await uploadFiles([files], itemId, ref, field);
            }
          })
        );
      } catch (error) {
        console.error(`Error uploading files for ${contentType}:`, error);
      }

      // Return the created item
      return response.data;
    },

    // Update an existing item
    update: async (
      id: number,
      data: Partial<T>,
      uploads: Record<string, File | File[] | null> = {}
    ): Promise<StrapiResponse<T>> => {
      // First update the item data
      const response = await collection.update(id, { data });

      // Then upload files if any
      try {
        await Promise.all(
          Object.entries(uploads).map(async ([field, files]) => {
            if (!files) return;

            if (Array.isArray(files)) {
              if (files.length) {
                await uploadFiles(files, id, ref, field);
              }
            } else {
              await uploadFiles([files], id, ref, field);
            }
          })
        );
      } catch (error) {
        console.error(`Error uploading files for ${contentType}:`, error);
      }

      // Return the updated item
      return response.data;
    },

    // Delete an item
    delete: async (id: number): Promise<boolean> => {
      try {
        await collection.delete(id);
        return true;
      } catch (error) {
        console.error(`Error deleting ${contentType}:`, error);
        return false;
      }
    },

    // Helper to get the proper media URL
    getMediaUrl: (media: any): string => {
      return strapiService.media.getMediaUrl(media);
    },
  };
}
