"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  duration?: number;
  delay?: number;
  format?: (v: number) => string;
  className?: string;
};

export function CountUp({
  to,
  duration = 1400,
  delay = 0,
  format = (v) => Math.round(v).toLocaleString(),
  className,
}: Props) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let startTime: number | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      setValue(to * ease(progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const timeoutId = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timeoutId);
    };
  }, [to, duration, delay]);

  return <span className={className}>{format(value)}</span>;
}
