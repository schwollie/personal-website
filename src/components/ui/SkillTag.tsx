"use client";

import { useCallback, useEffect, useRef } from "react";

interface SkillTagProps {
  name: string;
  source: string;
  skillLevel: string | null;
}

export default function SkillTag({ name, source, skillLevel }: SkillTagProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupTooltip = useCallback(() => {
    if (tooltipRef.current) {
      if (document.body.contains(tooltipRef.current)) {
        document.body.removeChild(tooltipRef.current);
      }
      tooltipRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleCleanup = () => cleanupTooltip();
    window.addEventListener("scroll", handleCleanup, { passive: true });
    window.addEventListener("resize", handleCleanup, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleCleanup);
      window.removeEventListener("resize", handleCleanup);
      cleanupTooltip();
    };
  }, [cleanupTooltip]);

  const showTooltip = () => {
    if (!source || !itemRef.current) return;
    cleanupTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = `Source: ${source}`;
    tooltip.style.opacity = "0";
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const rect = itemRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let top = rect.top + scrollY - tooltip.offsetHeight - 5;
    let left = rect.left + scrollX;

    if (top < scrollY) {
      top = rect.bottom + scrollY + 5;
    }
    if (left + tooltip.offsetWidth > window.innerWidth + scrollX) {
      left = rect.right + scrollX - tooltip.offsetWidth;
    }
    if (left < scrollX) {
      left = scrollX + 5;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    requestAnimationFrame(() => {
      if (tooltipRef.current === tooltip) {
        tooltip.style.opacity = "1";
      }
    });
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
      timeoutRef.current = setTimeout(cleanupTooltip, 200);
    }
  };

  return (
    <div
      ref={itemRef}
      className="skill-item"
      data-source={source}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <div className="skill-item-header">
        <span className="skill-name">{name}</span>
        {skillLevel && (
          <span className="skill-level-label">{skillLevel}</span>
        )}
      </div>
      {source && <span className="skill-source">{source}</span>}
    </div>
  );
}
