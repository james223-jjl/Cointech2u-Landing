"use client";

import type { CSSProperties } from "react";

/**
 * Splits `text` into per-character `<span>`s, each with a staggered
 * `animation-delay`. The CSS class `.ct2u-blur-stagger` keeps the spans
 * pre-blurred + invisible; when an ancestor `.reveal` element gets the
 * `.in` class, the spans animate to sharp + opaque in sequence.
 *
 * - `charDelay` — seconds between each character (default 0.04s)
 * - `startDelay` — base delay before line 1 starts (default 0)
 * - Accessibility: uses `aria-label` on the outer span so screen readers
 *   read the whole word; per-character spans are `aria-hidden`.
 */
export default function BlurStaggerText({
  text,
  startDelay = 0,
  charDelay = 0.04,
  className,
  style,
}: {
  text: string;
  startDelay?: number;
  charDelay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`ct2u-blur-stagger ${className ?? ""}`.trim()}
      style={style}
      aria-label={text}
    >
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden
          style={{ animationDelay: `${(startDelay + i * charDelay).toFixed(3)}s` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
