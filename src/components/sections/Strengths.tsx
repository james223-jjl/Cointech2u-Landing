import { ReactNode } from "react";
import { BlurReveal } from "../BlurReveal";

const items: { label: string; title: string; body: string; icon: ReactNode }[] =
  [
    {
      label: "01 · Custody",
      title: "You keep the keys.",
      body: "Your capital never leaves your exchange account. Our API connection is read-only and trade-only — withdrawals are permanently disabled at the key level. Zero custody, zero counterparty risk.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-neon" aria-hidden="true">
          <path d="M14 2L4 6v8c0 6 4 10 10 12 6-2 10-6 10-12V6l-10-4z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 14l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "02 · Intelligence",
      title: "AI that adapts every tick.",
      body: "Our engine reads volatility, liquidity, and order-flow in real time — recalibrating entries, exits, and position sizing the instant conditions change. It never panics. It never sleeps.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-neon" aria-hidden="true">
          <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 2v4M14 22v4M2 14h4M22 14h4M5.6 5.6l2.8 2.8M19.6 19.6l2.8 2.8M5.6 22.4l2.8-2.8M19.6 8.4l2.8-2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "03 · Performance",
      title: "98% verified win-rate.",
      body: "Not a backtest. Four years of live, on-chain verifiable trades across 240,000+ accounts. Every trade is logged, signed, and auditable from the dashboard.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-neon" aria-hidden="true">
          <path d="M4 22L10 14L14 18L24 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "04 · Speed",
      title: "Live in 60 seconds.",
      body: "Paste a Fast API key, pick a strategy, and the bot is live. No configs, no YAML, no waiting. First trade usually fires within the hour.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-neon" aria-hidden="true">
          <path d="M6 14h8m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14h8m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

export function Strengths() {
  return (
    <section id="strengths" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-4">— Core strengths</div>
          <h2 className="display text-5xl md:text-6xl">
            <BlurReveal>
              Four reasons 240,000 people
              <br />
              let the AI drive.
            </BlurReveal>
          </h2>
          <p className="mt-6 text-paper/60 text-lg leading-relaxed">
            Four years of verified performance, an adaptive engine that learns
            from every tick, and a custody model where we never touch your
            funds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.label} className="card p-10">
              <div className="flex items-start justify-between mb-10">
                <span className="eyebrow">{it.label}</span>
                {it.icon}
              </div>
              <h3 className="font-display text-3xl mb-4">{it.title}</h3>
              <p className="text-paper/65 leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
