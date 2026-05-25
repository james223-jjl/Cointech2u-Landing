"use client";

import { ACCENT } from "./theme";

// Single card in the /news and /announcements archive grids. Layout mirrors
// the virtuals.io research grid: large hero image (or gradient fallback) on
// top, tag pill overlaid in the upper-left corner, then title + excerpt +
// date in the body. The whole card is one big anchor; arrow icon nudges on
// hover for that "tap-through" affordance.
export type ArchiveCardProps = {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  image?: string | null;
  fallbackKey: string;
  external?: boolean;
  accent?: string;
};

// Deterministic gradient for cards without a hero image — same idea as in
// AnnouncementsRow so the page never has bare grey rectangles.
function gradientFor(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const a = Math.abs(hash) % 360;
  const b = (a + 60) % 360;
  return `linear-gradient(135deg, hsl(${a} 65% 28%) 0%, hsl(${b} 70% 18%) 100%)`;
}

export default function ArchiveCard({
  href,
  title,
  excerpt,
  date,
  tag,
  image,
  fallbackKey,
  external,
  accent = ACCENT,
}: ArchiveCardProps) {
  const targetProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a href={href} {...targetProps} className="ct2u-arch-card">
      <div
        className="ct2u-arch-card-media"
        style={image ? undefined : { background: gradientFor(fallbackKey) }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="ct2u-arch-card-mark" aria-hidden>
            {title.charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className="mono ct2u-arch-card-tag"
          style={{
            color: accent,
            background: `${accent}1F`,
            borderColor: `${accent}4D`,
          }}
        >
          {tag}
        </span>
      </div>

      <div className="ct2u-arch-card-body">
        <h3 className="ct2u-arch-card-title">{title}</h3>
        {excerpt && <p className="ct2u-arch-card-excerpt">{excerpt}</p>}
        <div className="ct2u-arch-card-meta mono">
          <span>{date}</span>
          <span className="ct2u-arch-card-arrow" aria-hidden>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 L17 7" />
              <path d="M9 7 H17 V15" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
