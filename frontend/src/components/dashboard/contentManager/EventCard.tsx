"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Theme } from "@/styles/activityTheme";
import { EventResponse } from "@/types/content.types";
import { formatDate } from "@/lib/utils/eventUtils";
import { isDatePast } from "@/lib/utils/dateUtils";
import { strapiService } from "@/lib/data/services/strapiClient";
import Image from "next/image";

interface EventCardProps {
  event: EventResponse;
}

// Helper function to format time in 00.00 format
const formatTime = (timeString: string): string => {
  if (!timeString) return "";

  const parts = timeString.split(":");
  if (parts.length < 2) return timeString;

  const hours = parts[0].padStart(2, "0");
  const minutes = parts[1].padStart(2, "0");

  return `${hours}.${minutes}`;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();
  const isPastEvent = event.startDate ? isDatePast(event.startDate) : false;

  // Function to navigate to the event details page
  const handleClick = () => {
    if (event.id) {
      router.push(`/aktiviteter/events/${event.id}`);
    } else {
      console.error("Event has no id:", event);
    }
  };

  // Helper function to safely get image URL using strapiService
  const getImageUrl = (): string | null => {
    if (!event.eventCardImage) return null;

    // Use the global strapiService.media.getMediaUrl function
    return strapiService.media.getMediaUrl(event.eventCardImage);
  };

  const imageUrl = getImageUrl();

  return (
    <article
      className="relative flex flex-col sm:flex-row w-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white overflow-hidden"
      style={{ border: `1px solid ${Theme.colors.divider}` }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om arrangementet ${event.title}`}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative w-full sm:w-48 md:w-64 lg:w-72">
          <div className="w-full h-48 sm:h-full relative">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover"
              onError={(e) => {
                // Hide the image container on error
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Status indicator */}
          <div
            className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-60 text-white text-xs rounded-tl-md"
            style={{ fontSize: "0.7rem" }}
          >
            {formatEventDate(event)}
          </div>

          {/* Past event overlay */}
          {isPastEvent && (
            <div className="absolute top-0 left-0 p-1 bg-red-500 text-white text-xs">
              Past Event
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col p-4 flex-grow justify-between min-w-0">
        <div>
          {/* Title */}
          <h3
            className="text-lg md:text-xl font-semibold line-clamp-2"
            style={{ color: Theme.colors.text.primary }}
          >
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p
              className="text-sm md:text-base mt-2 line-clamp-2 md:line-clamp-3"
              style={{ color: Theme.colors.text.secondary }}
            >
              {event.description}
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm mt-4">
          {/* Date and Time */}
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span
              className="truncate"
              style={{ color: Theme.colors.text.secondary }}
            >
              {formatEventDate(event)}
              {event.time ? ` • kl:${formatTime(event.time)}` : ""}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span
                className="truncate max-w-xs"
                style={{ color: Theme.colors.text.secondary }}
              >
                {event.location}
              </span>
            </div>
          )}

          {/* Action button */}
          <div className="ml-auto flex items-center">
            <span
              className="whitespace-nowrap text-xs py-1.5 px-3 rounded-full"
              style={{
                backgroundColor: `${Theme.colors.primary}20`,
                color: Theme.colors.primary,
              }}
            >
              Klikk for detaljer
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

// Helper function to format event date
const formatEventDate = (event: EventResponse): string => {
  if (!event.startDate) return "Dato kommer";

  const formattedStart = formatDate(event.startDate);

  if (event.endDate && event.endDate !== event.startDate) {
    const formattedEnd = formatDate(event.endDate);
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart;
};
