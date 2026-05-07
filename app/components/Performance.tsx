"use client";

import { useRef } from "react";
import Sparkline from "./Sparkline";
import EquityPercentTicker from "./dashboard/EquityPercentTicker";
import StatusPill from "./StatusPill";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";
import BlurStaggerText from "./BlurStaggerText";

const stats: [string, string, string][] = [
  ["Sharpe ratio", "1.84", "90-day rolling"],
  ["Max drawdown", "−4.2%", "ytd"],
  ["Avg fill latency", "42 ms", "p95 across exchanges"],
  ["Strategies running", "127", "across 4 venues"],
  ["Uptime", "99.98%", "last 12 months"],
  ["Capital under mgmt", "—", "non-custodial"],
];

export default function Performance({ accent = ACCENT }: { accent?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  return (
    <section
      ref={sectionRef}
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="ct2u-md-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          <div style={{ position: "sticky", top: 120 }}>
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
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 1,
                  background: accent,
                  verticalAlign: "middle",
                  marginRight: 10,
                }}
              />
              Performance
            </p>
            <h2
              style={{
                fontSize: "clamp(32px, 3.6vw, 48px)",
                letterSpacing: "-0.025em",
                marginBottom: 22,
              }}
            >
              <BlurStaggerText text="Honest numbers." />
              <br />
              <BlurStaggerText
                text="Updated continuously."
                startDelay={0.7}
                style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}
              />
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-2)",
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              We publish every metric — risk-adjusted returns, drawdowns, latency, fill rates —
              directly from production. No selective backtests, no marketing-friendly windows.
            </p>
            <a
              href="https://cointech2u.com/blog/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13.5,
                color: accent,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Read methodology <span>↗</span>
            </a>
          </div>

          <div>
            <div
              className="ct2u-px-rise"
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                background: "#08080B",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                      marginBottom: 6,
                    }}
                  >
                    Equity curve · 12 months
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter-tight), sans-serif",
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    <EquityPercentTicker />
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--text-3)",
                        marginLeft: 8,
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                      }}
                    >
                      vs +18.2% BTC
                    </span>
                  </div>
                </div>
                <StatusPill live />
              </div>
              <div style={{ padding: "0 8px", height: 240 }}>
                <Sparkline width={800} height={240} accent={accent} seed={13} />
              </div>
            </div>

            <div
              className="ct2u-md-stack ct2u-px-rise-sm"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                marginTop: 16,
                overflow: "hidden",
              }}
            >
              {stats.map(([l, v, k], i) => (
                <div
                  key={l}
                  className="ct2u-metric-card"
                  style={{
                    padding: "22px 22px",
                    borderRight: i % 3 < 2 ? "1px solid var(--line)" : "none",
                    borderBottom: i < 3 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                      marginBottom: 8,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      marginBottom: 4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {v}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>{k}</div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 11.5,
                color: "var(--text-3)",
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Past performance is not indicative of future results. Crypto trading carries
              substantial risk, including potential loss of principal. Returns shown are net of
              exchange fees and reflect strategies in production; individual results vary by
              capital, venue, and configuration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
