import { describe, test, expect } from "vitest";
import { adaptProjectToCardProps } from "@/lib/adapters/cardAdapter";

describe("adaptProjectToCardProps", () => {
  test("adapts project data to card props", () => {
    const project = {
      id: 1,
      title: "Test Project",
      description: "A test project",
      projectImage: { url: "image.jpg" },
      category: "Tech",
      state: "in-progress",
      technologies: ["React", "Node.js"],
    };

    const cardProps = adaptProjectToCardProps(project);
    expect(cardProps.title).toBe("Test Project");
    expect(cardProps.image?.src).toBe("image.jpg");
    expect(cardProps.badges.length).toBe(2);
  });
});
