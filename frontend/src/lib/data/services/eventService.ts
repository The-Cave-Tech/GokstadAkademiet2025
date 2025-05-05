// services/eventsService.ts
import { EventAttributes, Media } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Define EventResponse type that includes id
interface EventResponse extends EventAttributes {
  id: number;
}

// Events service
export const eventsService = {
  // Get all events with optional filters, sorting, and pagination
  getAll: async (params: any = {}): Promise<EventResponse[]> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["eventCardImage"], // Ensure eventCardImage is populated
      };

      const response = await strapiService.fetch<any>("events", {
        params: queryParams,
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("No events found or data is not an array");
        return [];
      }

      const test = response.data.map((item: any) => ({
        id: item.id,
        ...item, // This includes all fields directly
        eventCardImage: strapiService.media.getMediaUrl(item.eventCardImage),
      }));
      console.log("Fetched events:", test);
      return test;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  // Get media URL helper
  getMediaUrl: (media: any) => {
    return strapiService.media.getMediaUrl(media);
  },

  // Get a single event by ID
  getOne: async (
    id: number | string,
    params: any = {}
  ): Promise<EventResponse | null> => {
    try {
      const queryParams = {
        ...params,
        populate: params.populate || ["eventCardImage"], // Ensure eventCardImage is populated
      };

      const response = await strapiService.fetch<any>(`events/${id}`, {
        params: queryParams,
      });

      if (!response.data) return null;

      // Handle flat structure (no attributes)
      return {
        id: response.data.id,
        ...response.data, // Include all fields directly
        eventCardImage: strapiService.media.getMediaUrl(
          response.data.eventCardImage
        ),
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
      // Format time if provided
      if (data.time) {
        const timeRegex = /^\d{2}:\d{2}:\d{2}\.\d{3}$/; // Matches HH:mm:ss.SSS
        if (!timeRegex.test(data.time)) {
          const [hours, minutes] = data.time.split(":");
          data.time = `${hours}:${minutes}:00.000`; // Format to HH:mm:ss.SSS
        }
      }

      // Validate startDate - if missing or invalid, use current date
      if (!data.startDate) {
        const today = new Date();
        data.startDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        console.warn(
          "[EventsService] Missing startDate, defaulting to today:",
          data.startDate
        );
      }

      // IMPORTANT: Here's the fix - use Description with uppercase D for your Strapi field name
      // Create payload only with the fields that exist in your Strapi schema
      const payload = {
        title: data.title || "Untitled Event",
        description: data.description || "", // Keep it as Description with capital D
        startDate: data.startDate,
        endDate: data.endDate,
        time: data.time,
        location: data.location || "",
        content: data.content || "",
      };

      console.log("[EventsService] Creating event with payload:", payload);

      const response = await strapiService.fetch<any>("events", {
        method: "POST",
        body: { data: payload },
      });

      console.log("[EventsService] Create event response:", response);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating event");
      }

      const eventId = response.data.id;

      // Upload event image if provided
      if (eventCardImage) {
        await eventsService.uploadEventImage(eventId, eventCardImage);
      }

      // If fetch fails, construct a valid EventResponse from the payload
      const fallbackResponse: EventResponse = {
        id: eventId,
        title: payload.title,
        description: payload.description, // Use the correct field name with capital D
        content: payload.content,
        startDate: payload.startDate,
        endDate: payload.endDate,
        time: payload.time,
        location: payload.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return fallbackResponse;
    } catch (error) {
      console.error("[EventsService] Error creating event:", error);
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
      // Log the update payload for debugging
      console.log(`Updating event ${id} with data:`, data);

      const response = await strapiService.fetch<any>(`events/${id}`, {
        method: "PUT",
        body: { data },
      });

      console.log("Update response:", response);

      // Upload event image if provided
      if (eventCardImage) {
        await eventsService.uploadEventImage(id, eventCardImage);
      }

      // Fetch and return the updated event
      const updatedEvent = await eventsService.getOne(id);
      if (!updatedEvent) {
        throw new Error("Failed to fetch the updated event.");
      }
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete an event
  delete: async (id: string | number): Promise<boolean> => {
    try {
      console.log(`Deleting event with ID: ${id}`);
      await strapiService.fetch<any>(`events/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  },

  // Upload event image
  uploadEventImage: async (
    eventId: number | string,
    image: File
  ): Promise<void> => {
    try {
      console.log(`Uploading image for event ${eventId}`);

      const formData = new FormData();
      formData.append("ref", "api::event.event");
      formData.append("refId", eventId.toString());
      formData.append("field", "eventCardImage");
      formData.append("files", image);

      const response = await strapiService.fetch<any>("upload", {
        method: "POST",
        body: formData,
      });

      console.log("Image upload response:", response);
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  },
};
