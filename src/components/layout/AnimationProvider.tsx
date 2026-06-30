"use client";

import { useEffect } from "react";

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function AnimationProvider() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const reducedMotion = prefersReducedMotion.matches;

    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("reduced-motion", e.matches);
    };
    prefersReducedMotion.addEventListener("change", handleMotionChange);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            if (!section.dataset.animated) {
              section.classList.add("visible");
              section.dataset.animated = "true";
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".section").forEach((section) => {
      sectionObserver.observe(section);
    });

    let ticking = false;
    const updateParallax = () => {
      if (reducedMotion) return;

      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero-section") as HTMLElement | null;
      if (hero) {
        hero.style.transform = `translate3d(0, ${scrolled * -0.3}px, 0)`;
      }

      const profileRing = document.querySelector(
        ".profile-ring",
      ) as HTMLElement | null;
      if (profileRing) {
        profileRing.style.transform = `rotate(${scrolled * 0.2}deg)`;
      }

      ticking = false;
    };

    const requestParallaxUpdate = debounce(() => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, 16);

    if (!reducedMotion) {
      window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    }

    return () => {
      prefersReducedMotion.removeEventListener("change", handleMotionChange);
      sectionObserver.disconnect();
      window.removeEventListener("scroll", requestParallaxUpdate);
    };
  }, []);

  return null;
}
