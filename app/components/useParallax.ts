"use client";

import { useEffect, type RefObject } from "react";

/**
 * Drive a CSS variable from 0 → 1 representing how far the element has
 * traveled through the viewport.
 *
 *   p = 0   → element bottom is at viewport top (just entering from below)
 *   p = 0.5 → element center is at viewport center
 *   p = 1   → element top is at viewport bottom (about to leave above)
 *
 * Default var is `--p`. CSS reads it via `var(--p)` and can compose
 * `transform: translate3d(0, calc((var(--p) - 0.5) * 100px), 0)` etc.
 */
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  varName = "--p",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.style.setProperty(varName, "0.5");
      return;
    }

    let raf = 0;
    let pending = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      el.style.setProperty(varName, p.toFixed(4));
      pending = false;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [ref, varName]);
}
