"use client";

import { useEffect, useState } from "react";

// Mirrors the live cointech2u.com counter's anchor (2023-11-24 local time).
const ANCHOR = new Date("2023-11-24T00:00:00").getTime();

function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}

function compute() {
  const diff = Date.now() - ANCHOR;
  const s = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return { days, hours, mins, secs };
}

export function LivePulseCounter() {
  const [t, setT] = useState<ReturnType<typeof compute> | null>(null);

  useEffect(() => {
    setT(compute());
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Tile label="Days" value={t ? String(t.days) : "0"} />
      <Tile label="Hours" value={t ? pad(t.hours) : "00"} />
      <Tile label="Minutes" value={t ? pad(t.mins) : "00"} />
      <Tile label="Seconds" value={t ? pad(t.secs) : "00"} highlight />
    </div>
  );
}

function Tile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="tile p-5 md:p-6">
      <div className="text-[10px] font-mono uppercase tracking-widest text-mute">
        {label}
      </div>
      <div
        className={`font-display text-4xl md:text-5xl mt-2 tabular-nums ${
          highlight ? "neon-text" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
