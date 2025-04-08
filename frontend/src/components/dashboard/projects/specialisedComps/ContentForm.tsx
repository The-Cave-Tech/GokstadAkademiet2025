import React, { useState, useRef } from "react";
import Image from "next/image";
import LayoutSelector, { LayoutType } from "./LayoutSelector";
import { createContent, updateContent } from "@/lib/strapiFirst/api";

export interface ContentFormData {
  title: string;
  description: string;
  layout: LayoutType | null;
  content: string;
  imagePosition?: "left" | "right";
  leftColumnTitle?: string;
  leftColumnContent?: string;
  rightColumnTitle?: string;
  rightColumnContent?: string;
  image: File | null;
}

interface ContentFormProps {
  contentType: string;
  initialData?: Partial<ContentFormData>;
  itemId?: string | number;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({
  contentType,
  initialData,
  itemId,
  onSuccess,
  onCancel,
}) => {
  // Set up form state with defaults
  const [formData, setFormData] = useState<ContentFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    layout: initialData?.layout || null,
    content: initialData?.content || "",
    imagePosition: initialData?.imagePosition || "left",
    leftColumnTitle: initialData?.leftColumnTitle || "",
    leftColumnContent: initialData?.leftColumnContent || "",
    rightColumnTitle: initialData?.rightColumnTitle || "",
    rightColumnContent: initialData?.rightColumnContent || "",
    image: null,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle basic field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle layout selection
  const handleLayoutChange = (layout: LayoutType) => {
    setFormData((prev) => ({ ...prev, layout }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Preview image
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

    if (!formData.title || !formData.description || !formData.layout) {
      setError("Please fill all required fields and select a layout");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data based on layout type
      const apiData: Record<string, any> = {
        title: formData.title,
        description: formData.description,
        layout: formData.layout,
      };

      // Add layout-specific content
      if (formData.layout === "full-width") {
        apiData.content = formData.content;
      } else if (formData.layout === "two-columns") {
        apiData.leftColumnTitle = formData.leftColumnTitle;
        apiData.leftColumnContent = formData.leftColumnContent;
        apiData.rightColumnTitle = formData.rightColumnTitle;
        apiData.rightColumnContent = formData.rightColumnContent;
      } else if (formData.layout === "image-text") {
        apiData.content = formData.content;
        apiData.imagePosition = formData.imagePosition;
      }

      // Create FormData for file upload
      const requestData = new FormData();
      requestData.append("data", JSON.stringify(apiData));

      if (formData.image) {
        requestData.append("files.image", formData.image);
      }

      // Submit to API
      let result;
      if (itemId) {
        result = await updateContent(contentType, itemId, requestData);
      } else {
        result = await createContent(contentType, requestData);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Failed to save content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

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
              value={formData.title}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
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
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
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
                        setFormData((prev) => ({ ...prev, image: null }));
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
          selectedLayout={formData.layout}
          onChange={handleLayoutChange}
        />
      </div>

      {/* Layout-specific Content Fields */}
      {formData.layout && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Content</h2>

          {/* Full Width Layout */}
          {formData.layout === "full-width" && (
            <div>
              <label htmlFor="content" className="block font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          {/* Two Columns Layout */}
          {formData.layout === "two-columns" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="font-medium">Left Column</h3>

                <div>
                  <label
                    htmlFor="leftColumnTitle"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="leftColumnTitle"
                    name="leftColumnTitle"
                    value={formData.leftColumnTitle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="leftColumnContent"
                    className="block text-sm font-medium mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="leftColumnContent"
                    name="leftColumnContent"
                    value={formData.leftColumnContent}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="font-medium">Right Column</h3>

                <div>
                  <label
                    htmlFor="rightColumnTitle"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="rightColumnTitle"
                    name="rightColumnTitle"
                    value={formData.rightColumnTitle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rightColumnContent"
                    className="block text-sm font-medium mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="rightColumnContent"
                    name="rightColumnContent"
                    value={formData.rightColumnContent}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image & Text Layout */}
          {formData.layout === "image-text" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="imagePosition"
                  className="block font-medium mb-1"
                >
                  Image Position
                </label>
                <select
                  id="imagePosition"
                  name="imagePosition"
                  value={formData.imagePosition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block font-medium mb-1">
                  Text Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Content"}
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
