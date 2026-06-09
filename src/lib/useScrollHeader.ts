"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when a sticky header should hide: the user is scrolling down and
 * away from the top. Returns false when scrolling up or near the top.
 *
 * Reads the current window's scroll — inside the builder's preview iframe that
 * is the iframe's own window, so it tracks the previewed page's scroll.
 */
export function useHideOnScroll(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const goingDown = y > lastY && y > 80;
      setHidden((prev) => (goingDown ? true : y < lastY ? false : prev));
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
