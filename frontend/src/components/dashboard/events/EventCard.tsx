"use client";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types/eventTypes";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
}

export default function EventCard({ event, onEdit }: EventCardProps) {
  const { id, Title, Slug, Summary, EventDate, EventTime, Location } = event;

  // Get the featured image URL or use a placeholder
  const imageUrl = "/placeholder-event.jpg"; // Default to placeholder for now

  // Format the date
  const formattedDate = EventDate
    ? new Date(EventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBA";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={Title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{Title}</h3>

        {/* Event details */}
        <div className="mb-3 text-sm text-gray-600 space-y-1">
          <div className="flex items-center">
            <CalendarIcon size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>

          {EventTime && (
            <div className="flex items-center">
              <ClockIcon size={16} className="mr-2" />
              <span>{EventTime}</span>
            </div>
          )}

          {Location && (
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2" />
              <span>{Location}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{Summary}</p>

        <div className="flex justify-between items-center">
          <Link
            href={`/events/${Slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Event Details
          </Link>

          {onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
