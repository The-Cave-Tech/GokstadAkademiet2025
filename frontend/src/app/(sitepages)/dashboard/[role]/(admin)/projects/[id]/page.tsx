// dashboard/projects/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectDetail from "@/components/dashboard/projects/ProjectDetail";
import { getStrapiMediaUrl } from "@/lib/strapiFirst/api";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;

  // Fetch project data directly
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects/${id}?populate=*`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    // Handle 404 or other errors
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch project");
  }

  const projectData = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard/projects"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {projectData.data.attributes.title}
        </h1>

        <div className="flex space-x-2">
          <Link
            href={`/dashboard/projects/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit
          </Link>
          <Link
            href={`/dashboard/projects/delete/${id}`}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProjectDetail projectData={projectData.data} />
      </div>
    </div>
  );
}
