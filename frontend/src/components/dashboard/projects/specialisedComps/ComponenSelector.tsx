import React, { useState } from "react";

// Type for component types - renamed to avoid collision with React.ComponentType
export type DynamicComponentType = "two-columns" | "full-width" | "image-text";

interface ComponentSelectorProps {
  components: DynamicComponentType[];
  onAddComponent: (type: DynamicComponentType) => void;
  onRemoveComponent: (index: number) => void;
}

const DynamicComponentSelector: React.FC<ComponentSelectorProps> = ({
  components,
  onAddComponent,
  onRemoveComponent,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleAddComponent = (type: DynamicComponentType) => {
    onAddComponent(type);
    setShowOptions(false);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-3">Dynamic Content</h3>

      {/* Add component button */}
      <button
        type="button"
        onClick={toggleOptions}
        className="flex items-center justify-center w-full py-2 px-3 border border-dashed border-gray-400 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
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
        Add a component
      </button>

      {/* Component options */}
      {showOptions && (
        <div className="mt-3 p-3 border border-gray-300 rounded-md bg-white">
          <h4 className="font-medium mb-2">Select a component</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleAddComponent("two-columns")}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
            >
              Two columns
            </button>
            <button
              type="button"
              onClick={() => handleAddComponent("full-width")}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
            >
              Full Width
            </button>
            <button
              type="button"
              onClick={() => handleAddComponent("image-text")}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
            >
              Image + Text
            </button>
          </div>
        </div>
      )}

      {/* Added components */}
      {components.length > 0 && (
        <div className="mt-3 space-y-3">
          {components.map((type, index) => (
            <ComponentPreview
              key={index}
              type={type}
              onRemove={() => onRemoveComponent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component preview subcomponent
interface ComponentPreviewProps {
  type: DynamicComponentType;
  onRemove: () => void;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  type,
  onRemove,
}) => {
  return (
    <div className="border border-gray-300 rounded-md p-3 bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{type}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {type === "two-columns" && (
        <div className="flex gap-3">
          <div className="w-1/2 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
            Column 1
          </div>
          <div className="w-1/2 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
            Column 2
          </div>
        </div>
      )}

      {type === "full-width" && (
        <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
          Full width content
        </div>
      )}

      {type === "image-text" && (
        <div className="flex gap-3">
          <div className="w-1/3 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
            Image
          </div>
          <div className="w-2/3 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
            Text content
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicComponentSelector;
