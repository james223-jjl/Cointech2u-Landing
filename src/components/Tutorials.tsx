"use client";

import { useState } from "react";

const tabs = [
  {
    short: "Register an exchange",
    title: "Register an exchange account",
    file: "Register-Complete.mp4",
  },
  {
    short: "Bind Fast API",
    title: "Bind your Fast API key",
    file: "cointech2u-bind-fast-api-preview.mp4",
  },
  {
    short: "Quick setup",
    title: "AI quick-setup walkthrough",
    file: "cointech2u-quick-setup-preview.mp4",
  },
  {
    short: "View performance",
    title: "View account performance & P&L",
    file: "cointech2u-view-pnl-analysis-preview.mp4",
  },
];

export function Tutorials() {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div className="card p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`text-left px-4 py-4 rounded-xl border hairline text-sm transition ${
              active === i ? "tab-active" : "text-mute"
            }`}
            aria-pressed={active === i}
          >
            <div className="font-mono text-[10px] tracking-widest mb-1">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-medium">{tab.short}</div>
          </button>
        ))}
      </div>

      <div className="media-slot aspect-video w-full text-base">
        <div className="text-center">
          <div className="text-neon text-sm mb-2">▶ NOW PLAYING</div>
          <div className="font-display text-2xl text-paper normal-case tracking-normal">
            {current.title}
          </div>
          <div className="text-xs text-mute mt-3">[ {current.file} ]</div>
        </div>
      </div>
    </div>
  );
}
