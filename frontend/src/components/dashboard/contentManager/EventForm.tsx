"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TipTapEditor from "@/components/ui/TipTapEditor";
import { EventResponse, EventAttributes } from "@/types/content.types";
import { eventsService } from "@/lib/data/services/eventService";

interface EventFormProps {
  event: EventResponse | null;
  onSave: (
    data: Partial<EventAttributes>,
    eventCardImage?: File | null
  ) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSave,
  onCancel,
  isLoading,
}) => {
  // Initialize form data with empty values or event data
  const [formData, setFormData] = useState<Partial<EventAttributes>>({
    title: "",
    Description: "",
    content: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    time: "",
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eventCardImage, setEventCardImage] = useState<File | null>(null);

  // Populate form with existing data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.attributes.title || "",
        Description: event.attributes.Description || "",
        content: event.attributes.content || "",
        startDate:
          event.attributes.startDate || new Date().toISOString().split("T")[0],
        endDate: event.attributes.endDate || "",
        time: event.attributes.time || "",
        location: event.attributes.location || "",
      });
    }
  }, [event]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle rich text editor changes
  const handleEditorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  // Handle card image upload
  const handleCardImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEventCardImage(files[0]);
    } else {
      setEventCardImage(null);
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTime = formData.time?.includes(":")
      ? `${formData.time}:00.000` // Add seconds and milliseconds if missing
      : formData.time;

    const eventData = {
      ...formData,
      time: formattedTime,
    };

    try {
      await onSave(eventData, eventCardImage);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="Description">
          Description
        </label>
        <textarea
          id="Description"
          name="Description"
          value={formData.Description || ""}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        ></textarea>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="startDate">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate || ""}
          onChange={handleChange}
          className={`border rounded-md px-3 py-2 ${
            errors.startDate ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="endDate">
          End Date (optional)
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="time">
          Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="location">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
      </div>

      {/* Event Card Image */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="eventCardImage"
        >
          Card Image
        </label>
        <input
          type="file"
          id="eventCardImage"
          name="eventCardImage"
          onChange={handleCardImageChange}
          accept="image/*"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
        {event?.attributes.eventCardImage?.data && !eventCardImage && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Current image:</p>
            <div className="relative h-32 w-48 rounded overflow-hidden">
              <Image
                src={eventsService.getMediaUrl(
                  event.attributes.eventCardImage.data.attributes.url
                )}
                alt="Event card image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content (WYSIWYG) */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="content">
          Content
        </label>
        <TipTapEditor
          value={formData.content || ""}
          onChange={handleEditorChange}
          disabled={isLoading}
          placeholder="Write detailed content about the event here..."
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
