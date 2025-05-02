// components/EventCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Theme } from "@/styles/activityTheme";
import { Event } from "@/types/activity.types";
import { formatDate } from "@/lib/utils/eventUtils";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();

  // Function to navigate to the event details page
  const handleClick = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <article
      className="flex items-center justify-center rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white overflow-hidden w-[500px] md:w-[600px] lg:w-[700px]"
      style={{ border: `1px solid ${Theme.colors.divider}` }}
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om arrangementet ${event.title}`}
    >
      {/* Image Section */}
      {event.eventCardImage && (
        <div className="relative w-32 md:w-48 flex-shrink-0">
          <img
            src={event.eventCardImage.url}
            alt={event.eventCardImage.alternativeText || event.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "100%" }}
          />
          <div
            className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-60 text-white text-xs rounded-tl-md"
            style={{ fontSize: "0.7rem" }}
          >
            {formatEventDate(event)}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col p-3 md:p-4 flex-grow justify-between min-w-0">
        <div>
          {/* Title */}
          <h3
            className="text-base md:text-lg font-semibold truncate"
            style={{ color: Theme.colors.text.primary }}
          >
            {event.title}
          </h3>

          {/* Description - hidden on small screens */}
          {event.Description && (
            <p
              className="hidden md:block text-sm line-clamp-1 mt-1"
              style={{ color: Theme.colors.text.secondary }}
            >
              {event.Description}
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-xs md:text-sm mt-2">
          {/* Date and Time */}
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
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
              {event.time && ` • ${event.time}`}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center mt-1 md:mt-0">
              <svg
                className="w-3 h-3 mr-1"
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
                className="truncate"
                style={{ color: Theme.colors.text.secondary }}
              >
                {event.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action button - visible only on larger screens */}
      <div
        className="hidden md:flex items-center px-4 border-l"
        style={{ borderColor: Theme.colors.divider }}
      >
        <span
          className="whitespace-nowrap text-xs py-1 px-2 rounded-full"
          style={{
            backgroundColor: `${Theme.colors.primary}20`,
            color: Theme.colors.primary,
          }}
        >
          Klikk for detaljer
        </span>
      </div>
    </article>
  );
};

// Helper function to format event date
const formatEventDate = (event: Event): string => {
  if (!event.startDate) return "Dato kommer";

  const formattedStart = formatDate(event.startDate);

  if (event.endDate) {
    const formattedEnd = formatDate(event.endDate);
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart;
};
