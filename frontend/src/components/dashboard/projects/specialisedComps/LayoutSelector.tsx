import React from "react";

export type LayoutType = "full" | "split" | "main-sidebar" | "featured";

interface LayoutSelectorProps {
  selectedLayout: LayoutType | null;
  onSelectLayout: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onSelectLayout,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Template layout</h3>

      {/* Grid of layout options */}
      <div className="grid grid-cols-2 gap-4">
        {/* Single Column */}
        <div
          className={`border rounded-md p-2 cursor-pointer ${
            selectedLayout === "full"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => onSelectLayout("full")}
        >
          <div className="bg-black w-full h-16 mb-2 rounded"></div>
          <p className="text-xs text-center">Full</p>
        </div>

        {/* Two Column */}
        <div
          className={`border rounded-md p-2 cursor-pointer ${
            selectedLayout === "split"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => onSelectLayout("split")}
        >
          <div className="flex gap-2 mb-2">
            <div className="bg-black w-1/2 h-10 rounded"></div>
            <div className="bg-black w-1/2 h-10 rounded"></div>
          </div>
          <p className="text-xs text-center">50/50</p>
        </div>

        {/* Main + Sidebar */}
        <div
          className={`border rounded-md p-2 cursor-pointer ${
            selectedLayout === "main-sidebar"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => onSelectLayout("main-sidebar")}
        >
          <div className="flex gap-2 mb-2">
            <div className="bg-black w-2/3 h-10 rounded"></div>
            <div className="bg-black w-1/3 h-10 rounded"></div>
          </div>
          <p className="text-xs text-center">Main + sidebar</p>
        </div>

        {/* Featured Row */}
        <div
          className={`border rounded-md p-2 cursor-pointer ${
            selectedLayout === "featured"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => onSelectLayout("featured")}
        >
          <div className="mb-2">
            <div className="bg-black w-full h-8 mb-2 rounded"></div>
            <div className="flex gap-2">
              <div className="bg-black w-1/2 h-6 rounded"></div>
              <div className="bg-black w-1/2 h-6 rounded"></div>
            </div>
          </div>
          <p className="text-xs text-center">Featured card</p>
        </div>
      </div>
    </div>
  );
};

export default LayoutSelector;
