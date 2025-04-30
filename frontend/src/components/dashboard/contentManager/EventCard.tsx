import React from "react";
import { strapiService } from "@/lib/data/services/strapiClient";
import { Theme } from "@/styles/activityTheme";

interface EventCardProps {
  event: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div
      className="p-4 rounded-md shadow hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.divider}`,
      }}
    >
      <h3
        className="text-lg font-semibold"
        style={{ color: Theme.colors.text.primary }}
      >
        {event.title}
      </h3>
      {event.eventCardImage?.url && (
        <img
          src={strapiService.media.getMediaUrl(event.eventCardImage)}
          alt={event.title}
          className="mt-2 w-full h-48 object-cover rounded-md"
        />
      )}
      <p className="mt-2" style={{ color: Theme.colors.text.secondary }}>
        {event.description}
      </p>
      <p className="mt-1" style={{ color: Theme.colors.text.secondary }}>
        {event.startDate ? `Start Date: ${event.startDate}` : ""}
      </p>
    </div>
  );
};
