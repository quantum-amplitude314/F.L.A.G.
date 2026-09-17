"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "mission-console", label: "Mission Console", compactLabel: "Console" },
  { id: "foundation", label: "Foundation" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function Navigation() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const syncWithHash = () => {
      const sectionId = window.location.hash.slice(1) as SectionId;
      if (sections.some(({ id }) => id === sectionId)) {
        setActiveSection(sectionId);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter(({ isIntersecting }) => isIntersecting)
          .toSorted(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

        setActiveSection(
          activeEntry ? (activeEntry.target.id as SectionId) : null,
        );
      },
      { rootMargin: "-28% 0px -67% 0px", threshold: 0 },
    );

    for (const { id } of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncWithHash);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-[120rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 2xl:px-16"
      >
        <a
          href="#hero"
          className="font-mono text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
        >
          F.L.A.G.
        </a>

        <div className="flex items-center font-mono text-[0.67rem] uppercase tracking-[0.1em] text-muted-foreground sm:ml-auto sm:text-xs sm:tracking-[0.12em]">
          {sections.map(({ id, label, ...section }, index) => {
            const active = id === activeSection;

            return (
              <span key={id} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-foreground/35">
                    |
                  </span>
                ) : null}
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "relative px-2 py-2 transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-center after:bg-primary after:transition-transform after:duration-300",
                    active
                      ? "text-foreground after:scale-x-100"
                      : "hover:text-foreground after:scale-x-0",
                  )}
                >
                  <span className="sm:hidden">
                    {"compactLabel" in section ? section.compactLabel : label}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </a>
              </span>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
