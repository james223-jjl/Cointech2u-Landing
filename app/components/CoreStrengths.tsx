"use client";

import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";
import VoronoiBackdrop from "./VoronoiBackdrop";

type IconKind = "shield" | "ai" | "verified" | "api" | "clock" | "lock";

/* Cursor-tracking spotlight: writes the cursor's card-local position into
   CSS custom properties on the card. The CSS uses these to position a
   purple radial gradient at the cursor — a "follow-light" feel. */
function handleCardMouseMove(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

/* 6 Voronoi seed anchors pinned to a 3×2 grid (3 columns × 2 rows).
   Slight asymmetric Y offsets within each row so cell boundaries are
   diagonal rather than perfectly vertical/horizontal, producing the
   chamfered Voronoi look while keeping each card inside its own panel.
   Module-scoped for a stable reference across renders. */
const STRENGTH_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [0.16, 0.30], // card 01 — top-left
  [0.50, 0.22], // card 02 — top-center
  [0.84, 0.28], // card 03 — top-right
  [0.18, 0.78], // card 04 — bottom-left
  [0.50, 0.74], // card 05 — bottom-center
  [0.82, 0.76], // card 06 — bottom-right
];

type CardLayout = "stat" | "visual";

type CardItem = {
  n: string;
  /** Tiny uppercase label at the top of the card (Apple "Up to" / category label). */
  eyebrow: string;
  /** "stat" cards lead with a big number; "visual" cards lead with a big icon. */
  layout: CardLayout;
  /** Hero stat (only used by "stat" layout). */
  big?: string;
  /** Optional small unit beside the stat (e.g. "ms", "days"). */
  bigUnit?: string;
  /** Single short tagline below the hero element. */
  caption: string;
  /** Icon shown big for "visual" layout. */
  icon: IconKind;
};

// String fields hold i18n keys, not literals — resolved via t() in the render
// loop below so swapping language re-renders the cards in place.
const items: CardItem[] = [
  {
    n: "01",
    eyebrow: "core.card.custody.eyebrow",
    layout: "stat",
    big: "100%",
    bigUnit: "core.card.custody.unit",
    caption: "core.card.custody.caption",
    icon: "shield",
  },
  {
    n: "02",
    eyebrow: "core.card.ai.eyebrow",
    layout: "visual",
    caption: "core.card.ai.caption",
    icon: "ai",
  },
  {
    n: "03",
    eyebrow: "core.card.live2022.eyebrow",
    layout: "stat",
    big: "1,587",
    bigUnit: "core.card.live2022.unit",
    caption: "core.card.live2022.caption",
    icon: "verified",
  },
  {
    n: "04",
    eyebrow: "core.card.latency.eyebrow",
    layout: "stat",
    big: "42",
    bigUnit: "core.card.latency.unit",
    caption: "core.card.latency.caption",
    icon: "api",
  },
  {
    n: "05",
    eyebrow: "core.card.always.eyebrow",
    layout: "stat",
    big: "24/7",
    caption: "core.card.always.caption",
    icon: "clock",
  },
  {
    n: "06",
    eyebrow: "core.card.discipline.eyebrow",
    layout: "visual",
    caption: "core.card.discipline.caption",
    icon: "lock",
  },
];

function StrengthIcon({ kind, size = 40 }: { kind: IconKind; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "shield") {
    return (
      <svg {...common}>
        <path d="M12 2.5 L20 5.5 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V5.5 L12 2.5 Z" />
        <path d="M8.5 11.5 L11 14 L15.5 9.5" />
      </svg>
    );
  }
  if (kind === "ai") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2.2" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      </svg>
    );
  }
  if (kind === "verified") {
    return (
      <svg {...common}>
        <path d="M3.5 20 H20.5" />
        <path d="M6.5 20 V14" />
        <path d="M11 20 V10" />
        <path d="M15.5 20 V13" />
        <path d="M19.5 4 L21.5 6 L17.5 10" />
      </svg>
    );
  }
  if (kind === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7 V12 L15.5 14" />
      </svg>
    );
  }
  if (kind === "lock") {
    return (
      <svg {...common}>
        <rect x="5.5" y="11" width="13" height="9.5" rx="1.6" />
        <path d="M8.5 11 V8 A3.5 3.5 0 0 1 15.5 8 V11" />
      </svg>
    );
  }
  // "api" — lightning bolt + connect
  return (
    <svg {...common}>
      <path d="M13 2.5 L4.5 13.5 H10.5 L9 21.5 L19.5 9.5 H13 L13 2.5 Z" />
    </svg>
  );
}

