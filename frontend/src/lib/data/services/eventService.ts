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
      const info = response.data.map((item: any) => ({
        id: item.id,
        ...item,
        eventCardImage: strapiService.media.getMediaUrl(item.eventCardImage), // Use media utility
      }));
      console.log("Fetched events:", info); // Log the fetched events

      return info;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  getMediaUrl: (imagePath: string) => `/media/${imagePath}`, // Add this method

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

      return {
        id: response.data.id,
        ...response.data.attributes,
        eventCardImage: strapiService.media.getMediaUrl(
          response.data.attributes.eventCardImage
        ), // Use media utility
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
      // Ensure the payload matches the expected structure
      const payload = {
        title: data.title,
        description: data.Description, // Ensure this matches the Strapi field name
        startDate: data.startDate,
        endDate: data.endDate,
        time: data.time,
        location: data.location,
        content: data.content,
      };

      const response = await strapiService.fetch<any>("events", {
        method: "POST",
        body: { data: payload },
      });

      console.log("Payload:", payload);

      const eventId = response.data.id;

      // Upload event image if provided
      if (eventCardImage) {
        await eventsService.uploadEventImage(eventId, eventCardImage);
      }

      // Fetch and return the created event
      const createdEvent = await eventsService.getOne(eventId);
      if (!createdEvent) {
        throw new Error("Failed to fetch the created event.");
      }
      return createdEvent;
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
      await strapiService.fetch<any>(`events/${id}`, {
        method: "PUT",
        body: { data },
      });

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
  delete: async (id: string): Promise<boolean> => {
    try {
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
      const formData = new FormData();
      formData.append("ref", "api::event.event");
      formData.append("refId", eventId.toString());
      formData.append("field", "eventCardImage");
      formData.append("files", image);

      await strapiService.fetch<any>("upload", {
        method: "POST",
        body: formData as any, // Type cast needed here
      });
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  },
};
