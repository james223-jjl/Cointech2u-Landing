"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

const START = new Date("2022-01-01T00:00:00Z").getTime();
const INTRO_DURATION_MS = 1500;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function calcDelta() {
  const diff = Math.max(0, Date.now() - START);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function Tile({
  val,
  label,
  highlight,
  pad,
}: {
  val: number;
  label: string;
  highlight?: boolean;
  pad?: number;
}) {
  return (
    <div className="ct2u-counter-tile" tabIndex={0}>
      <div
        className="mono ct2u-counter-tile-num"
        style={{ color: highlight ? "var(--brand)" : "var(--text)" }}
      >
        {String(val).padStart(pad ?? 2, "0")}
      </div>
      <div className="ct2u-counter-tile-label">{label}</div>
    </div>
  );
}

export default function LiveTrading({ accent = ACCENT }: { accent?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  // Start at zero so the count-up tween has somewhere to come from.
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setTime(calcDelta());
      const id = setInterval(() => setTime(calcDelta()), 1000);
      return () => clearInterval(id);
    }

    let cancelled = false;
    let raf = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const start = performance.now();

    const step = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / INTRO_DURATION_MS);
      const eased = easeOutCubic(t);
      const target = calcDelta();
      setTime({
        d: Math.floor(target.d * eased),
        h: Math.floor(target.h * eased),
        m: Math.floor(target.m * eased),
        s: Math.floor(target.s * eased),
      });
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setTime(calcDelta());
        intervalId = setInterval(() => setTime(calcDelta()), 1000);
      }
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trading"
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)", position: "relative" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 50 }}>
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
            Live Trading
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            Real account.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Real performance, in real time.
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
            This live account has been actively trading and reporting performance, uninterrupted,
            using CoinTech2u&apos;s AI engine.
          </p>
        </div>

        <div className="ct2u-px-rise">
          <div className="ct2u-counter-grid">
            <Tile val={time.d} label="Days" pad={4} />
            <Tile val={time.h} label="Hours" />
            <Tile val={time.m} label="Minutes" />
            <Tile val={time.s} label="Seconds" highlight />
          </div>
          <div className="ct2u-counter-meta">
            <span className="mono">START · 2022-01-01 00:00 UTC</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden
                className="ct2u-live-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  background: "var(--green)",
                  boxShadow: "0 0 8px var(--green)",
                }}
              />
              Streaming live
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
