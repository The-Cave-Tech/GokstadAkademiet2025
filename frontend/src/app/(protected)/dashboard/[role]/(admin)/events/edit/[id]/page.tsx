"use client";

import React, { useState, useEffect } from "react";
import ContentForm from "@/components/dashboard/contentManager/ContentForm";
import { eventsService } from "@/lib/data/services/eventService";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
  },
};

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);

        // First try to get all events to find the one with matching ID
        const allEvents = await eventsService.getAll({
          populate: ["eventCardImage"],
        });

        // Find the event with matching ID
        const matchingEvent = allEvents.find(
          (e) =>
            e.id.toString() === eventId.toString() ||
            (e.documentId && e.documentId.toString() === eventId.toString())
        );

        if (!matchingEvent) {
          throw new Error("Event not found");
        }

        // Use the documentId for fetching if available
        const idToUse = matchingEvent.documentId || matchingEvent.id;

        // Now fetch the full details using the documentId
        const eventData = await eventsService.getOne(idToUse, {
          populate: ["eventCardImage"],
        });

        if (!eventData) {
          throw new Error("Event details not found");
        }

        setEvent(eventData);
      } catch (err) {
        setError(
          `Failed to load event: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        console.error("Error loading event:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSave = async (data: any, image?: File | null) => {
    try {
      // Use the documentId for the update if available
      const idToUse = event?.documentId || eventId;
      await eventsService.update(idToUse, data, image);
      router.push("/dashboard/admin/events");
    } catch (err) {
      setError(
        `Failed to update event: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      console.error("Error updating event:", err);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/events");
  };

  if (error) {
    return (
      <div
        className="min-h-screen p-6 sm:p-8 md:p-10"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="max-w-4xl mx-auto p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <BackButton />
          <div className="p-4 my-4 rounded-md bg-red-50 border border-red-200 text-red-700">
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/admin/events")}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
          >
            Return to Events List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Event</h1>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="flex justify-center my-16">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: "rgb(225, 217, 209)",
                  borderTopColor: colors.primary,
                }}
              ></div>
            </div>
          ) : (
            <ContentForm
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={false}
              config={{
                type: "event",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                  },
                  {
                    name: "startDate",
                    label: "Start Date",
                    type: "date",
                    required: true,
                  },
                  { name: "endDate", label: "End Date", type: "date" },
                  { name: "time", label: "Time", type: "time" },
                  { name: "location", label: "Location", type: "text" },
                  { name: "content", label: "Content", type: "editor" },
                ],
                getImageUrl: eventsService.getMediaUrl,
                imageName: "Event Card Image",
              }}
              data={event}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
