"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { eventsService } from "@/lib/data/services/eventService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { formatDate } from "@/lib/utils/eventUtils";
import { Theme } from "@/styles/activityTheme";
import { EventResponse } from "@/types/content.types";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the ID from params
  const eventId = params.id as string;

  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventId) return;

      setIsLoading(true);

      try {
        // For Strapi v5, we need to use documentId instead of id
        // First try to fetch all events to find the one with the matching URL id
        const allEvents = await eventsService.getAll({
          populate: ["eventCardImage"],
        });

        // Find the event with matching id or documentId
        let targetEvent = null;

        // First try to find by numeric ID (for backward compatibility)
        if (!isNaN(Number(eventId))) {
          targetEvent = allEvents.find((e) => e.id === Number(eventId));
        }

        // If not found and eventId has a specific format (like documentId)
        if (!targetEvent && eventId.includes("-")) {
          targetEvent = allEvents.find((e) => e.documentId === eventId);
        }

        // If still not found, try finding by string ID
        if (!targetEvent) {
          targetEvent = allEvents.find((e) => e.id.toString() === eventId);
        }

        if (!targetEvent) {
          throw new Error("Event not found");
        }

        setEvent(targetEvent);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Could not load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventId]);

  // Format time in 00.00 format
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;

    const hours = parts[0].padStart(2, "0");
    const minutes = parts[1].padStart(2, "0");

    return `${hours}.${minutes}`;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!event) return <ErrorMessage message="Event not found" />;

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6">
      <div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: Theme.colors.surface }}
      >
        {/* Back button */}
        <div
          className="p-4 border-b"
          style={{ borderColor: Theme.colors.divider }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm hover:underline"
            style={{ color: Theme.colors.text.secondary }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tilbake til arrangementer
          </button>
        </div>

        {/* Event Header */}
        <div className="relative">
          {event.eventCardImage?.url && (
            <div className="w-full h-72 sm:h-96 relative">
              <Image
                src={event.eventCardImage.url}
                alt={event.title}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)",
                }}
              ></div>
            </div>
          )}

          <div
            className={`${event.eventCardImage?.url ? "absolute bottom-0 left-0 right-0" : ""} p-6 text-white`}
          >
            <h1
              className={`text-3xl sm:text-4xl font-bold ${event.eventCardImage?.url ? "text-white" : "text-gray-800"}`}
            >
              {event.title}
            </h1>

            {/* Date and time information */}
            <div
              className={`flex flex-wrap gap-4 mt-4 ${event.eventCardImage?.url ? "text-white" : "text-gray-700"}`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {formatDate(event.startDate || "")}
                  {event.endDate &&
                    event.endDate !== event.startDate &&
                    ` - ${formatDate(event.endDate)}`}
                </span>
              </div>

              {event.time && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>kl: {formatTime(event.time)}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6 sm:p-8">
          {/* Description */}
          {event.description && (
            <div className="mb-8">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: Theme.colors.text.primary }}
              >
                Om arrangementet
              </h2>
              <p style={{ color: Theme.colors.text.secondary }}>
                {event.description}
              </p>
            </div>
          )}

          {/* Main content */}
          {event.content && (
            <div
              className="prose max-w-none"
              style={{ color: Theme.colors.text.primary }}
            >
              <div dangerouslySetInnerHTML={{ __html: event.content }} />
            </div>
          )}

          {/* Registration or RSVP section */}
          <div
            className="mt-10 pt-6 border-t"
            style={{ borderColor: Theme.colors.divider }}
          >
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">
                Vil du delta?
              </h3>
              <p className="mt-2 text-sm text-blue-600">
                For å melde deg på dette arrangementet, vennligst ta kontakt med
                oss.
              </p>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={() => router.push("/kontakt-oss")}
              >
                Kontakt oss for påmelding
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
