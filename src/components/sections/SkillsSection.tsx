import SkillTag from "@/components/ui/SkillTag";
import type { SkillsData } from "@/lib/types";

const CATEGORY_ORDER = ["programming", "technologies", "languages"];

export default function SkillsSection({ data }: { data: SkillsData }) {
  const sortedCategories = [...data.skillCategories].sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.categoryId);
    const bIndex = CATEGORY_ORDER.indexOf(b.categoryId);
    return aIndex - bIndex;
  });

  return (
    <div className="skills-grid" id="skills-container">
      {sortedCategories.map((category) => (
        <div key={category.categoryId} className="skill-category">
          <h3>{category.categoryName}</h3>
          <div className="skills-list">
            {category.skills.map((skill) => (
              <SkillTag
                key={`${category.categoryId}-${skill.name}`}
                name={skill.name}
                source={skill.source}
                skillLevel={skill.skillLevel}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function animateSkills(section: HTMLElement) {
  const skillItems = section.querySelectorAll(".skill-item");
  skillItems.forEach((skillItem, index) => {
    if (!(skillItem as HTMLElement).dataset.animated) {
      setTimeout(() => {
        skillItem.classList.add("skill-item--visible");
        (skillItem as HTMLElement).dataset.animated = "true";
      }, index * 50);
    }
  });
}