export default function CoreStrengths({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  // One ref per card — passed to VoronoiBackdrop so each card is clip-pathed
  // to its Voronoi cell. Stable identity since useRef returns the same array.
  const cardRefs = useRef(items.map(() => ({ current: null as HTMLElement | null })));
  return (
    <section
      ref={sectionRef}
      id="core-strengths"
      className="reveal ct2u-section"
      style={{ padding: "84px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="ct2u-px-rise-fade"
          style={{
            textAlign: "center",
            marginBottom: 40,
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              margin: 0,
              marginBottom: 22,
            }}
          >
            {t("core.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(38px, 4.6vw, 60px)",
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            {t("core.title.line1")}
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
              {t("core.title.line2")}
            </span>
          </h2>
        </div>

        <div className="ct2u-strength-grid ct2u-strength-grid--bigbox">
          <VoronoiBackdrop
            numPoints={6}
            seedAnchors={STRENGTH_ANCHORS}
            cardRefs={cardRefs.current}
            driftAmp={5}
            mouseRadius={260}
            mouseForce={22}
            maxOffset={18}
            clipInset={5}
          />
          {items.map((it, i) => (
            <article
              key={it.n}
              ref={cardRefs.current[i]}
              className={
                "ct2u-strength-card ct2u-strength-card--voronoi" +
                (i === 2 ? " ct2u-strength-card--hero" : "")
              }
              tabIndex={0}
              onMouseMove={handleCardMouseMove}
            >
              <span className="ct2u-strength-card-sweep" aria-hidden />
              {/* Single composite exchange image used as a faded watermark
                  behind the stat + caption. Painted before content in the
                  DOM so .content paints on top. */}
              {it.icon === "api" && (
                <div className="ct2u-strength-card-bg-logos" aria-hidden>
                  <img
                    src="/strengths/exchange.png"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="ct2u-strength-card-content">
                {/* Top: small uppercase eyebrow label (Apple's "Up to" /
                    category line). */}
                <span className="mono ct2u-strength-card-eyebrow">
                  {t(it.eyebrow)}
                </span>

                {/* Middle: focal element. Stat layout shows a big number +
                    optional unit; visual layout shows a big centred icon. */}
                <div className="ct2u-strength-card-hero">
                  {it.layout === "stat" ? (
                    <span className="ct2u-strength-card-stat-row">
                      <span className="ct2u-strength-card-stat-big">
                        {it.big}
                      </span>
                      {it.bigUnit && (
                        <span className="ct2u-strength-card-stat-unit">
                          {t(it.bigUnit)}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="ct2u-strength-card-icon-big" aria-hidden>
                      <StrengthIcon kind={it.icon} size={84} />
                    </span>
                  )}
                </div>

                {/* Optional supporting visual — only on cards where it
                    reinforces the stat (sparkline for "live performance",
                    exchange logos for the latency card). */}
                {it.icon === "verified" && (
                  <svg
                    className="ct2u-strength-card-spark"
                    viewBox="0 0 200 36"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id={`ct2u-spark-grad-${i}`}
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="rgba(227,81,238,0.25)" />
                        <stop offset="60%" stopColor="rgba(227,81,238,1)" />
                        <stop offset="100%" stopColor="rgba(227,81,238,1)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 28 L18 26 L36 24 L54 25 L72 22 L90 19 L108 20 L126 16 L144 11 L162 9 L180 6 L200 4"
                      stroke={`url(#ct2u-spark-grad-${i})`}
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* Bottom: short caption. */}
                <p className="ct2u-strength-card-caption">{t(it.caption)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
