"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      className="theme-toggle"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={toggleTheme}
      type="button"
    >
      <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"} />
    </button>
  );
}
