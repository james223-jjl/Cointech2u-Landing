"use client";

import { useEffect, useState } from "react";

export default function UpdatedAgo() {
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = setInterval(() => {
      setSeconds((s) => (s >= 12 ? 0 : s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>
      {seconds === 0 ? "updated just now" : `updated ${seconds}s ago`}
    </span>
  );
}
