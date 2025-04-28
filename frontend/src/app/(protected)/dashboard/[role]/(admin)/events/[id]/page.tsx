"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EventForm from "@/components/dashboard/contentManager/EventForm";
import { eventsService } from "@/lib/data/services/eventService";
import { EventAttributes, EventResponse } from "@/types/content.types";

export default function EditEventPage() {
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const documentId = searchParams.get("documentId"); // Extract documentId from query params

  useEffect(() => {
    if (!documentId) {
      setError("Invalid document ID");
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        const data = await eventsService.getAll({
          filters: { documentId: { $eq: documentId } }, // Filter by documentId
          populate: ["eventCardImage"],
        });

        if (data.length > 0) {
          setEvent(data[0]); // Set the first matching event
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Could not load the event");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [documentId]);

  const handleSave = async (
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ) => {
    if (data.time) {
      // Ensure the time is in the correct format
      const timeRegex = /^\d{2}:\d{2}:\d{2}\.\d{3}$/; // Matches HH:mm:ss.SSS
      if (!timeRegex.test(data.time)) {
        const [hours, minutes] = data.time.split(":");
        data.time = `${hours}:${minutes}:00.000`; // Format to HH:mm:ss.SSS
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      if (event) {
        await eventsService.update(event.id, data, eventCardImage);
      } else {
        await eventsService.create(data, eventCardImage);
      }
      router.push("/admin/events");
    } catch (err: any) {
      console.error("Error saving event:", err);
      setError(err.message || "An error occurred while saving the event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/events");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Event {event ? `- ${event.title}` : ""}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : event ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <EventForm
            event={event}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </div>
      ) : (
        <div className="text-center my-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Event not found</p>
          <button
            onClick={() => router.push("/admin/events")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Events
          </button>
        </div>
      )}
    </div>
  );
}
