// dashboard/projects/components/ProjectForm.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LayoutSelector, { LayoutType } from "./specialisedComps/LayoutSelector";

interface ProjectFormProps {
  initialData?: {
    title?: string;
    description?: string;
    layout?: LayoutType | null;
    [key: string]: any;
  };
  action: (formData: FormData) => Promise<void>;
  cancelHref: string;
}

export default function ProjectForm({
  initialData = {},
  action,
  cancelHref,
}: ProjectFormProps) {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState<LayoutType | null>(
    initialData.layout || null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add layout to form data
      if (selectedLayout) {
        formData.append("layout", selectedLayout);
      }

      await action(formData);
      router.push(cancelHref);
    } catch (err) {
      console.error("Error submitting form:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData.title || ""}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData.description || ""}
              rows={3}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Featured Image</label>
            <div className="flex items-center mt-1">
              <input
                type="file"
                ref={fileInputRef}
                name="image"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />

              <div className="flex items-center">
                {imagePreview ? (
                  <div className="relative h-32 w-32 mr-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                  >
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="px-3 py-1 bg-red-100 rounded text-red-600 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Content Layout</h2>
        <LayoutSelector
          selectedLayout={selectedLayout}
          onChange={setSelectedLayout}
        />
      </div>

      {/* Layout-specific fields would go here */}
      {selectedLayout && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Layout Content</h2>

          {/* Different fields based on layout type */}
          {selectedLayout === "full-width" && (
            <div>
              <label htmlFor="content" className="block font-medium mb-1">
                Content
              </label>
              <textarea
                name="content"
                id="content"
                rows={6}
                className="w-full p-2 border rounded-md"
                defaultValue={initialData.content || ""}
              ></textarea>
            </div>
          )}

          {selectedLayout === "two-columns" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="leftColumnTitle"
                  className="block font-medium mb-1"
                >
                  Left Column Title
                </label>
                <input
                  type="text"
                  name="leftColumnTitle"
                  id="leftColumnTitle"
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.leftColumnTitle || ""}
                />

                <label
                  htmlFor="leftColumnContent"
                  className="block font-medium mb-1 mt-4"
                >
                  Left Column Content
                </label>
                <textarea
                  name="leftColumnContent"
                  id="leftColumnContent"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.leftColumnContent || ""}
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="rightColumnTitle"
                  className="block font-medium mb-1"
                >
                  Right Column Title
                </label>
                <input
                  type="text"
                  name="rightColumnTitle"
                  id="rightColumnTitle"
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.rightColumnTitle || ""}
                />

                <label
                  htmlFor="rightColumnContent"
                  className="block font-medium mb-1 mt-4"
                >
                  Right Column Content
                </label>
                <textarea
                  name="rightColumnContent"
                  id="rightColumnContent"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.rightColumnContent || ""}
                ></textarea>
              </div>
            </div>
          )}

          {selectedLayout === "image-text" && (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="imagePosition"
                  className="block font-medium mb-1"
                >
                  Image Position
                </label>
                <select
                  name="imagePosition"
                  id="imagePosition"
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.imagePosition || "left"}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label htmlFor="textContent" className="block font-medium mb-1">
                  Text Content
                </label>
                <textarea
                  name="textContent"
                  id="textContent"
                  rows={6}
                  className="w-full p-2 border rounded-md"
                  defaultValue={initialData.textContent || ""}
                ></textarea>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
