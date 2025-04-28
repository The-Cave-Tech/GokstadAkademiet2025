"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EventForm from "@/components/dashboard/contentManager/EventForm";
import { eventsService } from "@/lib/data/services/eventService";
import { EventAttributes } from "@/types/content.types";

// Earthy color palette variables for easy customization - same as in EventsAdminPage
const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  primaryHover: "rgb(109, 76, 65)", // Darker brown
  secondary: "rgb(78, 52, 46)", // Dark brown
  tertiary: "rgb(188, 170, 164)", // Light brown
  accent: "rgb(141, 110, 99)", // Medium brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  surfaceHover: "rgb(237, 231, 225)", // Light warm gray
  divider: "rgb(225, 217, 209)", // Soft divider
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
    light: "rgb(145, 131, 127)", // Light brown text
  },
  success: "rgb(96, 125, 83)", // Mossy green
  successHover: "rgb(85, 111, 74)",
  error: "rgb(168, 77, 70)", // Earthy red
  errorHover: "rgb(150, 69, 63)",
  warning: "rgb(190, 142, 79)", // Amber/ochre
  warningHover: "rgb(171, 128, 71)",
  info: "rgb(84, 110, 122)", // Slate blue-gray
  infoHover: "rgb(75, 99, 110)",
};

export default function NewEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async (
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await eventsService.create(data, eventCardImage);
      router.push("/dashboard/admin/events");
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err.message || "An error occurred while creating the event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/events");
  };

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      {/* Card Container */}
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold">Create New Event</h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div
              className="px-4 py-3 mb-6 rounded-md"
              style={{
                backgroundColor: "rgba(168, 77, 70, 0.1)",
                color: colors.error,
                border: `1px solid ${colors.error}`,
              }}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: `${colors.divider}`,
                  borderTopColor: colors.primary,
                }}
              ></div>
            </div>
          )}

          {/* Form */}
          <div className="relative">
            <EventForm
              event={null}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
