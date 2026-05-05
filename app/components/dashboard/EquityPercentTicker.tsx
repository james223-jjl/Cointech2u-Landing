"use client";

import { useEffect, useState } from "react";

const BASE = 24.6;
const FLOOR = 24.48;
const CEIL = 24.74;
const TICK_MS = 1500;

export default function EquityPercentTicker() {
  const [value, setValue] = useState(BASE);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = setInterval(() => {
      setValue((v) => {
        const drift = (Math.random() - 0.5) * 0.06;
        const next = v + drift;
        if (next < FLOOR) return v + Math.abs(drift);
        if (next > CEIL) return v - Math.abs(drift);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      +{value.toFixed(2)}%
    </span>
  );
}
