"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SectionAnimator = (section: HTMLElement) => void;

interface SectionsContextValue {
  openSection: string | null;
  toggleSection: (id: string) => void;
  registerAnimator: (id: string, animator: SectionAnimator) => void;
}

const SectionsContext = createContext<SectionsContextValue | null>(null);

export function SectionsProvider({ children }: { children: ReactNode }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const animatorsRef = useRef<Map<string, SectionAnimator>>(new Map());
  const initializedRef = useRef(false);

  const registerAnimator = useCallback(
    (id: string, animator: SectionAnimator) => {
      animatorsRef.current.set(id, animator);
    },
    [],
  );

  const openSectionById = useCallback((id: string) => {
    setOpenSection(id);
    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        setTimeout(() => {
          const animator = animatorsRef.current.get(id);
          if (animator) animator(element);
        }, 300);
      }
    });
  }, []);

  const toggleSection = useCallback(
    (id: string) => {
      if (openSection === id) {
        setOpenSection(null);
      } else {
        openSectionById(id);
      }
    },
    [openSection, openSectionById],
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => openSectionById(hash), 500);
    }
  }, [openSectionById]);

  return (
    <SectionsContext.Provider
      value={{ openSection, toggleSection, registerAnimator }}
    >
      {children}
    </SectionsContext.Provider>
  );
}

export function useSections() {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error("useSections must be used within SectionsProvider");
  }
  return context;
}

interface ExpandableSectionProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  onAnimate?: SectionAnimator;
}

export default function ExpandableSection({
  id,
  title,
  icon,
  children,
  onAnimate,
}: ExpandableSectionProps) {
  const { openSection, toggleSection, registerAnimator } = useSections();
  const isExpanded = openSection === id;
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (onAnimate) {
      registerAnimator(id, onAnimate);
    }
  }, [id, onAnimate, registerAnimator]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (isExpanded) {
      content.style.display = "block";
      requestAnimationFrame(() => {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      });
    } else {
      content.style.opacity = "0";
      content.style.transform = "translateY(-10px)";
      content.style.maxHeight = "0px";
      const timeout = setTimeout(() => {
        if (openSection !== id) {
          content.style.display = "none";
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded, openSection, id]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSection(id);
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section expandable-section${isExpanded ? " expanded" : ""}`}
    >
      <div
        className="section-header"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => toggleSection(id)}
        onKeyDown={handleKeyDown}
      >
        <h2>
          <i className={icon} /> {title}
        </h2>
        <i
          className={`fas fa-chevron-${isExpanded ? "up" : "down"} toggle-icon`}
        />
      </div>
      <div ref={contentRef} className="section-content">
        {children}
      </div>
    </section>
  );
}
