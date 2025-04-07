import { useState, useEffect } from "react";
import Image from "next/image";
import { getContentItem } from "@/lib/strapiSecond/api";
import { ContentAttributes, ContentItem, StrapiImage } from "./ContentGrid";

// Types for dynamic zones
interface ColumnContent {
  title?: string;
  content?: string;
  image?: StrapiImage;
}

interface TwoColumnsComponent {
  __component: "layouts.two-columns";
  leftColumn?: ColumnContent;
  rightColumn?: ColumnContent;
}

interface FullWidthComponent {
  __component: "layouts.full-width";
  title?: string;
  content?: string;
  image?: StrapiImage;
}

interface ImageTextComponent {
  __component: "layouts.image-text";
  image?: StrapiImage;
  text?: string;
  imagePosition?: "left" | "right";
}

// Union type for all possible dynamic zone components
type DynamicZoneComponent =
  | TwoColumnsComponent
  | FullWidthComponent
  | ImageTextComponent;

interface DynamicZoneRendererProps {
  content?: DynamicZoneComponent[];
}

// Component to render dynamic zones
const DynamicZoneRenderer = ({ content }: DynamicZoneRendererProps) => {
  if (!content || content.length === 0) return null;

  return (
    <>
      {content.map((block, index) => {
        const componentType = block.__component;

        // Handle "two columns" layout
        if (componentType === "layouts.two-columns") {
          const typedBlock = block as TwoColumnsComponent;
          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"
            >
              <div className="p-4">
                {typedBlock.leftColumn?.title && (
                  <h3 className="text-xl font-bold mb-4">
                    {typedBlock.leftColumn.title}
                  </h3>
                )}
                {typedBlock.leftColumn?.content && (
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: typedBlock.leftColumn.content,
                    }}
                  />
                )}
                {typedBlock.leftColumn?.image?.data && (
                  <div className="relative h-64 mt-4">
                    <Image
                      src={`http://localhost:1337${typedBlock.leftColumn.image.data.attributes.url}`}
                      alt={typedBlock.leftColumn.title || "Image"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
              <div className="p-4">
                {typedBlock.rightColumn?.title && (
                  <h3 className="text-xl font-bold mb-4">
                    {typedBlock.rightColumn.title}
                  </h3>
                )}
                {typedBlock.rightColumn?.content && (
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: typedBlock.rightColumn.content,
                    }}
                  />
                )}
                {typedBlock.rightColumn?.image?.data && (
                  <div className="relative h-64 mt-4">
                    <Image
                      src={`http://localhost:1337${typedBlock.rightColumn.image.data.attributes.url}`}
                      alt={typedBlock.rightColumn.title || "Image"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Handle "full width" layout
        if (componentType === "layouts.full-width") {
          const typedBlock = block as FullWidthComponent;
          return (
            <div key={index} className="my-8">
              {typedBlock.title && (
                <h2 className="text-2xl font-bold mb-4">{typedBlock.title}</h2>
              )}
              {typedBlock.content && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: typedBlock.content }}
                />
              )}
              {typedBlock.image?.data && (
                <div className="relative h-96 mt-4">
                  <Image
                    src={`http://localhost:1337${typedBlock.image.data.attributes.url}`}
                    alt={typedBlock.title || "Image"}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          );
        }

        // Handle "image-text" layout
        if (componentType === "layouts.image-text") {
          const typedBlock = block as ImageTextComponent;
          const isImageLeft = typedBlock.imagePosition !== "right";

          return (
            <div key={index} className="my-8 flex flex-col md:flex-row gap-6">
              {isImageLeft ? (
                <>
                  {typedBlock.image?.data && (
                    <div className="relative h-64 md:h-auto md:w-1/2">
                      <Image
                        src={`http://localhost:1337${typedBlock.image.data.attributes.url}`}
                        alt="Content image"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  {typedBlock.text && (
                    <div className="md:w-1/2 prose">
                      <div
                        dangerouslySetInnerHTML={{ __html: typedBlock.text }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {typedBlock.text && (
                    <div className="md:w-1/2 prose">
                      <div
                        dangerouslySetInnerHTML={{ __html: typedBlock.text }}
                      />
                    </div>
                  )}
                  {typedBlock.image?.data && (
                    <div className="relative h-64 md:h-auto md:w-1/2">
                      <Image
                        src={`http://localhost:1337${typedBlock.image.data.attributes.url}`}
                        alt="Content image"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        }

        // Default case for unknown components
        return (
          <div key={index} className="my-4 p-4 bg-gray-100 rounded">
            <p className="text-gray-700">
              Unknown component type: {componentType}
            </p>
          </div>
        );
      })}
    </>
  );
};

interface ContentDetailProps {
  contentType: string;
  id: string | number;
}

interface DetailedContent extends ContentItem {
  attributes: ContentAttributes & {
    dynamicZone?: DynamicZoneComponent[];
  };
}

interface DetailResponse {
  data: DetailedContent;
  meta: any;
}

export default function ContentDetail({ contentType, id }: ContentDetailProps) {
  const [item, setItem] = useState<DetailedContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = (await getContentItem(
          contentType,
          id
        )) as DetailResponse;
        setItem(result.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${contentType} with ID ${id}:`, err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [contentType, id]);

  if (loading) return <div>Laster innhold...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!item) return <div>Innhold ikke funnet</div>;

  const { title, description, image, dynamicZone } = item.attributes;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {image?.data && (
        <div className="relative h-96 mb-6">
          <Image
            src={`http://localhost:1337${image.data.attributes.url}`}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      <div className="prose mb-8">{description}</div>

      {/* Render dynamic content */}
      <DynamicZoneRenderer content={dynamicZone} />
    </div>
  );
}
