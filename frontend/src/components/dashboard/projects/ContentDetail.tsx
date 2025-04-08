import React, { useState, useEffect } from "react";
import Image from "next/image";
import LayoutRenderer from "./specialisedComps/LayoutRendrer";
import { getContentItem, getStrapiMediaUrl } from "@/lib/strapiFirst/api";
import { LayoutType } from "./specialisedComps/LayoutSelector";

interface ContentDetailProps {
  contentType: string;
  id: string | number;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ contentType, id }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content item data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await getContentItem(contentType, id);
        setContent(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${contentType} item:`, err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentType, id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Content not found
  if (!content || !content.data) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
        <h2 className="font-bold text-lg mb-2">Not Found</h2>
        <p>The requested content could not be found.</p>
      </div>
    );
  }

  // Extract content data
  const item = content.data;
  const attributes = item.attributes || {};
  const layout = attributes.layout as LayoutType;

  // Prepare image URL if present
  const imageUrl = attributes.image?.data
    ? getStrapiMediaUrl(attributes.image.data.attributes.url)
    : undefined;

  // Prepare layout content based on layout type
  const layoutContent = {
    title: attributes.title,
    description: attributes.description,
    imageUrl,
    content: attributes.content,
    leftColumnTitle: attributes.leftColumnTitle,
    leftColumnContent: attributes.leftColumnContent,
    rightColumnTitle: attributes.rightColumnTitle,
    rightColumnContent: attributes.rightColumnContent,
    imagePosition: attributes.imagePosition,
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Content header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{attributes.title}</h1>

        {attributes.description && (
          <div className="text-lg text-gray-700 mb-6">
            {attributes.description}
          </div>
        )}

        {/* Only show main image if not using image-text layout or if image is on right */}
        {imageUrl &&
          !(layout === "image-text" && attributes.imagePosition === "left") && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={imageUrl}
                alt={attributes.title || "Content image"}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
      </div>

      {/* Render content based on selected layout */}
      {layout ? (
        <LayoutRenderer layout={layout} content={layoutContent} />
      ) : (
        <div className="prose max-w-none">
          <p>No layout specified for this content.</p>
        </div>
      )}

      {/* Content footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm">
        <p>
          Last updated: {new Date(attributes.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ContentDetail;
