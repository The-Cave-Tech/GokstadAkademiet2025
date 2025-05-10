"use client";

import React, { useState, useEffect } from "react";
import { eventsService } from "@/lib/data/services/eventService";
import { formatDate } from "@/lib/utils/eventUtils";
import BackButton from "@/components/BackButton";
import {
  AdminTable,
  AdminColumn,
  AdminAction,
} from "@/components/dashboard/contentManager/AdminContentTable";
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
      const data = await eventsService.getAll({
        sort: ["startDate:desc"],
        populate: ["eventCardImage"],
      });
      setEvents(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while loading events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed handleDelete function to handle both string and number IDs
  const handleDelete = async (id: string | number) => {
    try {
      // Convert id to string since the service.delete expects a string
      const idString = String(id);
      const success = await eventsService.delete(idString);

      if (success) {
        setSuccessMessage("Event deleted successfully!");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => String(event.documentId) !== idString)
        );
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      setError("Failed to delete event. Please try again.");
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
          {event.description && (
            <div className="mt-1 truncate max-w-xs text-gray-600">
              {event.description}
            </div>
          )}
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
            <div className="mt-1 ml-5.5 text-gray-600">
              to {formatDate(event.endDate)}
            </div>
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
      href: "/admin/events/:id",
    },
    {
      label: "View",
      color: "success",
      href: "/aktiviteter/events/:id",
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
        getItemId={(event) => event.documentId || event.id}
        imageKey="eventCardImage"
        getImageUrl={(image) => eventsService.getMediaUrl(image)}
      />
    </>
  );
}
