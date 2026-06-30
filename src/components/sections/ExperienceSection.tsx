import Image from "next/image";
import type { ExperienceData } from "@/lib/types";

function normalizeAssetPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export default function ExperienceSection({ data }: { data: ExperienceData }) {
  return (
    <div id="experience-container">
      <div className="experience-grid">
        {data.experienceItems.map((item) => (
          <div
            key={`${item.company}-${item.startDate}`}
            className="experience-card"
            style={{ opacity: 0, transform: "scale(0.9) translateY(20px)" }}
          >
            <div className="company-logo">
              {item.companyLogo ? (
                <Image
                  src={normalizeAssetPath(item.companyLogo)}
                  alt={`${item.company} logo`}
                  width={60}
                  height={60}
                />
              ) : (
                <i className="fas fa-building" />
              )}
            </div>
            <div className="experience-details">
              <h3>{item.position}</h3>
              <p className="company">{item.company}</p>
              <p className="duration">
                <i className="fas fa-calendar" /> {item.startDate} -{" "}
                {item.endDate}
              </p>
              {item.location && (
                <p className="location">
                  <i className="fas fa-map-marker-alt" /> {item.location}
                </p>
              )}
              <p className="description">{item.description}</p>

              {item.technologies && item.technologies.length > 0 && (
                <div className="skills-used">
                  <p>Technologies:</p>
                  <div className="skills-list">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="skill-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.achievements && item.achievements.length > 0 && (
                <div className="achievements">
                  <p>Key Achievements:</p>
                  <ul>
                    {item.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function animateExperience(section: HTMLElement) {
  const cards = section.querySelectorAll(".experience-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      const el = card as HTMLElement;
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "scale(1) translateY(0)";
    }, index * 200);
  });
}
