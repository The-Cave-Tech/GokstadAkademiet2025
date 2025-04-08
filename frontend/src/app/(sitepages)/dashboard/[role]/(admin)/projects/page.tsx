// dashboard/projects/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/strapiFirst/api";

// Define the project data structure
interface ProjectImage {
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

interface ProjectAttributes {
  title: string;
  description: string;
  image?: ProjectImage;
  layout?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  [key: string]: any;
}

interface Project {
  id: number;
  attributes: ProjectAttributes;
}

interface ProjectsResponse {
  data: Project[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// This is now a Server Component by default
export default async function ProjectsPage() {
  // Fetch data server-side
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate=*`,
    {
      cache: "no-store", // Don't cache this request
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const { data: projects } = (await res.json()) as ProjectsResponse;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Link
          href={`/dashboard/admin/projects/create`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No projects found</p>
          <p className="text-sm text-gray-400 mt-2">
            Create your first project by clicking the button above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/admin/projects/${project.id}`}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {project.attributes.image?.data && (
                <div className="relative h-48">
                  <Image
                    src={getStrapiMediaUrl(
                      project.attributes.image.data.attributes.url
                    )}
                    alt={project.attributes.title || "Project image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  {project.attributes.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {project.attributes.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
