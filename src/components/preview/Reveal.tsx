"use client";

import { motion, type Variants } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolioStore";
import type { AnimationsConfig } from "@/schemas/portfolio";

/** Per-preset motion tuning for scroll reveals. */
type Bezier = [number, number, number, number];

const PRESET: Record<
  AnimationsConfig["preset"],
  { y: number; duration: number; ease: Bezier }
> = {
  none: { y: 0, duration: 0, ease: [0, 0, 1, 1] },
  minimal: { y: 8, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  smooth: { y: 24, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  dynamic: { y: 40, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
  futuristic: { y: 60, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

export function Reveal({
  children,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const animations = usePortfolioStore((s) => s.data.animations);
  const enabled = animations.scrollReveal && animations.preset !== "none";
  const p = PRESET[animations.preset];

  if (!enabled) return <>{children}</>;

  const variants: Variants = {
    hidden: { opacity: 0, y: p.y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: p.duration, ease: p.ease, delay },
    },
  };

  const MotionTag = motion[as];
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
