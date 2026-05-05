"use client";

import dynamic from "next/dynamic";
import { protocolTheme } from "../../lib/theme";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at center, ${protocolTheme.bgInk} 0%, ${protocolTheme.bgDeep} 70%)`,
      }}
    />
  ),
});

export default function HeroCanvas() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: protocolTheme.bgDeep,
      }}
    >
      <Scene />
    </div>
  );
}
