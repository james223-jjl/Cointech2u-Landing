"use client";

import { useEffect, useState } from "react";

const format = new Intl.NumberFormat("en-US");

export function LiveBotsLabel() {
  const [count, setCount] = useState(2847);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) - 1);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[11px] tracking-widest text-paper/80 uppercase">
      {format.format(count)} bots trading right now
    </span>
  );
}
