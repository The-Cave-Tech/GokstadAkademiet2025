// components/EventCard.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { strapiService } from "@/lib/data/services/strapiClient";
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
      className="p-4 rounded-md shadow hover:shadow-lg transition-shadow cursor-pointer"
      style={{
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.divider}`,
        transition: "all 0.2s ease-in-out",
      }}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      tabIndex={0}
      role="button"
      aria-label={`Vis detaljer om arrangementet ${event.title}`}
    >
      {/* Header Section */}
      <header>
        {event.eventCardImage && (
          <figure className="relative w-full h-48 overflow-hidden rounded-md mb-3">
            <img
              src={strapiService.media.getMediaUrl(event.eventCardImage)}
              alt={event.eventCardImage.alternativeText || event.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            <figcaption
              className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-60 text-white text-xs rounded-tl-md"
              style={{ fontSize: "0.7rem" }}
            >
              {formatEventDate(event)}
            </figcaption>
          </figure>
        )}
        <h3
          className="text-lg font-semibold"
          style={{ color: Theme.colors.text.primary }}
        >
          {event.title}
        </h3>
      </header>

      {/* Description Section */}
      <section className="mt-2" style={{ color: Theme.colors.text.secondary }}>
        {event.Description && (
          <p className="line-clamp-2 text-sm">{event.Description}</p>
        )}
      </section>

      {/* Event Details Section */}
      <section className="mt-3 flex flex-col gap-1 text-sm">
        {/* Date and Time Information */}
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
          <span style={{ color: Theme.colors.text.secondary }}>
            {formatEventDate(event)}
            {event.time && ` • ${event.time}`}
          </span>
        </div>

        {/* Location Information */}
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
            <span style={{ color: Theme.colors.text.secondary }}>
              {event.location}
            </span>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="mt-3 flex justify-end">
        <span
          className="text-xs py-1 px-2 rounded-full bg-opacity-10"
          style={{
            backgroundColor: `${Theme.colors.primary}20`,
            color: Theme.colors.primary,
          }}
        >
          Klikk for detaljer
        </span>
      </footer>
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
