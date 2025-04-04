"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ContentPage() {
  // Get params from the URL
  const params = useParams();
  const role = params.role as string;
  const content = params.content as string;

  // Validate content type
  const validContentTypes = ["projects", "events", "blog"];
  const isValidContent = validContentTypes.includes(content);

  // Content-specific info
  const contentInfo = {
    projects: { title: "Prosjekter", itemName: "prosjekt" },
    events: { title: "Eventer", itemName: "event" },
    blog: { title: "Blogg Innlegg", itemName: "innlegg" },
  };

  if (!isValidContent) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Feil</p>
          <p>Den forespurte innholdstypen "{content}" eksisterer ikke.</p>
          <Link
            href={`/dashboard/${role}`}
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            ← Tilbake til Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get the title and item name from the content info
  const title =
    contentInfo[content as keyof typeof contentInfo]?.title || "Innhold";
  const itemName =
    contentInfo[content as keyof typeof contentInfo]?.itemName || "element";

  return (
    <div className="container mx-auto p-8">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Link
          href={`/dashboard/${role}`}
          className="text-blue-500 hover:underline"
        >
          ← Tilbake til Dashboard
        </Link>
      </div>

      {/* Content navigation tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <Link
          href={`/dashboard/${role}/content/projects`}
          className={`px-4 py-2 ${
            content === "projects" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
        >
          Prosjekter
        </Link>
        <Link
          href={`/dashboard/${role}/content/events`}
          className={`px-4 py-2 ${
            content === "events" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
        >
          Eventer
        </Link>
        <Link
          href={`/dashboard/${role}/content/blog`}
          className={`px-4 py-2 ${
            content === "blog" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
        >
          Blogg
        </Link>
      </div>

      {/* Placeholder content */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Administrer {title}</h2>
        <p className="text-gray-600 mb-6">
          Dette er administrasjonspanelet for {title.toLowerCase()}. Her kan du
          legge til, redigere og slette {itemName}.
        </p>

        <div className="flex justify-center p-8 bg-gray-50 border rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Ingen {title.toLowerCase()} funnet.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Legg til {itemName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
