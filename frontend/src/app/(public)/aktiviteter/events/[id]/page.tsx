"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { eventsService } from "@/lib/data/services/eventService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EventResponse } from "@/types/content.types";
import { MdLocationOn, MdAccessTime, MdEvent } from "react-icons/md";
import BackButton from "@/components/BackButton";
import ReactMarkdown from "react-markdown";

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

  // Format date in Norwegian format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!event) return <ErrorMessage message="Event not found" />;

  return (
    <div className="bg-white min-h-screen">
      <BackButton />
      {/* Header/Banner Image */}
      <div className="w-full h-64 relative bg-gray-200">
        {event.eventCardImage?.url ? (
          <Image src={event.eventCardImage.url} alt={event.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <h1 className="text-3xl font-bold text-gray-700">{event.title}</h1>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Event Info */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Arrangement info</h4>
                <ul className="space-y-2 text-sm">
                  {/* Date */}
                  <li className="flex items-center gap-2">
                    <MdEvent className="text-gray-500" />
                    <span>
                      {formatDate(event.startDate || "")}
                      {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                    </span>
                  </li>

                  {/* Time */}
                  {event.time && (
                    <li className="flex items-center gap-2">
                      <MdAccessTime className="text-gray-500" />
                      <span>kl: {formatTime(event.time)}</span>
                    </li>
                  )}

                  {/* Location */}
                  {event.location && (
                    <li className="flex items-center gap-2">
                      <MdLocationOn className="text-gray-500" />
                      <span>{event.location}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Event Links */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => router.push("/kontakt-oss")}
                  className="flex items-center w-full gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 justify-center"
                >
                  Kontakt oss for påmelding
                </button>
              </div>

              {/* Event Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                {event.publishedAt && <p>Publisert: {formatDate(event.publishedAt)}</p>}
                {event.createdAt && <p>Opprettet: {formatDate(event.createdAt)}</p>}
                {event.updatedAt && <p>Sist oppdatert: {formatDate(event.updatedAt)}</p>}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            {/* Event Title and Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
              <div className="text-sm text-red-500 mt-2 tracking-wider uppercase">
                ARRANGEMENT • {formatDate(event.publishedAt || event.createdAt || "")}
              </div>
            </div>

            {/* Event Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-red-500 pl-3">
                  Om Arrangementet
                </h2>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            )}

            <div className="prose max-w-none">
              {event.content ? (
                <ReactMarkdown>{event.content}</ReactMarkdown>
              ) : (
                <p>Ingen innhold tilgjengelig for dette eventet.</p>
              )}
            </div>

            {/* Registration Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Påmelding</h2>
              <div className="bg-blue-50 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Vil du delta?</h3>
                <p className="mt-2 text-sm text-blue-600">
                  For å melde deg på dette arrangementet, vennligst ta kontakt med oss via skjemaet nedenfor eller bruk
                  kontaktinformasjonen til høyre.
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
    </div>
  );
}
