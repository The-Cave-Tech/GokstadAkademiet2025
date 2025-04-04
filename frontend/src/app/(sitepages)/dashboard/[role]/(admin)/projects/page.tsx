"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectsPage() {
  const params = useParams();
  const role = params.role as string;

  return (
    <div className="container mx-auto p-8">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prosjekter</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← Tilbake til Dashboard
        </Link>
      </div>

      {/* Projects content */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Administrer Prosjekter</h2>
        <p className="text-gray-600 mb-6">
          Dette er administrasjonspanelet for prosjekter. Her kan du legge til,
          redigere og slette prosjekter.
        </p>

        <div className="flex justify-center p-8 bg-gray-50 border rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Ingen prosjekter funnet.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Legg til prosjekt
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Endre på prosjekt
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Slett prosjekt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
