import { calculateSemester } from "@/lib/education";
import type { EducationData } from "@/lib/types";

function normalizeAssetPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export default function EducationSection({ data }: { data: EducationData }) {
  return (
    <div id="education-container">
      <div className="timeline">
        {data.educationItems.map((item) => (
          <div
            key={`${item.degree}-${item.startDate}`}
            className="timeline-item"
            style={{ opacity: 0, transform: "translateX(-30px)" }}
          >
            <div className="timeline-date">
              {item.startDate} - {item.endDate}
            </div>
            <div className="timeline-content">
              <h3>{item.degree}</h3>
              <p className="institution">{item.institution}</p>

              {item.grade && (
                <p className="grade">Grade: {item.grade}</p>
              )}
              {item.gpa && <p className="gpa">GPA: {item.gpa}</p>}

              {item.semesterStartYear && item.semesterStartMonth ? (
                <p className="status">
                  {calculateSemester(
                    item.semesterStartYear,
                    item.semesterStartMonth,
                  )}
                </p>
              ) : item.status ? (
                <p className="status">{item.status}</p>
              ) : null}

              {item.thesis && (
                <div className="thesis">
                  <div className="thesis-header">
                    <p className="thesis-title">
                      <strong>Thesis:</strong> {item.thesis.title}
                    </p>
                    {item.thesis.file && (
                      <a
                        href={normalizeAssetPath(item.thesis.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="thesis-link"
                        aria-label="Open thesis PDF"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    )}
                  </div>
                  {item.thesis.grade && (
                    <p className="thesis-grade">
                      Thesis Grade: {item.thesis.grade}
                    </p>
                  )}
                </div>
              )}

              <p className="description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function animateEducation(section: HTMLElement) {
  const items = section.querySelectorAll(".timeline-item");
  items.forEach((item, index) => {
    setTimeout(() => {
      const el = item as HTMLElement;
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    }, index * 150);
  });
}
