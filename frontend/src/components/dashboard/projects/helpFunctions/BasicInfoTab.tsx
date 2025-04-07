import React from "react";
import ImageUploader from "../specialisedComps/ImageUploader";

interface BasicInfoTabProps {
  title: string;
  description: string;
  imagePreview: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  title,
  description,
  imagePreview,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onRemoveImage,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Image upload */}
        <div>
          <ImageUploader
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            onRemoveImage={onRemoveImage}
          />
        </div>

        {/* Right column - Form fields */}
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Tittel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Beskrivelse <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-1">
              <label htmlFor="author" className="block text-sm font-medium">
                Author
              </label>
              <div className="ml-2 flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Hentes fra systemet
              </div>
            </div>
            <input
              type="text"
              id="author"
              disabled
              value="System User"
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Dato
            </label>
            <input
              type="text"
              id="date"
              disabled
              value={new Date().toLocaleDateString()}
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
