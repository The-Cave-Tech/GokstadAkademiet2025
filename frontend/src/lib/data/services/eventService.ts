// services/eventsService.ts
import { EventAttributes, Media } from "@/types/content.types";

// Define StrapiResponse locally to avoid conflicts
interface StrapiResponse<T> {
  id: number;
}

// Define EventResponse locally
type EventResponse = StrapiResponse<EventAttributes>;

// Define the API base URL explicitly
const API_URL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api`;

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
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }
}

// Helper function to build URL with query parameters
function buildUrl(endpoint: string, params: any = {}): string {
  const url = new URL(`${API_URL}/${endpoint}`);

  // Handle special parameters like sort and populate
  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    sorts.forEach((sort: string, index: number) => {
      url.searchParams.append(`sort[${index}]`, sort);
    });
  }

  if (params.populate) {
    const populates = Array.isArray(params.populate)
      ? params.populate
      : [params.populate];
    populates.forEach((populate: string, index: number) => {
      url.searchParams.append(`populate[${index}]`, populate);
    });
  }

  // Handle other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key !== "sort" && key !== "populate") {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

// Debug function to log what's happening
function logDebug(message: string, ...args: any[]) {
  console.log(`[DEBUG] ${message}`, ...args);
}

// Events service
export const eventsService = {
  // Get all events with optional filters, sorting, and pagination
  getAll: async (params: any = {}): Promise<EventAttributes[]> => {
    try {
      const url = buildUrl("events", params);
      logDebug("Fetching events with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      logDebug("Response received:", responseData);

      // If no data or response not in expected format, return empty array
      if (!responseData.data || !Array.isArray(responseData.data)) {
        logDebug("No data found or data is not an array");
        return [];
      }

      // Directly return the data without expecting an attributes wrapper
      return responseData.data.map((item: any) => ({
        id: item.id,
        ...item, // Spread the item directly since it already contains the event data
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  // Get a single event by ID
  getOne: async (
    id: number | string,
    params: any = {}
  ): Promise<EventAttributes | null> => {
    try {
      const url = buildUrl(`events/${id}`, params);
      logDebug(`Fetching event with URL:`, url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      logDebug("Single event response:", responseData);

      // If no data, return null
      if (!responseData.data) return null;

      // Return the event data directly
      return {
        id: responseData.data.id,
        ...responseData.data.attributes, // Spread attributes directly into the object
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  },

  // Create a new event
  create: async (
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ): Promise<EventResponse> => {
    try {
      const url = buildUrl("events");
      logDebug("Creating event with URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Request failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      logDebug("Create response:", responseData);

      const eventId = responseData.data.id;

      // Then upload card image if any
      if (eventCardImage) {
        logDebug("Uploading card image");
        await uploadFiles(
          [eventCardImage],
          eventId,
          "api::event.event",
          "eventCardImage"
        );
      }

      // Fetch and return the updated event with populated media
      return (await eventsService.getOne(eventId, {
        populate: ["eventCardImage"],
      })) as EventResponse;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Update an existing event
  update: async (
    id: number | string,
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ): Promise<EventResponse> => {
    try {
      const url = buildUrl(`events/${id}`);
      logDebug(`Updating event with URL:`, url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Request failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      logDebug("Update response:", responseData);

      // Then upload card image if any
      if (eventCardImage) {
        logDebug("Uploading card image");
        await uploadFiles(
          [eventCardImage],
          Number(id),
          "api::event.event",
          "eventCardImage"
        );
      }

      // Fetch and return the updated event with populated media
      return (await eventsService.getOne(id, {
        populate: ["eventCardImage"],
      })) as EventResponse;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete an event
  delete: async (id: string): Promise<boolean> => {
    try {
      const url = buildUrl(`events/${id}`); // Use the correct id (e.g., documentId)
      logDebug(`Deleting event with URL:`, url);

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Request failed with status ${response.status}`
        );
      }

      logDebug("Event successfully deleted");
      return true; // Return true if the delete was successful
    } catch (error) {
      console.error("Error deleting event:", error);
      return false; // Return false if the delete failed
    }
  },

  // Get media URL
  getMediaUrl: (media: Media | null): string => {
    if (!media || !media.url) {
      return ""; // Return an empty string if the media is invalid
    }

    const baseUrl = "http://localhost:1337"; // Replace with your Strapi base URL
    return `${baseUrl}${media.url}`;
  },
};
