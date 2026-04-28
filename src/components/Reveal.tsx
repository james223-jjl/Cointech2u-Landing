"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  className?: string;
};

export function Reveal({
  children,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [primed, setPrimed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPrimed(true);

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setVisible(true), delay);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return (
    <div
      ref={ref}
      className={[
        "reveal",
        primed ? "reveal-priming" : "",
        visible ? "is-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
