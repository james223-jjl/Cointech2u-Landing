"use client";

import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";

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
  pad = 2,
  highlight,
  featured,
}: {
  val: number;
  label: string;
  pad?: number;
  highlight?: boolean;
  /** Hero-stat treatment: wider tile (2× column) + larger digit + subtle
   *  brand-tinted background. Reserved for the headline metric (Days). */
  featured?: boolean;
}) {
  return (
    <div
      className={
        "ct2u-counter-tile" + (featured ? " ct2u-counter-tile--featured" : "")
      }
      tabIndex={0}
    >
      <div
        className="mono ct2u-counter-tile-num"
        style={{ color: highlight ? "var(--brand)" : "var(--text)" }}
      >
        {String(val).padStart(pad, "0")}
      </div>
      <div className="ct2u-counter-tile-label">{label}</div>
    </div>
  );
}

/* Compact uptime counter — days/hrs/min/sec since the live account opened.
   Same intro count-up tween as the original LiveTrading section, but laid
   out as a tight horizontal row that fits cleanly under a title. */
export default function HeroLiveCounter() {
  const t = useT();
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
    <div
      className="ct2u-counter-grid ct2u-counter-grid--compact"
      aria-label={t("livePerf.counter.aria")}
    >
      <Tile val={time.d} label={t("livePerf.counter.days")} pad={4} featured />
      <Tile val={time.h} label={t("livePerf.counter.hours")} />
      <Tile val={time.m} label={t("livePerf.counter.minutes")} />
      <Tile val={time.s} label={t("livePerf.counter.seconds")} highlight />
    </div>
  );
}
