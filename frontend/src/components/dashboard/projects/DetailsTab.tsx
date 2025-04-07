import React from "react";
import LayoutSelector, { LayoutType } from "./specialisedComps/LayoutSelector";
import DynamicComponentSelector, {
  DynamicComponentType,
} from "./specialisedComps/ComponenSelector";

interface DetailsTabProps {
  slug: number;
  onSlugChange: (value: number) => void;
  selectedLayout: LayoutType | null;
  onSelectLayout: (layout: LayoutType) => void;
  dynamicComponents: DynamicComponentType[];
  onAddComponent: (type: DynamicComponentType) => void;
  onRemoveComponent: (index: number) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  slug,
  onSlugChange,
  selectedLayout,
  onSelectLayout,
  dynamicComponents,
  onAddComponent,
  onRemoveComponent,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md mb-4">
      <div className="mb-6">
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug (number) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This should be a unique number to identify the project.
        </p>
      </div>

      {/* Layout Selection */}
      <LayoutSelector
        selectedLayout={selectedLayout}
        onSelectLayout={onSelectLayout}
      />

      {/* Dynamic Components */}
      <DynamicComponentSelector
        components={dynamicComponents}
        onAddComponent={onAddComponent}
        onRemoveComponent={onRemoveComponent}
      />
    </div>
  );
};

export default DetailsTab;
