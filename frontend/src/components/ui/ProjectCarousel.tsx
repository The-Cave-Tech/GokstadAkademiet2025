// components/ProjectCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ProjectAttributes } from "@/types/content.types";
import { UniversalCard } from "../pageSpecificComponents/dashboard/contentManager/ContentCard";
import { UniversalCardProps } from "@/types/universal.content.types";

interface ProjectWithCardProps extends ProjectAttributes {
  cardProps: UniversalCardProps;
}

interface ProjectCarouselProps {
  projects: ProjectWithCardProps[];
}

export const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;
  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const [itemsToShow, setItemsToShow] = useState(itemsPerPage.desktop);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(itemsPerPage.mobile);
      } else if (width < 1024) {
        setItemsToShow(itemsPerPage.tablet);
      } else {
        setItemsToShow(itemsPerPage.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxIndex = Math.max(0, Math.ceil(projects.length / itemsToShow) - 1);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const translateValue = -currentIndex * 100;

  if (projects.length === 0) {
    return <p className="text-center text-gray-500">Ingen prosjekter funnet</p>;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${translateValue}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: Math.ceil(projects.length / itemsToShow) }).map(
          (_, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="w-full flex-shrink-0 flex flex-wrap gap-6"
            >
              {projects
                .slice(pageIndex * itemsToShow, (pageIndex + 1) * itemsToShow)
                .map((project) => (
                  <div
                    key={project.id}
                    className={`w-full ${
                      itemsToShow === 3
                        ? "sm:w-[calc(33.333%-16px)]"
                        : itemsToShow === 2
                        ? "sm:w-[calc(50%-12px)]"
                        : "w-full"
                    }`}
                  >
                    {/* Bruker de ferdige cardProps direkte */}
                    <UniversalCard {...project.cardProps} />
                  </div>
                ))}
            </div>
          )
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full shadow-lg z-10 transition-all duration-300"
        aria-label="Previous projects"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full shadow-lg z-10 transition-all duration-300"
        aria-label="Next projects"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-primary w-6" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;
