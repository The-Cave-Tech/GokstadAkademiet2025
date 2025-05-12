"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TipTapEditor from "@/components/ui/TipTapEditor";
import { ContentFormProps } from "@/types/content.types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ContentForm: React.FC<ContentFormProps> = ({ onSave, onCancel, isLoading, config, data, event }) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Populate form with existing data if editing
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else if (event) {
      setFormData(event);
    } else {
      // Initialize formData with empty values for all fields
      const initialData: any = {};
      config.fields.forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [data, event, config.fields]);

  // Mark field as touched when user interacts with it
  const markAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    markAsTouched(name);

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle blur event for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    markAsTouched(name);

    // Validate the field
    const field = config.fields.find((f) => f.name === name);
    if (field?.required && !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${field.label} is required` }));
    }
  };

  // Handle rich text editor changes
  const handleEditorChange = (value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, content: value }));
    markAsTouched("content");

    // Clear error if content was previously empty
    if (errors["content"]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["content"];
        return newErrors;
      });
    }
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
      if (field.required && !formData[field.name]?.toString().trim()) {
        newErrors[field.name] = `${field.label} is required`;
        // Mark all fields as touched when validating the whole form
        markAsTouched(field.name);
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - fully dynamic based on config.type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    try {
      // Build a dynamic submission object based on field definitions
      const submissionData: Record<string, any> = {};

      // Add all form fields to the submission data
      config.fields.forEach((field) => {
        if (field.name === "technologies" || field.name === "tags") {
          // Handle comma-separated strings for arrays
          if (typeof formData[field.name] === "string") {
            submissionData[field.name] = formData[field.name]
              ?.split(",")
              .map((item: string) => item.trim())
              .filter(Boolean);
          } else {
            submissionData[field.name] = formData[field.name];
          }
        } else {
          // Handle all other field types normally
          submissionData[field.name] = formData[field.name];
        }
      });

      // Type-specific handling if needed
      if (config.type === "event") {
        // Event-specific handling (e.g., formatting dates, times)
        if (submissionData.time) {
          const timeRegex = /^\d{2}:\d{2}:\d{2}\.\d{3}$/; // Matches HH:mm:ss.SSS
          if (!timeRegex.test(submissionData.time)) {
            const [hours, minutes] = submissionData.time.split(":");
            submissionData.time = `${hours}:${minutes}:00.000`; // Format to HH:mm:ss.SSS
          }
        }
      }

      // Pass the dynamically built submission data to the save handler
      await onSave(submissionData, image);
    } catch (err) {
      console.error(`Error submitting ${config.type} form:`, err);
    }
  };

  // Determine the image field name based on content type
  const getImageFieldName = () => {
    switch (config.type) {
      case "blog":
        return "blogImage";
      case "event":
        return "eventCardImage";
      case "project":
        return "projectImage";
      default:
        return "image";
    }
  };

  // Get the current image if it exists
  const getCurrentImage = () => {
    if (!data && !event) return null;

    const sourceData = data || event;
    const imageField = getImageFieldName();
    return sourceData[imageField];
  };

  // Generate unique IDs for form fields
  const getFieldId = (fieldName: string) => {
    return `${config.type}-${fieldName}-field`;
  };

  // Generate field error ID
  const getErrorId = (fieldName: string) => {
    return `${config.type}-${fieldName}-error`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label={`${config.type} form`}>
      <div role="alert" aria-live="assertive">
        {Object.keys(errors).length > 0 && touchedFields[Object.keys(errors)[0]] && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Please correct the following errors:</p>
            <ul className="mt-2 ml-5 list-disc">
              {Object.entries(errors).map(([field, message]) => touchedFields[field] && <li key={field}>{message}</li>)}
            </ul>
          </div>
        )}
      </div>

      {config.fields.map((field) => (
        <div key={field.name}>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor={getFieldId(field.name)}
            id={`${getFieldId(field.name)}-label`}
          >
            {field.label}{" "}
            {field.required && (
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            )}
            {field.required && <span className="sr-only">(required)</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={getFieldId(field.name)}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] && touchedFields[field.name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isLoading}
              required={field.required}
              aria-invalid={!!errors[field.name] && touchedFields[field.name]}
              aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              aria-labelledby={`${getFieldId(field.name)}-label`}
            ></textarea>
          ) : field.type === "editor" ? (
            <div>
              <TipTapEditor
                value={formData[field.name] || ""}
                onChange={handleEditorChange}
                disabled={isLoading}
                placeholder={`Write detailed content about the ${config.type} here...`}
                aria-labelledby={`${getFieldId(field.name)}-label`}
                aria-invalid={!!errors[field.name] && touchedFields[field.name]}
                aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              />
              {/* Additional hidden input for form validation */}
              <input type="hidden" name={field.name} value={formData[field.name] || ""} aria-hidden="true" />
            </div>
          ) : field.type === "select" ? (
            <select
              id={getFieldId(field.name)}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] && touchedFields[field.name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isLoading}
              required={field.required}
              aria-invalid={!!errors[field.name] && touchedFields[field.name]}
              aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              aria-labelledby={`${getFieldId(field.name)}-label`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "date" ? (
            <input
              type="date"
              id={getFieldId(field.name)}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] && touchedFields[field.name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isLoading}
              required={field.required}
              aria-invalid={!!errors[field.name] && touchedFields[field.name]}
              aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              aria-labelledby={`${getFieldId(field.name)}-label`}
            />
          ) : field.type === "time" ? (
            <input
              type="time"
              id={getFieldId(field.name)}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] && touchedFields[field.name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isLoading}
              required={field.required}
              aria-invalid={!!errors[field.name] && touchedFields[field.name]}
              aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              aria-labelledby={`${getFieldId(field.name)}-label`}
            />
          ) : (
            <input
              type={field.type}
              id={getFieldId(field.name)}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 ${
                errors[field.name] && touchedFields[field.name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isLoading}
              required={field.required}
              aria-invalid={!!errors[field.name] && touchedFields[field.name]}
              aria-describedby={errors[field.name] && touchedFields[field.name] ? getErrorId(field.name) : undefined}
              aria-labelledby={`${getFieldId(field.name)}-label`}
            />
          )}
          {errors[field.name] && touchedFields[field.name] && (
            <p className="mt-1 text-sm text-red-700" id={getErrorId(field.name)} role="alert">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="image-upload">
          {config.imageName || "Image"}
        </label>
        <input
          type="file"
          id="image-upload"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
          aria-describedby="image-description"
        />
        <p id="image-description" className="mt-1 text-sm text-gray-500">
          Upload an image in JPG, PNG, or WebP format. Maximum size 5MB.
        </p>
        {getCurrentImage() && !image && config.getImageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Current image:</p>
            <div className="relative h-32 w-48 rounded overflow-hidden">
              <Image
                src={config.getImageUrl(getCurrentImage())}
                alt={`Current ${config.type} image`}
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
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <LoadingSpinner size="small" />
              <span className="sr-only">Please wait while the form is being submitted</span>
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
