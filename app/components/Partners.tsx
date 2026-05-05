"use client";

import { useRef, type MouseEvent } from "react";
import { ACCENT } from "./theme";

const partners = [
  { name: "OKX", tag: "Spot · Futures", href: "#" },
  { name: "Bitget", tag: "Copy · Futures", href: "#" },
  { name: "Bybit", tag: "Derivatives", href: "#" },
  { name: "Binance", tag: "Spot · Futures", href: "#" },
];

export default function Partners({ accent = ACCENT }: { accent?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleGridMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const handleCellMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="our-partner"
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
            Official partners
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
            }}
          >
            Connected to the world&apos;s
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              leading exchanges.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Recognised by the industry&apos;s biggest names for innovation, reliability, and advanced
            AI infrastructure.
          </p>
        </div>

        <div
          id="magnetic-area"
          ref={gridRef}
          onMouseMove={handleGridMove}
          className="ct2u-md-2col ct2u-partner-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="ct2u-partner-bg-grid" aria-hidden="true" />
          {partners.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              data-tilt
              className="ct2u-partner-cell partner-card"
              data-idx={i}
              onMouseMove={handleCellMove}
              style={{
                padding: "46px 24px",
                textAlign: "center",
                borderRight: i < partners.length - 1 ? "1px solid var(--line)" : "none",
                position: "relative",
                overflow: "hidden",
                display: "block",
              }}
            >
              <span className="card-glow" aria-hidden="true" />
              <span className="partner-card-inner">
                <div
                  className="partner-card-name"
                  style={{
                    fontFamily: "var(--font-inter-tight), sans-serif",
                    fontSize: 26,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    marginBottom: 8,
                  }}
                >
                  {p.name}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                  }}
                >
                  {p.tag}
                </div>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
