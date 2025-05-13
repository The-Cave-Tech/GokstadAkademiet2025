import { describe, test, expect } from "vitest";
import { adaptProjectToCardProps } from "@/lib/adapters/cardAdapter";

describe("adaptProjectToCardProps", () => {
  const baseProject = {
    id: 1,
    title: "Test Project",
    description: "A test project",
    projectImage: { id: 101, url: "image.jpg" },
    category: "Tech",
    state: "in-progress",
    technologies: ["React", "Node.js"],
  };

  test("adapts project data to card props with all fields", () => {
    const cardProps = adaptProjectToCardProps(baseProject);

    expect(cardProps.title).toBe("Test Project");
    expect(cardProps.description).toBe("A test project");
    expect(cardProps.image?.src).toBe("image.jpg");
    expect(cardProps.badges?.length).toBe(2); // Category and state badges
    expect(cardProps.tags?.length).toBe(2); // Technologies
    expect(cardProps.variant).toBe("vertical");
    expect(cardProps.size).toBe("medium");
  });

  test("handles missing project image gracefully", () => {
    const projectWithoutImage = { ...baseProject, projectImage: null };
    const cardProps = adaptProjectToCardProps(projectWithoutImage);

    expect(cardProps.image).toBeUndefined();
  });

  test("handles missing category gracefully", () => {
    const projectWithoutCategory = { ...baseProject, category: null };
    const cardProps = adaptProjectToCardProps(projectWithoutCategory);

    expect(cardProps.badges?.length).toBe(1); // Only state badge
    expect(cardProps.badges?.[0].text).toBe("Pågående"); // State badge text
  });

  test("handles missing technologies gracefully", () => {
    const projectWithoutTechnologies = { ...baseProject, technologies: null };
    const cardProps = adaptProjectToCardProps(projectWithoutTechnologies);

    expect(cardProps.tags?.length).toBe(0); // No tags
  });

  test("handles custom onClick handler", () => {
    const mockOnClick = vi.fn();
    const cardProps = adaptProjectToCardProps(baseProject, mockOnClick);

    expect(cardProps.onClick).toBeDefined();
    cardProps.onClick?.(); // Simulate click
    expect(mockOnClick).toHaveBeenCalledWith(1); // Ensure correct ID is passed
  });

  test("handles unknown state gracefully", () => {
    const projectWithUnknownState = { ...baseProject, state: "unknown" };
    const cardProps = adaptProjectToCardProps(projectWithUnknownState);

    expect(cardProps.badges?.[1].text).toBe("unknown"); // Default to state text
    expect(cardProps.badges?.[1].customBgColor).toBe("#6366f1"); // Default color
  });
});
