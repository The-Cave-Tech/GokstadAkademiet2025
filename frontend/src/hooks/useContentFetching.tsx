import { useState, useEffect } from "react";
import { projectService } from "@/lib/data/services/projectService";
import { eventsService } from "@/lib/data/services/eventService";
import { Project, Event } from "@/types/activity.types";

export const useDataFetching = (activeTab: "projects" | "events") => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === "projects") {
          const data = await projectService.getAll({
            sort: ["createdAt:desc"],
            populate: ["projectImage", "technologies"],
          });
          setProjects(data);
        } else if (activeTab === "events") {
          const data = await eventsService.getAll({
            sort: ["startDate:desc"],
            populate: ["eventCardImage"],
          });
          setEvents(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return {
    data: { projects, events },
    isLoading,
    error,
  };
};
