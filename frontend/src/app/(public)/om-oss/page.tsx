"use client";

import React, { useState } from "react";
import HistoryContainer from "@/components/aboutus/HistoryContainer";
import TeamSection from "@/components/aboutus/TeamSection";

type SectionType = "history" | "team";

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("history");

  // Funksjon for å vise riktig seksjon
  const renderSection = () => {
    switch (activeSection) {
      case "history":
        // Bruk HistoryContainer-komponenten som henter data og sender til HistorySection
        return <HistoryContainer />;
      case "team":
        return <TeamSection />;
      default:
        return <HistoryContainer />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header for Om oss-siden */}
      <div className="bg-indigo-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Om Oss</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Bli bedre kjent med selskapet vårt, vår historie, og menneskene som
            gjør det mulig.
          </p>
        </div>
      </div>

      {/* Navigasjon mellom seksjoner */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto py-4 justify-center">
            <button
              onClick={() => setActiveSection("history")}
              className={`px-6 py-2 mx-2 font-medium rounded-md transition duration-200 ${
                activeSection === "history"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Historie
            </button>
            <button
              onClick={() => setActiveSection("team")}
              className={`px-6 py-2 mx-2 font-medium rounded-md transition duration-200 ${
                activeSection === "team"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Vårt Team
            </button>
          </nav>
        </div>
      </div>

      {/* Innholdsseksjoner */}
      {renderSection()}
    </main>
  );
}
