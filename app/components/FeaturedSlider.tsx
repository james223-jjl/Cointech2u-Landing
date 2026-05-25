"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CURATED_NEWS, type CuratedNewsItem } from "../lib/news";
import { ACCENT } from "./theme";

// Slide variants. Video slides embed a YouTube iframe; image slides render a
// static hero image. Both share the same caption block underneath.
type VideoSlide = {
  kind: "video";
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  cta: string;
  ctaUrl: string;
  youtubeId: string;
};
type ImageSlide = {
  kind: "image";
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  cta: string;
  ctaUrl: string;
  image: string;
};
type Slide = VideoSlide | ImageSlide;

// === Slides 1 & 2 — YouTube embeds from cointech2u.com homepage ===========
const VIDEO_SLIDES: VideoSlide[] = [
  {
    kind: "video",
    tag: "Watch",
    title: "The World's Leading Crypto AI Bot",
    excerpt:
      "Stay ahead of every market move with AI-powered precision, real-time analytics, and proven intelligence — trusted by over 240,000+ users worldwide.",
    meta: "cointech2u.com",
    cta: "Watch on YouTube",
    ctaUrl: "https://www.youtube.com/watch?v=FyPU-a4L0pE",
    youtubeId: "FyPU-a4L0pE",
  },
  {
    kind: "video",
    tag: "Watch",
    title: "What is CoinTech2u?",
    excerpt:
      "Official promo: the world's leading AI crypto bot for futures trading — how the platform works and why traders choose it.",
    meta: "cointech2u.com",
    cta: "Watch on YouTube",
    ctaUrl: "https://www.youtube.com/watch?v=DbXjehOQP-8",
    youtubeId: "DbXjehOQP-8",
  },
];

// === Slides 3-6 — derived from the curated /news/ feed =====================
// One ImageSlide per curated news item (first four). Pulling from the shared
// CURATED_NEWS module means images, titles, excerpts, dates, and tags stay
// in sync with the /news/ archive automatically — edit one place, both
// update. Each slide deep-links to its own article detail page.
function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function curatedToSlide(item: CuratedNewsItem): ImageSlide {
  return {
    kind: "image",
    tag: item.tag,
    title: item.title,
    excerpt: item.framing,
    meta: formatDate(item.date),
    cta: "Read article",
    ctaUrl: `/news/article/?id=${item.id}`,
    image:
      item.image ??
      // Local fallback if a curated item somehow lacks an image — keeps the
      // slide rendering instead of blanking out.
      "/announcements/version3.0.jpg",
  };
}

const BLOG_SLIDES: ImageSlide[] = CURATED_NEWS.slice(0, 4).map(curatedToSlide);

const ALL_SLIDES: Slide[] = [...VIDEO_SLIDES, ...BLOG_SLIDES];

export default function FeaturedSlider({ accent = ACCENT }: { accent?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Snap-scroll position → active index. Throttled to one rAF per scroll
  // batch so we don't update state on every pixel.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        if (!w) return;
        const idx = Math.round(el.scrollLeft / w);
        setActive((cur) => (cur === idx ? cur : idx));
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => {
      el.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(ALL_SLIDES.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, []);

  return (
    <div className="ct2u-fs">
      <div className="ct2u-fs-track" ref={trackRef}>
        {ALL_SLIDES.map((s, i) => (
          <article key={`${s.kind}-${i}`} className="ct2u-fs-slide" aria-hidden={i !== active}>
            <div className="ct2u-fs-media">
              {s.kind === "video" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${s.youtubeId}?rel=0&modestbranding=1`}
                  title={s.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                // Wrap the image in an anchor so the whole media area is
                // clickable — same destination as the title + CTA link.
                <a
                  href={s.ctaUrl}
                  className="ct2u-fs-media-link"
                  aria-label={s.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" loading="lazy" decoding="async" />
                </a>
              )}
              <span
                className="mono ct2u-fs-tag"
                style={{
                  color: accent,
                  background: `${accent}1F`,
                  borderColor: `${accent}4D`,
                }}
              >
                {s.tag}
              </span>
            </div>
            <div className="ct2u-fs-body">
              <h3 className="ct2u-fs-title">
                {/* Video slides link out to YouTube in a new tab; image
                    slides point at the internal /news/article/ detail. */}
                {s.kind === "video" ? (
                  <a href={s.ctaUrl} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>
                ) : (
                  <a href={s.ctaUrl}>{s.title}</a>
                )}
              </h3>
              <p className="ct2u-fs-excerpt">{s.excerpt}</p>
              <div className="ct2u-fs-meta mono">
                <span>{s.meta}</span>
                <span aria-hidden>·</span>
                {s.kind === "video" ? (
                  <a href={s.ctaUrl} target="_blank" rel="noopener noreferrer">
                    {s.cta} →
                  </a>
                ) : (
                  <a href={s.ctaUrl}>{s.cta} →</a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="ct2u-fs-arrow ct2u-fs-arrow--prev"
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        aria-label="Previous slide"
      >
        <ArrowSvg dir="left" />
      </button>
      <button
        type="button"
        className="ct2u-fs-arrow ct2u-fs-arrow--next"
        onClick={() => goTo(active + 1)}
        disabled={active === ALL_SLIDES.length - 1}
        aria-label="Next slide"
      >
        <ArrowSvg dir="right" />
      </button>

      <div className="ct2u-fs-dots" role="tablist" aria-label="Featured slides">
        {ALL_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to slide ${i + 1}`}
            className={
              i === active ? "ct2u-fs-dot ct2u-fs-dot--active" : "ct2u-fs-dot"
            }
            onClick={() => goTo(i)}
            style={i === active ? { background: accent } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ArrowSvg({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
