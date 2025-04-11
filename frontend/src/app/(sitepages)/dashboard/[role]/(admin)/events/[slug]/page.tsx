// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ClockIcon, MapPinIcon, Share2Icon } from "lucide-react";
import RichTextRenderer from "@/components/RichTextRenderer";
import { Metadata } from "next";
import { Event } from "@/types";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    // Check if environment variables are defined
    const apiUrl = process.env.STRAPI_API_URL;

    if (!apiUrl) {
      console.error("STRAPI_API_URL environment variable is not defined");
      return null;
    }

    // Log the request URL for debugging - note we're using Slug as a number since that's what Strapi expects
    const url = `${apiUrl}/api/events?filters[Slug][$eq]=${slug}`;
    console.log("Requesting event with URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
      next: { revalidate: 60 }, // Revalidate every minute
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
        `Failed to fetch event: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();

    // Check the structure of the response
    console.log("API response structure:", Object.keys(result));

    if (!result.data || result.data.length === 0) {
      return null;
    }

    return result.data[0];
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.Title} | Our Events`,
    description: event.Summary,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const { Title, Content, EventDate, EventTime, Location, eventStatus } = event;

  // Format the date
  const formattedDate = EventDate
    ? new Date(EventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBA";

  // Get the featured image URL or use a placeholder
  const imageUrl = "/placeholder-event.jpg";

  // Check if event is canceled
  const isCanceled = eventStatus === "canceled";

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/events"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Events
            </Link>

            {isCanceled && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-md inline-block mb-3">
                This event has been canceled
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{Title}</h1>

            <div className="flex flex-wrap gap-4 mt-4">
              {EventDate && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                  <CalendarIcon size={18} className="mr-2" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {EventTime && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                  <ClockIcon size={18} className="mr-2" />
                  <span>{EventTime}</span>
                </div>
              )}

              {Location && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                  <MapPinIcon size={18} className="mr-2" />
                  <span>{Location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={Title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          {/* Event Details */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="prose prose-lg max-w-none">
                <RichTextRenderer content={Content} />
              </div>
            </div>

            {/* Event Info Sidebar */}
            <div className="w-full md:w-64">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-4">
                <h3 className="font-semibold text-lg mb-4">
                  Event Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p className="text-gray-800">{formattedDate}</p>
                  </div>

                  {EventTime && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Time
                      </h4>
                      <p className="text-gray-800">{EventTime}</p>
                    </div>
                  )}

                  {Location && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Location
                      </h4>
                      <p className="text-gray-800">{Location}</p>
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Share this event
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <Share2Icon size={18} />
                      </button>
                      {/* Add more share buttons as needed */}
                    </div>
                  </div>
                </div>

                {/* Registration/RSVP Button */}
                {!isCanceled && (
                  <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
