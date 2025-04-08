// dashboard/projects/components/ProjectDetail.tsx
import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/strapiFirst/api";
import LayoutRenderer from "./specialisedComps/LayoutRendrer";
import { LayoutType } from "./specialisedComps/LayoutSelector";

interface ProjectDetailProps {
  projectData: {
    id: number;
    attributes: {
      title: string;
      description: string;
      layout?: LayoutType;
      image?: {
        data?: {
          attributes: {
            url: string;
          };
        };
      };
      [key: string]: any;
    };
  };
}

export default function ProjectDetail({ projectData }: ProjectDetailProps) {
  const { attributes } = projectData;

  // Get image URL if it exists
  const imageUrl = attributes.image?.data
    ? getStrapiMediaUrl(attributes.image.data.attributes.url)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-500">Description</h3>
        <p className="mt-2">{attributes.description}</p>
      </div>

      {imageUrl && (
        <div>
          <h3 className="text-lg font-medium text-gray-500">Featured Image</h3>
          <div className="mt-2 relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={attributes.title}
              fill
              className="object-contain rounded-md"
            />
          </div>
        </div>
      )}

      {attributes.layout && (
        <div>
          <h3 className="text-lg font-medium text-gray-500">Layout</h3>
          <div className="mt-2 p-4 border rounded-md">
            <p className="font-medium">
              {attributes.layout === "full-width"
                ? "Full Width"
                : attributes.layout === "two-columns"
                  ? "Two Columns"
                  : attributes.layout === "image-text"
                    ? "Image & Text"
                    : attributes.layout}
            </p>

            <div className="mt-4">
              {/* Show layout-specific content */}
              {attributes.layout === "two-columns" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">
                      {attributes.leftColumnTitle || "Left Column"}
                    </h4>
                    <p className="text-sm">
                      {attributes.leftColumnContent || "No content"}
                    </p>
                  </div>
                  <div className="border p-3 rounded">
                    <h4 className="font-medium">
                      {attributes.rightColumnTitle || "Right Column"}
                    </h4>
                    <p className="text-sm">
                      {attributes.rightColumnContent || "No content"}
                    </p>
                  </div>
                </div>
              )}

              {attributes.layout === "full-width" && (
                <div className="border p-3 rounded">
                  <p className="text-sm">
                    {attributes.content || "No content"}
                  </p>
                </div>
              )}

              {attributes.layout === "image-text" && (
                <div className="border p-3 rounded">
                  <p className="font-medium">
                    Image Position: {attributes.imagePosition || "Left"}
                  </p>
                  <p className="text-sm mt-2">
                    {attributes.textContent || "No content"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-500">Metadata</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p>{new Date(attributes.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Updated</p>
            <p>{new Date(attributes.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
