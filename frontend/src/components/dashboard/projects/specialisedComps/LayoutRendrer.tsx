import React from "react";
import Image from "next/image";
import { LayoutType } from "./LayoutSelector";

interface LayoutRendererProps {
  layout: LayoutType;
  content?: {
    // Common fields
    title?: string;
    description?: string;
    imageUrl?: string;

    // Full-width fields
    content?: string;

    // Two-columns fields
    leftColumnTitle?: string;
    leftColumnContent?: string;
    rightColumnTitle?: string;
    rightColumnContent?: string;

    // Image-text fields
    imagePosition?: "left" | "right";
  };
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout,
  content = {},
}) => {
  // Render full-width layout
  if (layout === "full-width") {
    return (
      <div className="my-8">
        {content.content && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        )}

        {content.imageUrl && (
          <div className="relative h-96 mt-6">
            <Image
              src={content.imageUrl}
              alt={content.title || "Content image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    );
  }

  // Render two-columns layout
  if (layout === "two-columns") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Left column */}
        <div className="space-y-4">
          {content.leftColumnTitle && (
            <h3 className="text-xl font-bold">{content.leftColumnTitle}</h3>
          )}

          {content.leftColumnContent && (
            <div className="prose">
              <div
                dangerouslySetInnerHTML={{ __html: content.leftColumnContent }}
              />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {content.rightColumnTitle && (
            <h3 className="text-xl font-bold">{content.rightColumnTitle}</h3>
          )}

          {content.rightColumnContent && (
            <div className="prose">
              <div
                dangerouslySetInnerHTML={{ __html: content.rightColumnContent }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render image-text layout
  if (layout === "image-text") {
    const imageOnLeft = content.imagePosition !== "right";

    return (
      <div
        className={`flex flex-col ${imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-6 my-8`}
      >
        {/* Image */}
        {content.imageUrl && (
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full">
              <Image
                src={content.imageUrl}
                alt={content.title || "Content image"}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Text content */}
        <div className="md:w-1/2 space-y-4">
          {content.content && (
            <div className="prose">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback for unknown layout
  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg">
      <p className="text-gray-500">Unknown layout type: {layout}</p>
    </div>
  );
};

export default LayoutRenderer;
