import React from "react";

export type LayoutType = "full-width" | "two-columns" | "image-text";

interface LayoutOption {
  type: LayoutType;
  label: string;
  description: string;
}

interface LayoutSelectorProps {
  selectedLayout: LayoutType | null;
  onChange: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onChange,
}) => {
  // Available layout options
  const layouts: LayoutOption[] = [
    {
      type: "full-width",
      label: "Full Width",
      description: "Content spans the entire width",
    },
    {
      type: "two-columns",
      label: "Two Columns",
      description: "Content split into two equal columns",
    },
    {
      type: "image-text",
      label: "Image & Text",
      description: "Image on one side, text on the other",
    },
  ];

  return (
    <div>
      <h3 className="font-medium mb-2">Select Layout</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <div
            key={layout.type}
            className={`border rounded p-4 cursor-pointer ${
              selectedLayout === layout.type
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => onChange(layout.type)}
          >
            <h4 className="font-medium">{layout.label}</h4>
            <p className="text-sm text-gray-500">{layout.description}</p>

            {/* Preview of layout */}
            <div className="mt-2 bg-gray-100 p-2 rounded">
              {layout.type === "full-width" && (
                <div className="bg-gray-300 h-6 w-full rounded"></div>
              )}

              {layout.type === "two-columns" && (
                <div className="flex gap-2">
                  <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                  <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                </div>
              )}

              {layout.type === "image-text" && (
                <div className="flex gap-2">
                  <div className="bg-gray-400 h-6 w-1/3 rounded"></div>
                  <div className="bg-gray-300 h-6 w-2/3 rounded"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
