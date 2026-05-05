"use client";

import { useState } from "react";
import { ACCENT } from "./theme";

const tabs = [
  {
    n: "01",
    t: "Register an exchange account",
    d: "Walk through creating an account with one of our supported exchanges in under three minutes.",
    video: "/videos/tut-01-register.mp4",
  },
  {
    n: "02",
    t: "Bind Fast API",
    d: "Generate a read-only API key, paste it in, and we verify scopes — withdrawal access is rejected automatically.",
    video: "/videos/tut-02-bind-api.mp4",
  },
  {
    n: "03",
    t: "Quick setup",
    d: "The engine inspects your balance and risk preferences and proposes an initial strategy configuration.",
    video: "/videos/tut-03-quick-setup.mp4",
  },
  {
    n: "04",
    t: "View account performance",
    d: "Open the analytics dashboard for equity curves, position history, and exportable PnL reports.",
    video: "/videos/tut-04-view-performance.mp4",
  },
];

export default function Tutorials({ accent = ACCENT }: { accent?: string }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section
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
            From setup to success
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
            }}
          >
            Walkthrough videos.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Setup, end to end.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Follow our secure step-by-step API guides and start automating in minutes — with full
            control over your exchange funds.
          </p>
        </div>

        <div
          className="ct2u-md-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.n}
                onClick={() => setActive(i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "20px 18px",
                  background: active === i ? "rgba(227,81,238,0.04)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--line)",
                  borderLeft: active === i ? `2px solid ${accent}` : "2px solid transparent",
                  color: "var(--text)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    className="mono"
                    style={{ fontSize: 11, color: active === i ? accent : "var(--text-3)" }}
                  >
                    {tab.n}
                  </span>
                  {active === i && (
                    <span className="mono" style={{ fontSize: 10.5, color: accent }}>
                      NOW PLAYING
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: active === i ? "var(--text)" : "var(--text-2)",
                  }}
                >
                  {tab.t}
                </div>
              </button>
            ))}
          </div>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              background: "#08080B",
              boxShadow: `0 0 80px -20px ${accent}55`,
            }}
          >
            <div
              style={{
                aspectRatio: "16 / 9",
                position: "relative",
                background: "#000",
              }}
            >
              <video
                key={current.video}
                src={current.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <span
                className="mono"
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  fontSize: 11,
                  color: "var(--text-3)",
                  background: "rgba(0,0,0,0.55)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  backdropFilter: "blur(8px)",
                  letterSpacing: "0.08em",
                }}
              >
                {current.n} · TUTORIAL
              </span>
            </div>
            <div
              style={{
                padding: "20px 24px 22px",
                borderTop: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-inter-tight), sans-serif",
                  fontSize: 22,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                {current.t}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "var(--text-2)",
                  lineHeight: 1.6,
                  maxWidth: 720,
                }}
              >
                {current.d}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
