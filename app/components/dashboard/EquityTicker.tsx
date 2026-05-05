"use client";

import { useEffect, useState } from "react";

const DAY_OPEN = 127118.31;
const FLOOR = 128100;
const CEIL = 128700;
const TICK_MS = 700;

function formatCurrency(n: number): string {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function EquityTicker() {
  const [value, setValue] = useState(128402.51);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = setInterval(() => {
      setValue((v) => {
        const drift = (Math.random() - 0.45) * 4;
        const next = v + drift;
        if (next < FLOOR) return v + Math.abs(drift);
        if (next > CEIL) return v - Math.abs(drift);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const change = value - DAY_OPEN;
  const pct = (change / DAY_OPEN) * 100;
  const positive = change >= 0;

  const dollars = Math.floor(value).toLocaleString();
  const cents = (value - Math.floor(value)).toFixed(2).slice(1); // ".XX"
  const sign = positive ? "+" : "−";
  const changeStr = `${sign} $${formatCurrency(Math.abs(change))}`;
  const pctStr = `${sign}${Math.abs(pct).toFixed(2)}%`;

  return (
    <>
      <div
        style={{
          fontFamily: "var(--font-inter-tight), sans-serif",
          fontSize: 38,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        ${dollars}
        <span style={{ color: "var(--text-3)" }}>{cents}</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 8,
          fontSize: 12,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: positive ? "var(--green)" : "var(--red)" }}>
          {changeStr}
        </span>
        <span style={{ color: "var(--text-3)" }}>{pctStr} · 24h</span>
      </div>
    </>
  );
}
