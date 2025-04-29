"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "@/lib/data/services/projectService";
import { eventsService } from "@/lib/data/services/eventService";
import { strapiService } from "@/lib/data/services/strapiClient";

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "events">("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === "projects") {
          const data = await projectService.getAll({
            sort: ["createdAt:desc"],
            populate: ["projectImage"],
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-l-md ${
            activeTab === "projects"
              ? "bg-primary text-white"
              : "bg-surface text-primary"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 rounded-r-md ${
            activeTab === "events"
              ? "bg-primary text-white"
              : "bg-surface text-primary"
          }`}
        >
          Events
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : activeTab === "projects" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-surface rounded-md shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-primary">
                {project.title}
              </h3>
              {project.projectImage && (
                <img
                  src={strapiService.media.getMediaUrl(project.projectImage)}
                  alt={strapiService.media.getAltText(project.projectImage)}
                  className="mt-2 w-full h-48 object-cover rounded-md"
                />
              )}
              <p className="mt-2 text-textSecondary">{project.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-surface rounded-md shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-primary">
                {event.title}
              </h3>
              {event.eventCardImage?.url && (
                <img
                  src={strapiService.media.getMediaUrl(event.eventCardImage)}
                  alt={event.title}
                  className="mt-2 w-full h-48 object-cover rounded-md"
                />
              )}
              <p className="mt-2 text-textSecondary">{event.description}</p>
              <p className="mt-1 text-textSecondary">
                {event.startDate ? `Start Date: ${event.startDate}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
