"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TipTapEditor from "@/components/ui/TipTapEditor";

export interface ContentFormProps {
  event: Event;
  onSave: (data: any, image?: File | null) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  config: {
    type: "event" | "project"; // Determines the type of content
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required?: boolean;
      options?: string[]; // For dropdowns like state
    }>;
    getImageUrl?: (item: any) => string; // Function to get the image URL
    imageName?: string; // Label for the image field
  };
  data?: any; // Existing data for editing (optional)
}

const ContentForm: React.FC<ContentFormProps> = ({
  onSave,
  onCancel,
  isLoading,
  config,
  data,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);

  // Populate form with existing data if editing
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // Initialize formData with empty values for all fields
      const initialData: any = {};
      config.fields.forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [data, config.fields]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));

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
    setFormData((prev: typeof formData) => ({ ...prev, content: value }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    } else {
      setImage(null);
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Ensure the form data matches the expected structure
      const submissionData = {
        title: formData.title,
        description: formData.description,
        state: formData.state,
        category: formData.category,
        technologies: formData.technologies
          ?.split(",")
          .map((tech: string) => tech.trim()), // Convert comma-separated string to array
        demoUrl: formData.demoUrl,
        githubUrl: formData.githubUrl,
        content: formData.content,
      };

      await onSave(submissionData, image);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {config.fields.map((field) => (
        <div key={field.name}>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor={field.name}
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            ></textarea>
          ) : field.type === "editor" ? (
            <TipTapEditor
              value={formData[field.name] || ""}
              onChange={handleEditorChange}
              disabled={isLoading}
              placeholder={`Write detailed content about the ${config.type} here...`}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
          )}
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="image">
          {config.imageName || "Image"}
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
        {data?.image && !image && config.getImageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Current image:</p>
            <div className="relative h-32 w-48 rounded overflow-hidden">
              <Image
                src={config.getImageUrl(data.image)}
                alt={`${config.type} image`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
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

export default ContentForm;
