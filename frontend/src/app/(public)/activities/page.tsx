"use client";

import React, { useState, useEffect } from "react";
import { projectService } from "@/lib/data/services/projectService";
import { eventsService } from "@/lib/data/services/eventService";
import { strapiService } from "@/lib/data/services/strapiClient";

// Earthy color palette for consistency
const colors = {
  primary: "rgb(121, 85, 72)", // Brown
  background: "rgb(245, 241, 237)", // Light beige
  surface: "rgb(255, 253, 250)", // Creamy white
  surfaceHover: "rgb(237, 231, 225)", // Light warm gray
  text: {
    primary: "rgb(62, 39, 35)", // Dark brown text
    secondary: "rgb(97, 79, 75)", // Medium brown text
    light: "rgb(145, 131, 127)", // Light brown text
  },
  divider: "rgb(225, 217, 209)", // Soft divider
};

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "events">("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

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
          setFilteredProjects(data);
        } else if (activeTab === "events") {
          const data = await eventsService.getAll({
            sort: ["startDate:desc"],
            populate: ["eventCardImage"],
          });
          setEvents(data);
          setFilteredEvents(data);
        }
        console.log("Fetched data:", activeTab, projects, events);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Filter and search logic
  useEffect(() => {
    if (activeTab === "projects") {
      let filtered = projects;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply additional filters (if any)
      if (filter !== "all") {
        filtered = filtered.filter((project) => project.category === filter);
      }

      setFilteredProjects(filtered);
    } else if (activeTab === "events") {
      let filtered = events;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply additional filters (if any)
      if (filter !== "all") {
        filtered = filtered.filter((event) => event.type === filter);
      }

      setFilteredEvents(filtered);
    }
  }, [searchQuery, filter, projects, events, activeTab]);

  return (
    <div
      className="min-h-screen p-6 sm:p-8 md:p-10"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8 sm:py-6"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Navigation Tabs */}
            <div className="flex">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-2 rounded-l-md text-sm font-medium ${
                  activeTab === "projects"
                    ? "bg-white text-primary"
                    : "bg-transparent text-white"
                }`}
                style={{
                  border: `1px solid ${colors.divider}`,
                  backgroundColor:
                    activeTab === "projects" ? colors.surface : "transparent",
                }}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-r-md text-sm font-medium ${
                  activeTab === "events"
                    ? "bg-white text-primary"
                    : "bg-transparent text-white"
                }`}
                style={{
                  border: `1px solid ${colors.divider}`,
                  backgroundColor:
                    activeTab === "events" ? colors.surface : "transparent",
                }}
              >
                Events
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col text-black sm:flex-row items-center gap-4 mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="flex justify-center my-16">
              <div
                className="animate-spin rounded-full h-12 w-12"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: `${colors.divider}`,
                  borderTopColor: colors.primary,
                }}
              ></div>
            </div>
          ) : error ? (
            <div
              className="text-center p-4 rounded-md"
              style={{
                backgroundColor: "rgba(168, 77, 70, 0.1)",
                color: "rgb(168, 77, 70)",
                border: `1px solid rgb(168, 77, 70)`,
              }}
            >
              {error}
            </div>
          ) : activeTab === "projects" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.divider}`,
                  }}
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {project.title}
                  </h3>
                  <p>{project.Description}</p>
                  {project.projectImage && (
                    <img
                      src={strapiService.media.getMediaUrl(
                        project.projectImage
                      )}
                      alt={strapiService.media.getAltText(project.projectImage)}
                      className="mt-2 w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <p className="mt-2" style={{ color: colors.text.secondary }}>
                    {project.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.divider}`,
                  }}
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {event.title}
                  </h3>
                  {event.eventCardImage?.url && (
                    <img
                      src={strapiService.media.getMediaUrl(
                        event.eventCardImage
                      )}
                      alt={event.title}
                      className="mt-2 w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <p className="mt-2" style={{ color: colors.text.secondary }}>
                    {event.description}
                  </p>
                  <p className="mt-1" style={{ color: colors.text.secondary }}>
                    {event.startDate ? `Start Date: ${event.startDate}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
