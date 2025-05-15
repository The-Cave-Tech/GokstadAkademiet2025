"use client";

import React, { useState } from "react";
import HistoryContainer from "@/components/features/aboutus/HistoryContainer";
import TeamContainer from "@/components/features/aboutus/TeamContainer";

type SectionType = "history" | "team";

export default function AboutUsPage() {
  // Sett "history" som standard aktiv seksjon
  const [activeSection, setActiveSection] = useState<SectionType>("history");

  // Funksjon for å vise riktig seksjon
  const renderSection = () => {
    switch (activeSection) {
      case "history":
        return <HistoryContainer />;
      case "team":
        return <TeamContainer />;
      default:
        return <HistoryContainer />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigasjon mellom seksjoner - kun blå understrek, svart tekst */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto py-4 justify-center">
            <button
              onClick={() => setActiveSection("history")}
              className="px-6 py-2 mx-2 font-medium text-black transition duration-200 relative"
            >
              Historie
              {activeSection === "history" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              )}
            </button>
            <button
              onClick={() => setActiveSection("team")}
              className="px-6 py-2 mx-2 font-medium text-black transition duration-200 relative"
            >
              Vårt Team
              {activeSection === "team" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Innholdsseksjoner */}
      {renderSection()}
    </main>
  );
}
