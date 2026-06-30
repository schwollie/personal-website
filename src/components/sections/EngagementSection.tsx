"use client";

import { useState } from "react";
import type { EngagementData } from "@/lib/types";

export default function EngagementSection({ data }: { data: EngagementData }) {
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  const handleLinkClick = (url: string) => {
    setLoadingLink(url);
    setTimeout(() => setLoadingLink(null), 2000);
  };

  return (
    <div id="engagement-container">
      <div className="engagement-grid">
        {data.engagementItems.map((item) => (
          <div
            key={item.organization}
            className="engagement-card"
            style={{ opacity: 0, transform: "rotateY(15deg) translateY(20px)" }}
          >
            <div className="card-header">
              <i className={item.icon || "fas fa-heart"} />
              <h3>{item.organization}</h3>
            </div>
            <div className="card-content">
              <p className="role">{item.role}</p>
              <p className="duration">
                {item.startDate} - {item.endDate}
              </p>
              <p className="description">{item.description}</p>
              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`external-link${loadingLink === item.website ? " loading" : ""}`}
                  onClick={() => handleLinkClick(item.website!)}
                >
                  <i className="fas fa-external-link-alt" /> Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function animateEngagement(section: HTMLElement) {
  const cards = section.querySelectorAll(".engagement-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      const el = card as HTMLElement;
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      el.style.opacity = "1";
      el.style.transform = "rotateY(0deg) translateY(0)";
    }, index * 150);
  });
}
