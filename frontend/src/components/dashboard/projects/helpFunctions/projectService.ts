import strapiClient from "@/lib/strapiFirst/strapi";
import { LayoutType } from "../specialisedComps/LayoutSelector";
import { DynamicComponentType } from "../specialisedComps/ComponenSelector";

// Define the project data interface
export interface ProjectData {
  Title: string;
  Description: string;
  Slug: number;
  layout?: LayoutType;
  dynamicZone?: Array<{
    __component: string;
    content: string;
  }>;
}

/**
 * Create a new project
 * @param data Project data
 * @param image Optional image file
 * @returns Response data from API
 */
export const createProject = async (
  data: ProjectData,
  image: File | null
): Promise<any> => {
  // Create FormData for file upload
  const formData = new FormData();

  // Add project data to formData
  formData.append("data", JSON.stringify(data));

  // Add image file if selected
  if (image) {
    formData.append("files.Image", image);
  }

  // Send the request to Strapi
  const response = await strapiClient.post("/api/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Prepare dynamic zone components for Strapi
 * @param components List of component types
 * @returns Array of formatted component objects
 */
export const prepareDynamicComponents = (
  components: DynamicComponentType[]
): Array<{ __component: string; content: string }> => {
  return components.map((type) => ({
    __component: `layout.${type}`,
    content: "",
  }));
};
