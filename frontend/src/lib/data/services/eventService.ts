// services/eventsService.ts - Updated for Strapi v5 and Next.js 15
import { EventAttributes, EventResponse, Media } from "@/types/content.types";
import { strapiService } from "@/lib/data/services/strapiClient";

// Events service
export const eventsService = {
  // Get all events with optional filters, sorting, and pagination
  getAll: async (
    params: Record<string, unknown> = {}
  ): Promise<EventResponse[]> => {
    try {
      // Using collection method for consistent approach
      const eventsCollection = strapiService.collection("events");

      // Define a properly typed query params object
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["eventCardImage"], // Ensure eventCardImage is populated
      };

      // Use the collection's find method
      const response = await eventsCollection.find(queryParams);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          "Invalid response format: No events found or data is not an array"
        );
      }

      // Transform the response to match our EventResponse type
      return response.data.map((item) => {
        // Extract the base event data directly without attributes nesting
        const event: EventResponse = {
          id: item.id,
          documentId: item.documentId || "",
          title: item.title,
          description: item.description,
          content: item.content || "",
          startDate: item.startDate,
          endDate: item.endDate,
          time: item.time,
          location: item.location || "",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
        };

        // Process the image data if it exists
        if (item.eventCardImage) {
          // Handle both direct and nested data structures
          let imageUrl: string;

          // For Strapi v5
          if (typeof item.eventCardImage.data !== "undefined") {
            // This means we're dealing with the original nested structure
            const data = item.eventCardImage.data;

            if (data) {
              // Structure with attributes (old format)
              imageUrl = strapiService.media.getMediaUrl(data);

              event.eventCardImage = {
                id: data.id || 0,
                url: imageUrl,
                alternativeText: data.alternativeText,
                width: data.width,
                height: data.height,
                formats: data.formats,
              };
            }
          } else {
            // Direct format - no nesting
            imageUrl = strapiService.media.getMediaUrl(item.eventCardImage);

            event.eventCardImage = {
              id: item.eventCardImage.id || 0,
              url: imageUrl,
              alternativeText: item.eventCardImage.alternativeText,
              width: item.eventCardImage.width,
              height: item.eventCardImage.height,
              formats: item.eventCardImage.formats,
            };
          }
        }

        return event;
      });
    } catch (error) {
      console.error(
        "Error fetching events:",
        new Error(
          `Failed to retrieve events: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      return [];
    }
  },

  // Get a single event by ID
  getOne: async (
    id: string | number,
    params: Record<string, unknown> = {}
  ): Promise<EventResponse | null> => {
    try {
      const eventsCollection = strapiService.collection("events");

      // Define a properly typed query params object
      const queryParams: Record<string, unknown> = {
        ...params,
        populate: params.populate || ["eventCardImage"], // Ensure eventCardImage is populated
      };

      // Use the collection's findOne method
      const response = await eventsCollection.findOne(
        id.toString(),
        queryParams
      );

      if (!response.data) {
        throw new Error(`Event with ID ${id} not found`);
      }

      // Transform to match our EventResponse type without attributes nesting
      const event: EventResponse = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        content: response.data.content || "",
        startDate: response.data.startDate,
        endDate: response.data.endDate,
        time: response.data.time,
        location: response.data.location || "",
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        publishedAt: response.data.publishedAt,
      };

      // Process the image data if it exists
      if (response.data.eventCardImage) {
        // Handle both direct and nested data structures
        let imageUrl: string;

        // For Strapi v5
        if (typeof response.data.eventCardImage.data !== "undefined") {
          // This means we're dealing with the original nested structure
          const data = response.data.eventCardImage.data;

          if (data && data.attributes) {
            // Structure with attributes (old format)
            imageUrl = strapiService.media.getMediaUrl(data);

            event.eventCardImage = {
              id: data.id || 0,
              url: imageUrl,
              alternativeText: data.attributes.alternativeText,
              width: data.attributes.width,
              height: data.attributes.height,
              formats: data.attributes.formats,
            };
          }
        } else {
          // Direct format - no nesting
          imageUrl = strapiService.media.getMediaUrl(
            response.data.eventCardImage
          );

          event.eventCardImage = {
            id: response.data.eventCardImage.id || 0,
            url: imageUrl,
            alternativeText: response.data.eventCardImage.alternativeText,
            width: response.data.eventCardImage.width,
            height: response.data.eventCardImage.height,
            formats: response.data.eventCardImage.formats,
          };
        }
      }

      return event;
    } catch (error) {
      console.error(
        "Error fetching event:",
        new Error(
          `Failed to retrieve event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      return null;
    }
  },

  // Helper method to get media URL (for backward compatibility)
  getMediaUrl: (media: Media | Record<string, unknown>) => {
    return strapiService.media.getMediaUrl(media);
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
      }

      // Create payload for Strapi
      const payload = {
        data: {
          title: data.title || "Untitled Event",
          description: data.description || "",
          startDate: data.startDate,
          endDate: data.endDate,
          time: data.time,
          location: data.location || "",
          content: data.content || "",
        },
      };

      const eventsCollection = strapiService.collection("events");
      const response = await eventsCollection.create(payload);

      if (!response || !response.data || !response.data.id) {
        throw new Error("Invalid response from server when creating event");
      }

      const eventId = response.data.id;

      // Upload event image if provided
      if (eventCardImage) {
        await eventsService.uploadEventImage(eventId, eventCardImage);
      }

      // Fetch and return the created event
      const newEvent = await eventsService.getOne(eventId);
      if (!newEvent) {
        // Provide a fallback if fetch fails
        return {
          id: eventId,
          title: payload.data.title,
          description: payload.data.description,
          content: payload.data.content || "",
          startDate: payload.data.startDate,
          endDate: payload.data.endDate,
          time: payload.data.time,
          location: payload.data.location,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      return newEvent;
    } catch (error) {
      console.error(
        "Error creating event:",
        new Error(
          `Failed to create event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },

  // Update an existing event
  update: async (
    id: string | number,
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ): Promise<EventResponse> => {
    try {
      const eventsCollection = strapiService.collection("events");
      await eventsCollection.update(id.toString(), { data });

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
      console.error(
        "Error updating event:",
        new Error(
          `Failed to update event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },

  delete: async (id: string | number): Promise<boolean> => {
    try {
      // Convert to string for consistency with Strapi API
      const stringId = String(id);

      const eventsCollection = strapiService.collection("events");

      // Attempt deletion
      await eventsCollection.delete(stringId);
      return true;
    } catch (error) {
      console.error(
        "Error deleting event:",
        `Failed to delete event: ${error instanceof Error ? error.message : String(error)}`
      );
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

      await strapiService.fetch("upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error(
        "Error uploading event image:",
        new Error(
          `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      throw error;
    }
  },
};
