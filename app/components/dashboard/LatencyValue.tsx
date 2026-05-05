"use client";

import { useEffect, useState } from "react";

export default function LatencyValue() {
  const [ms, setMs] = useState(42);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = setInterval(() => {
      setMs((v) => {
        const next = v + Math.round((Math.random() - 0.5) * 4);
        return Math.max(38, Math.min(46, next));
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {ms}
      <span style={{ color: "var(--text-3)", fontSize: 13 }}>ms</span>
    </span>
  );
}
