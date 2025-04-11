"use client";
import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import ProjectEventEditor from "../ProjectEventEditor";
import { Event, FormDataState } from "@/types/eventTypes";

interface EventModalProps {
  isOpen: boolean;
  closeAction: () => void;
  event: Event | null;
  saveAction: (id: number | undefined, data: FormDataState) => Promise<void>;
}

export default function EventModal({
  isOpen,
  closeAction,
  event = null,
  saveAction,
}: EventModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    slug: "",
    summary: "",
    content: "<p>Start creating your event content here...</p>",
    eventStatus: "draft",
    eventDate: "",
    eventTime: "",
    location: "",
  });

  // Handle Client-Side Rendering for the Portal
  useEffect(() => {
    setMounted(true);

    // Reset form when modal opens with an event
    if (isOpen && event) {
      setFormData({
        title: event.attributes.title || "",
        slug: event.attributes.slug || "",
        summary: event.attributes.summary || "",
        content:
          event.attributes.content ||
          "<p>Start creating your event content here...</p>",
        eventStatus: event.attributes.eventStatus || "draft",
        eventDate: event.attributes.eventDate || "",
        eventTime: event.attributes.eventTime || "",
        location: event.attributes.location || "",
      });
    } else if (isOpen) {
      // Reset form for new event
      setFormData({
        title: "",
        slug: "",
        summary: "",
        content: "<p>Start creating your event content here...</p>",
        eventStatus: "draft",
        eventDate: "",
        eventTime: "",
        location: "",
      });
    }
  }, [isOpen, event]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Generate slug from title if slug is empty
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // Handle content changes from the WYSIWYG editor
  const handleContentChange = (html: string) => {
    setFormData({ ...formData, content: html });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveAction(event?.id, formData);
      closeAction();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If the component isn't mounted yet or the modal is closed, don't render anything
  if (!mounted || !isOpen) return null;

  // Render the modal using a portal
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeAction}
      ></div>

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={closeAction}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon size={24} />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="overflow-y-auto p-4 max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium"
                >
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Event Time */}
              <div>
                <label
                  htmlFor="eventTime"
                  className="block text-sm font-medium"
                >
                  Event Time
                </label>
                <input
                  type="text"
                  id="eventTime"
                  name="eventTime"
                  placeholder="e.g., 6:00 PM - 9:00 PM"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Conference Center, 123 Main St"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Slug Input */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers, and hyphens only"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Will be used in the URL: /events/
                  {formData.slug || "example-event"}
                </p>
              </div>

              {/* Summary Input */}
              <div>
                <label htmlFor="summary" className="block text-sm font-medium">
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={2}
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  A brief description that will appear on the event card
                </p>
              </div>

              {/* Event Status Dropdown */}
              <div>
                <label
                  htmlFor="eventStatus"
                  className="block text-sm font-medium"
                >
                  Status
                </label>
                <select
                  id="eventStatus"
                  name="eventStatus"
                  value={formData.eventStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              {/* Content Editor */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Event Details Content
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  This content will be displayed on the event details page
                </p>
                <ProjectEventEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  type="event"
                />
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeAction}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
