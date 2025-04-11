"use server";

import { FormDataState, EventResponse } from "@/types/eventTypes";

/**
 * Save or update an event in Strapi
 */
export async function saveEventAction(
  id: number | undefined,
  formData: FormDataState
): Promise<any> {
  try {
    // Check if environment variables are defined
    const apiUrl = process.env.STRAPI_API_URL;

    if (!apiUrl) {
      throw new Error("STRAPI_API_URL environment variable is not defined");
    }

    const url = id ? `${apiUrl}/api/events/${id}` : `${apiUrl}/api/events`;

    const method = id ? "PUT" : "POST";
    const body = JSON.stringify({
      data: formData,
    });

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${id ? "update" : "create"} event: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error saving event:", err);
    throw err;
  }
}

/**
 * Fetch all events from Strapi
 */
export async function fetchEventsAction(): Promise<EventResponse> {
  try {
    // Check if environment variables are defined
    const apiUrl = process.env.STRAPI_API_URL;

    if (!apiUrl) {
      throw new Error("STRAPI_API_URL environment variable is not defined");
    }

    const response = await fetch(
      `${apiUrl}/api/events?populate=featuredImage&sort=eventDate:asc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
        },
        cache: "no-store", // Don't cache this request
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching events:", err);
    throw err;
  }
}

/**
 * Fetch upcoming events from Strapi
 */
export async function fetchUpcomingEventsAction(): Promise<EventResponse> {
  try {
    // Check if environment variables are defined
    const apiUrl = process.env.STRAPI_API_URL;

    if (!apiUrl) {
      throw new Error("STRAPI_API_URL environment variable is not defined");
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `${apiUrl}/api/events?filters[eventDate][$gte]=${today}&filters[eventStatus][$eq]=published&populate=featuredImage&sort=eventDate:asc&pagination[limit]=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch upcoming events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    throw err;
  }
}
