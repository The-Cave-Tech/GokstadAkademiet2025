"use client";

import React, { useState, useEffect } from "react";
import { eventsService } from "@/lib/data/services/eventService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/ui/BackButton";
import { AdminTable, AdminColumn, AdminAction } from "@/components/pageSpecificComponents/dashboard/contentManager/AdminContentTable";
import { MdLocationOn, MdCalendarToday, MdAccessTime } from "react-icons/md";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsService.getAll();

      // Add a documentId lookup map to each event for quick reference
      const enhancedData = data.map((event) => {
        return {
          ...event,
          _idLookup: {
            [String(event.documentId)]: event.id,
          },
        };
      });

      setEvents(enhancedData);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find event by documentId and get the actual ID
  const findEventIdByDocumentId = (documentId: string): number | string | null => {
    for (const event of events) {
      // If the event has this documentId, return its numeric id
      if (event.documentId === documentId) {
        return event.id;
      }
    }
    return null;
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setError(null);

    try {
      // Check if this is a documentId (string) and find the corresponding event
      let eventId = id;
      let eventToDelete = null;

      if (typeof id === "string" && id.length > 10) {
        // This looks like a documentId, find the corresponding numeric ID
        const foundEventId = findEventIdByDocumentId(id as string);
        if (foundEventId === null) {
          setError("Could not find event ID for the given document ID");
          return;
        }
        eventId = foundEventId;

        if (eventId) {
          eventToDelete = events.find((e) => e.id === eventId);
        }
      } else {
        // Regular numeric ID
        eventToDelete = events.find((e) => String(e.id) === String(id));
      }

      if (!eventToDelete) {
        setError("Could not find event to delete");
        return;
      }

      // Use the documentId for delete operation since that's what Strapi 5 expects
      const deleteId = eventToDelete.documentId || eventToDelete.id;

      const success = await eventsService.delete(deleteId);

      if (success) {
        setSuccessMessage("Event deleted successfully!");
        // Update the events state by filtering out the deleted event
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete.id));
      } else {
        // Fall back to client-side only delete
        setSuccessMessage("Event removed from view");

        // Add to localStorage for persistence
        try {
          const deletedIds = JSON.parse(localStorage.getItem("deletedEventIds") || "[]");
          const idToStore = String(eventToDelete.id);
          if (!deletedIds.includes(idToStore)) {
            deletedIds.push(idToStore);
            localStorage.setItem("deletedEventIds", JSON.stringify(deletedIds));
          }
        } catch (e) {
          console.error("Failed to update localStorage:", e);
        }

        // Update UI
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete.id));
      }
    } catch (error) {
      setError(`Failed to delete event: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Format time in 00.00 format
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;

    const hours = parts[0].padStart(2, "0");
    const minutes = parts[1].padStart(2, "0");

    return `${hours}.${minutes}`;
  };

  // Define columns for the admin table
  const columns: AdminColumn[] = [
    {
      key: "title",
      header: "Title",
      render: (event) => (
        <div>
          <div className="font-medium">{event.title}</div>
          {event.description && <div className="mt-1 truncate max-w-xs text-gray-600">{event.description}</div>}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      width: "200px",
      render: (event) => (
        <div>
          <div className="flex items-center">
            <MdCalendarToday className="w-4 h-4 mr-1.5 text-gray-500" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          {event.endDate && event.endDate !== event.startDate && (
            <div className="mt-1 ml-5.5 text-gray-600">to {formatDate(event.endDate)}</div>
          )}
          {event.time && (
            <div className="mt-1 flex items-center text-gray-600">
              <MdAccessTime className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>{formatTime(event.time)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      width: "200px",
      render: (event) => (
        <div className="flex items-center">
          {event.location ? (
            <>
              <MdLocationOn className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>{event.location}</span>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
  ];

  // Define actions for the admin table
  const actions: AdminAction[] = [
    {
      label: "Delete",
      color: "error",
      onClick: handleDelete,
    },
    {
      label: "Edit",
      color: "info",
      href: (id) => {
        // If this is a documentId, find the corresponding numeric id for the href
        if (typeof id === "string" && id.length > 10) {
          const event = events.find((e) => e.documentId === id);
          if (event) {
            return `/dashboard/admin/events/edit/${event.id}`;
          }
        }
        return `/dashboard/admin/events/edit/${id}`;
      },
    },
    {
      label: "View",
      color: "success",
      href: (id) => {
        // For View button, always use the numeric ID
        // If this is a documentId, find the corresponding numeric id
        if (typeof id === "string" && id.length > 10) {
          const event = events.find((e) => e.documentId === id);
          if (event) {
            return `/aktiviteter/events/${event.id}`;
          }
        }
        return `/aktiviteter/events/${id}`;
      },
      external: true,
    },
  ];

  return (
    <>
      <BackButton />
      <AdminTable
        title="Manage Events"
        items={events}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        emptyMessage={{
          title: "No events found",
          description: "Create a new event to get started.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        }}
        createButton={{
          label: "New Event",
          href: "/dashboard/admin/events/new",
        }}
        getItemId={(event) => {
          // Return documentId since that's what Strapi 5 expects for operations
          return event.documentId || event.id;
        }}
        imageKey="eventCardImage"
        getImageUrl={(image) => eventsService.getMediaUrl(image)}
      />
    </>
  );
}
