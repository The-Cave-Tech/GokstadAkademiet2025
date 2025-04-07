import React, { useState } from "react";
import {
  createProject,
  prepareDynamicComponents,
} from "./helpFunctions/projectService";
import TabNavigation, { TabType } from "./helpFunctions/TabNav";
import BasicInfoTab from "./helpFunctions/BasicInfoTab";
import DetailsTab from "./DetailsTab";
import FormActions from "./helpFunctions/FormActions";
import { LayoutType } from "./specialisedComps/LayoutSelector";
import { DynamicComponentType } from "./specialisedComps/ComponenSelector";

interface CreateProjectFormProps {
  onProjectCreated: () => void; // Callback to refresh the projects list
  onClose: () => void; // Callback to close the modal
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onProjectCreated,
  onClose,
}) => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType | null>(null);
  const [dynamicComponents, setDynamicComponents] = useState<
    DynamicComponentType[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Add a dynamic component
  const handleAddComponent = (type: DynamicComponentType) => {
    setDynamicComponents([...dynamicComponents, type]);
  };

  // Remove a dynamic component
  const handleRemoveComponent = (index: number) => {
    const updatedComponents = [...dynamicComponents];
    updatedComponents.splice(index, 1);
    setDynamicComponents(updatedComponents);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !slug) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare project data
      const projectData = {
        Title: title,
        Description: description,
        Slug: Number(slug),
        // Add dynamic zone data
        dynamicZone: prepareDynamicComponents(dynamicComponents),
        // Add selected layout if any
        layout: selectedLayout || undefined,
      };

      // Send the request to Strapi
      await createProject(projectData, image);

      // Notify parent component to refresh the projects list
      onProjectCreated();

      // Close the modal
      onClose();
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError(
        err.response?.data?.error?.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Tab navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <BasicInfoTab
          title={title}
          description={description}
          imagePreview={imagePreview}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <DetailsTab
          slug={slug}
          onSlugChange={setSlug}
          selectedLayout={selectedLayout}
          onSelectLayout={setSelectedLayout}
          dynamicComponents={dynamicComponents}
          onAddComponent={handleAddComponent}
          onRemoveComponent={handleRemoveComponent}
        />
      )}

      {/* Form actions */}
      <FormActions loading={loading} onCancel={onClose} />
    </form>
  );
};

export default CreateProjectForm;
