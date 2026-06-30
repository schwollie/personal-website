"use client";

import dynamic from "next/dynamic";
import AnimationProvider from "@/components/layout/AnimationProvider";

const ThemeToggle = dynamic(() => import("@/components/layout/ThemeToggle"), {
  ssr: false,
});

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeToggle />
      <AnimationProvider />
      {children}
    </>
  );
}
