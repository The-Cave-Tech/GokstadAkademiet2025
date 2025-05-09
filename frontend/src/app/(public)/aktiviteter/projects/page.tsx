"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActivitiesLayout } from "@/components/layouts/ActivitiesLayout";
import { ProjectCard } from "@/components/dashboard/contentManager/ProjectCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useActivities } from "@/lib/context/ActivityContext";

export default function ProjectsPage() {
  const router = useRouter();
  const { state, dispatch } = useActivities();

  // Set active tab to projects when this page loads
  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: "projects" });
  }, [dispatch]);

  // Render content based on loading/error state
  const renderContent = () => {
    if (state.isLoading) {
      return <LoadingSpinner />;
    }

    if (state.error) {
      return <ErrorMessage message={state.error} />;
    }

    if (state.filteredProjects.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">
            Ingen prosjekter funnet
          </h3>
          <p className="mt-2 text-gray-500">Prøv å justere søk eller filter</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  };

  // Handle tab change
  const handleTabChange = (tab: "projects" | "events") => {
    if (tab === "events") {
      router.push("/aktiviteter/events");
    }
  };

  return (
    <ActivitiesLayout
      activeTab="projects"
      onTabAction={handleTabChange}
      searchQuery={state.searchQuery}
      onSearchAction={(query) =>
        dispatch({ type: "SET_SEARCH_QUERY", payload: query })
      }
      filter={state.filter}
      onFilterAction={(filter) =>
        dispatch({ type: "SET_FILTER", payload: filter })
      }
    >
      {renderContent()}
    </ActivitiesLayout>
  );
}
