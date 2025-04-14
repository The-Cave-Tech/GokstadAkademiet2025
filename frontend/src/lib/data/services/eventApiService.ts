import axios from "axios";
import { EventResponse, EventAttributes } from "@/types/content.types";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "";

// Fetch all events
export const fetchEvents = async (): Promise<EventResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/events?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Kunne ikke hente events.");
  }
};

// Fetch a single event by ID
export const fetchEventById = async (id: number): Promise<EventResponse> => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw new Error("Kunne ikke hente event.");
  }
};

// Create a new event
export const createEvent = async (
  eventData: Partial<EventAttributes>
): Promise<EventResponse> => {
  try {
    const response = await axios.post(`${API_URL}/events`, {
      data: eventData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Kunne ikke opprette event.");
  }
};

// Update an existing event
export const updateEvent = async (
  id: number,
  eventData: Partial<EventAttributes>
): Promise<EventResponse> => {
  try {
    const response = await axios.put(`${API_URL}/events/${id}`, {
      data: eventData,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw new Error("Kunne ikke oppdatere event.");
  }
};

// Delete an event
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/events/${id}`);
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw new Error("Kunne ikke slette event.");
  }
};

// Save event (create or update based on whether an ID is provided)
export const saveEvent = async (
  eventData: Partial<EventAttributes>,
  id?: number
): Promise<EventResponse> => {
  if (id) {
    // Update existing event
    return await updateEvent(id, eventData);
  } else {
    // Create new event
    return await createEvent(eventData);
  }
};
