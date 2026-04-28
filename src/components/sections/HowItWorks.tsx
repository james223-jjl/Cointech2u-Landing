import { BlurReveal } from "../BlurReveal";

const steps = [
  {
    n: "01",
    title: "Connect your exchange.",
    body: "Generate a Fast API key on OKX, Bitget, Bybit, or Binance. Paste it in. We verify, encrypt, and bind — withdrawal permission is blocked at the key level, so it literally cannot move your funds.",
    tags: ["Read-only", "AES-256", "~45 sec"],
    media: "/media/step-01-connect.mp4",
    mediaAlt: "Connecting an exchange via Fast API key",
    mediaOrder: "right" as const,
  },
  {
    n: "02",
    title: "Let the AI calibrate.",
    body: "The engine scans your balance, risk tolerance, and market regime, then generates a trading configuration tuned to your capital. No guessing at leverage. No picking pairs. Just approve and go.",
    tags: ["Adaptive sizing", "Risk-aware", "One-tap approve"],
    media: "/media/step-02-calibrate.mp4",
    mediaAlt: "AI calibrating a trading configuration to user balance",
    mediaOrder: "left" as const,
  },
  {
    n: "03",
    title: "Watch it compound.",
    body: "The AI runs 24/7 — reading tape, firing entries, trimming risk, closing winners. You get a live dashboard with every trade, every P&L line, every signal. Check in when you want. It doesn't need you.",
    tags: ["24/7 execution", "Live P&L", "Push alerts"],
    media: "/media/step-03-compound.mp4",
    mediaAlt: "Live P&L dashboard with trades and signals streaming",
    mediaOrder: "right" as const,
  },
];

function Step({ step }: { step: (typeof steps)[number] }) {
  const grid =
    step.mediaOrder === "right"
      ? "lg:grid-cols-[1fr_1.1fr]"
      : "lg:grid-cols-[1.1fr_1fr]";

  const content = (
    <div>
      <div className="font-mono text-7xl text-neon/40 font-medium mb-4">
        {step.n}
      </div>
      <h3 className="font-display text-4xl mb-4">{step.title}</h3>
      <p className="text-paper/65 leading-relaxed mb-6">{step.body}</p>
      <div className="flex flex-wrap gap-2">
        {step.tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full text-[11px] font-mono border hairline text-paper/70"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );

  const media = (
    <div className="media-slot aspect-video w-full">
      <video
        src={step.media}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={step.mediaAlt}
        className="w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className={`grid ${grid} gap-8 items-center card p-6 md:p-10`}>
      {step.mediaOrder === "right" ? (
        <>
          {content}
          {media}
        </>
      ) : (
        <>
          <div className="lg:order-1 order-2">{media}</div>
          <div className="lg:order-2 order-1">{content}</div>
        </>
      )}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-4">— Three steps</div>
          <h2 className="display text-5xl md:text-6xl">
            <BlurReveal>
              Connect. Calibrate.
              <br />
              <span className="neon-text">Compound.</span>
            </BlurReveal>
          </h2>
          <p className="mt-6 text-paper/60 text-lg leading-relaxed">
            From fresh install to first live trade in under a minute. No trading
            experience needed — the AI handles the strategy, you just watch the
            results.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s) => (
            <Step key={s.n} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
