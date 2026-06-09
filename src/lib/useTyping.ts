"use client";

import { useEffect, useState } from "react";

/**
 * Typewriter effect: types and deletes through a list of phrases.
 * When `enabled` is false it returns the first phrase statically (no timers,
 * no state churn).
 */
export function useTyping(phrases: string[], enabled = true): string {
  const [text, setText] = useState(() => (enabled ? "" : phrases[0] ?? ""));

  useEffect(() => {
    if (!enabled || phrases.length === 0) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIndex % phrases.length];
      charIndex += deleting ? -1 : 1;
      setText(current.slice(0, charIndex));

      let delay = deleting ? 45 : 90;
      if (!deleting && charIndex === current.length) {
        delay = 1400; // pause at full word
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex += 1;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [phrases, enabled]);

  return enabled ? text : phrases[0] ?? "";
}
