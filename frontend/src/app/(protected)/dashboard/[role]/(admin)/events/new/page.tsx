"use client";

import React from "react";
import ContentForm from "@/components/pageSpecificComponents/dashboard/contentManager/ContentForm";
import { eventsService } from "@/lib/data/services/eventService";
import { useRouter } from "next/navigation";

const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
  },
};

const NewEventPage = () => {
  const router = useRouter();
  const handleSave = async (data: any, image?: File | null) => {
    await eventsService.create(data, image);
    router.push("/dashboard/admin/events"); // Redirect to user's event list after successful creation
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Event</h1>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <ContentForm
            onSave={handleSave}
            onCancel={() => console.log("Cancelled")}
            isLoading={false}
            config={{
              type: "event",
              fields: [
                { name: "title", label: "Title", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
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
          />
        </div>
      </div>
    </div>
  );
};

export default NewEventPage;
