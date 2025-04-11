// app/events/page.tsx
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { Metadata } from "next";
import EventCard from "@/components/dashboard/events/EventCard";
import { Event } from "@/types/eventTypes";

export const metadata: Metadata = {
  title: "Events | Our Company",
  description:
    "Check out our upcoming events and join us for exciting opportunities to connect and learn.",
};

async function getEvents(): Promise<Event[]> {
  try {
    // Check if environment variables are defined
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!apiUrl) {
      console.error("STRAPI_API_URL environment variable is not defined");
      return [];
    }

    // Construct the URL
    const url = `${apiUrl}/api/events?populate=featuredImage`;

    // Log the request URL for debugging
    console.log("Requesting URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      // Get more details about the error
      const errorText = await response.text();
      console.error("API response error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();

    // Check the structure of the response
    console.log("API response structure:", Object.keys(result));

    // Return empty array if data is missing
    if (!result.data) {
      console.warn("API response missing data property:", result);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  // Separate upcoming and past events
  const today = new Date().setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    return (
      !event.attributes.eventDate ||
      new Date(event.attributes.eventDate).getTime() >= today
    );
  });

  const pastEvents = events
    .filter((event) => {
      return (
        event.attributes.eventDate &&
        new Date(event.attributes.eventDate).getTime() < today
      );
    })
    .sort((a, b) => {
      // Sort past events in reverse chronological order (newest first)
      return (
        new Date(b.attributes.eventDate).getTime() -
        new Date(a.attributes.eventDate).getTime()
      );
    });

  // Group upcoming events by month and year
  const groupedUpcomingEvents = upcomingEvents.reduce(
    (groups: Record<string, Event[]>, event) => {
      if (!event.attributes.eventDate) {
        const key = "No Date";
        if (!groups[key]) groups[key] = [];
        groups[key].push(event);
        return groups;
      }

      const date = new Date(event.attributes.eventDate);
      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(event);
      return groups;
    },
    {}
  );

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Events & Announcements</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join us for upcoming events and stay connected with our community.
          </p>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>

        {Object.keys(groupedUpcomingEvents).length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-12">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-gray-600">Check back soon for new events!</p>
          </div>
        ) : (
          <div className="space-y-12 mb-12">
            {Object.entries(groupedUpcomingEvents).map(
              ([monthYear, monthEvents]) => (
                <div key={monthYear}>
                  <h3 className="text-xl font-semibold mb-6 pb-2 border-b">
                    {monthYear}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-8 mt-16">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {pastEvents.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  href="/events/archive"
                  className="inline-block px-5 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View All Past Events
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
