"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActivitiesLayout } from "@/components/layouts/ActivitiesLayout";
import { EventCard } from "@/components/dashboard/contentManager/EventCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useActivities } from "@/lib/context/ActivityContext";

export default function EventsPage() {
  const router = useRouter();
  const { state, dispatch } = useActivities();

  // Set active tab to events when this page loads
  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: "events" });
  }, [dispatch]);

  // Render content based on loading/error state
  const renderContent = () => {
    if (state.isLoading) {
      return <LoadingSpinner />;
    }

    if (state.error) {
      return <ErrorMessage message={state.error} />;
    }

    if (state.filteredEvents.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">
            Ingen arrangementer funnet
          </h3>
          <p className="mt-2 text-gray-500">Prøv å justere søk eller filter</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  // Handle tab change
  const handleTabChange = (tab: "projects" | "events") => {
    if (tab === "projects") {
      router.push("/aktiviteter/projects");
    }
  };

  return (
    <ActivitiesLayout
      activeTab="events"
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
