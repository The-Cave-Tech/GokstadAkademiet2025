import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { strapiService } from "@/lib/data/services/strapiClient";

// Add this component for the Blocks content
const ProjectContent = ({ content }: { content: any }) => {
  // If content is a string (old format), render it directly using dangerouslySetInnerHTML
  if (typeof content === "string") {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // If content is in Blocks format (array), use BlocksRenderer
  if (Array.isArray(content)) {
    return (
      <BlocksRenderer
        content={content}
        blocks={{
          // Custom renderer for images to work with Next.js Image component
          image: ({ image }) => {
            if (!image) return null;

            // Use the shared logic from strapiService to get the correct image URL
            const imageUrl = strapiService.media.getMediaUrl(image);

            return (
              <div className="my-4">
                <Image
                  src={imageUrl}
                  alt={image.alternativeText || "Project image"}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="rounded-lg"
                />
              </div>
            );
          },
          // You can add custom renderers for other block types here
          paragraph: ({ children }) => (
            <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
          ),
          heading: ({ children, level }) => {
            switch (level) {
              case 1:
                return (
                  <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                );
              case 2:
                return (
                  <h2 className="text-2xl font-semibold mt-6 mb-3">
                    {children}
                  </h2>
                );
              case 3:
                return (
                  <h3 className="text-xl font-medium mt-5 mb-2">{children}</h3>
                );
              case 4:
                return (
                  <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
                );
              default:
                return (
                  <h5 className="text-base font-medium mt-3 mb-2">
                    {children}
                  </h5>
                );
            }
          },
          quote: ({ children }) => (
            <blockquote className="pl-4 border-l-4 border-gray-200 italic my-4">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code>{children}</code>
            </pre>
          ),
          list: ({ children, format }) => {
            return format === "ordered" ? (
              <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
            ) : (
              <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
            );
          },
        }}
        modifiers={{
          bold: ({ children }) => <strong>{children}</strong>,
          italic: ({ children }) => <em>{children}</em>,
          underline: ({ children }) => <u>{children}</u>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-gray-100 rounded">{children}</code>
          ),
        }}
      />
    );
  }

  // Fallback if content format is unknown
  return <p>No content available</p>;
};

export default ProjectContent;
