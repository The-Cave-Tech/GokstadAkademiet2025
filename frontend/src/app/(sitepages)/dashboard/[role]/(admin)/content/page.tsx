"use client";
import React, { useState, ReactNode } from "react";

// Type definitions
type NavItemId = "prosjekter" | "arrangementer" | "blogger";

interface NavItem {
  id: NavItemId;
  title: string;
}

type ContentMap = {
  [key in NavItemId]: ReactNode;
};

const Page = () => {
  // Navigation items
  const navItems: NavItem[] = [
    { id: "prosjekter", title: "Prosjekter" },
    { id: "arrangementer", title: "Arrangementer" },
    { id: "blogger", title: "Blogger" },
  ];

  // State to track which navigation item is active
  const [activeNavItem, setActiveNavItem] = useState<NavItemId>("prosjekter");

  // Content for each navigation section
  const content: ContentMap = {
    prosjekter: (
      <>
        <h2>Prosjekter</h2>
        <div className="flex">
          <h3>Prosjekt Oversikt</h3>
          <p>Her finner du alle våre spennende prosjekter</p>
        </div>
      </>
    ),
    arrangementer: (
      <>
        <h2>Arrangementer</h2>
        <div className="flex">
          <h3>Kommende</h3>
          <p>Se våre planlagte arrangementer for denne sesongen</p>
        </div>
      </>
    ),
    blogger: (
      <>
        <h2>Blogger</h2>
        <div className="flex">
          <h3>Nyeste Innlegg</h3>
          <p>Les våre siste bloginnlegg om aktuelle temaer</p>
        </div>
      </>
    ),
  };

  return (
    <section className="flex flex-col items-center gap-10">
      <nav className="h-5 mt-10 w-[100vw]">
        <ul className="flex gap-10 justify-center">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`underline cursor-pointer ${
                activeNavItem === item.id ? "font-bold" : ""
              }`}
              onClick={() => setActiveNavItem(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </nav>

      <section>{content[activeNavItem]}</section>
    </section>
  );
};

export default Page;
