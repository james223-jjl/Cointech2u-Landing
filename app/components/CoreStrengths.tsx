"use client";

import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";
import VoronoiBackdrop from "./VoronoiBackdrop";

type IconKind = "shield" | "ai" | "verified" | "api";

/* Cursor-tracking spotlight: writes the cursor's card-local position into
   CSS custom properties on the card. The CSS uses these to position a
   purple radial gradient at the cursor — a "follow-light" feel. */
function handleCardMouseMove(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

/* 4 Voronoi seed anchors pinned to the 2×2 card quadrants — one panel per card.
   Slight asymmetric offsets (Y differs between TL/TR, X between TL/BL, etc.)
   so cell boundaries are diagonal rather than perfect rectangles, producing
   the chamfered Voronoi look while keeping each card inside its own panel.
   Module-scoped for a stable reference across renders. */
const STRENGTH_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [0.28, 0.32], // card 01 — TL
  [0.72, 0.26], // card 02 — TR
  [0.32, 0.78], // card 03 — BL
  [0.74, 0.70], // card 04 — BR
];

const items: { n: string; t: string; d: string; icon: IconKind }[] = [
  {
    n: "01",
    t: "Zero custody risk",
    d: "Maintain full control of your funds at all times. Your assets stay safely in your own exchange accounts — zero third-party custody, full transparency on every trade.",
    icon: "shield",
  },
  {
    n: "02",
    t: "Adaptive AI intelligence",
    d: "Our engine never stops learning. Algorithms continuously monitor volatility regimes, calibrating entry and exit logic to changing market conditions.",
    icon: "ai",
  },
  {
    n: "03",
    t: "Verified, transparent results",
    d: "Every metric — Sharpe, drawdown, win/loss, latency — is published from production. No selective backtests, no marketing-friendly windows.",
    icon: "verified",
  },
  {
    n: "04",
    t: "Seamless Fast API",
    d: "Connect in seconds, trade smarter forever. Our secure Fast API links instantly to OKX, Bitget, Bybit, or Binance — real-time analytics with zero setup complexity.",
    icon: "api",
  },
];

function StrengthIcon({ kind }: { kind: IconKind }) {
  const common = {
    width: 40,
    height: 40,
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
  // "api" — lightning bolt + connect
  return (
    <svg {...common}>
      <path d="M13 2.5 L4.5 13.5 H10.5 L9 21.5 L19.5 9.5 H13 L13 2.5 Z" />
    </svg>
  );
}

export default function CoreStrengths({ accent = ACCENT }: { accent?: string }) {
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
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="ct2u-px-rise-fade"
          style={{
            textAlign: "center",
            marginBottom: 64,
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
            Core strengths
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            AI-driven insights.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Smart analysis. Verified results.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6 }}>
            Experience CoinTech2u&apos;s adaptive logic in action — real-time analytics, risk control,
            and consistent performance backed by four years of live data.
          </p>
        </div>

        <div className="ct2u-strength-grid ct2u-strength-grid--bigbox">
          <VoronoiBackdrop
            numPoints={4}
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
              <div className="ct2u-strength-card-content">
                <div className="ct2u-strength-card-top">
                  <span className="mono ct2u-strength-num">{it.n}</span>
                  <span className="ct2u-strength-card-icon" aria-hidden>
                    <StrengthIcon kind={it.icon} />
                  </span>
                </div>
                <h3 className="ct2u-strength-card-title">{it.t}</h3>
                <p className="ct2u-strength-card-desc">{it.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
