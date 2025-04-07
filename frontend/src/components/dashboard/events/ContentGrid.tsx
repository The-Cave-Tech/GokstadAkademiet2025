import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getContentItems } from "@/lib/strapiSecond/api";

// Types for Strapi content
export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText?: string;
    };
  } | null;
}

export interface ContentAttributes {
  title: string;
  description: string;
  image: StrapiImage;
  [key: string]: any; // For other dynamic attributes
}

export interface ContentItem {
  id: number;
  attributes: ContentAttributes;
}

export interface ContentResponse {
  data: ContentItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ContentGridProps {
  contentType: string;
}

export default function ContentGrid({ contentType }: ContentGridProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getContentItems(contentType);
        setItems(result.data || []);
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [contentType]);

  if (loading) return <div>Laster innhold...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link href={`/${contentType}/${item.id}`} key={item.id}>
          <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {item.attributes.image?.data && (
              <div className="relative h-48">
                <Image
                  src={`http://localhost:1337${item.attributes.image.data.attributes.url}`}
                  alt={item.attributes.title || "Content image"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">
                {item.attributes.title}
              </h3>
              <p className="text-gray-700">{item.attributes.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
