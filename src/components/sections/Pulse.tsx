import { BlurReveal } from "../BlurReveal";
import { LivePulseCounter } from "../LivePulseCounter";

export function Pulse() {
  return (
    <section id="pulse" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16 items-center">
          <div>
            <div className="eyebrow mb-5">— Live proof, not a backtest</div>
            <h2 className="display text-5xl md:text-6xl">
              <BlurReveal>
                Running live.
                <br />
                <span className="neon-text">Right now.</span>
              </BlurReveal>
            </h2>
            <p className="mt-6 text-paper/70 text-lg max-w-md leading-relaxed">
              This isn&apos;t a simulation. It&apos;s the same bot you&apos;d
              run — live-trading a real account, no breaks, no resets. We
              started the clock and never stopped it.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-mute">
              <span className="live-dot" />
              <span className="font-mono text-xs tracking-widest uppercase">
                Streaming · real account, real time
              </span>
            </div>
          </div>

          <LivePulseCounter />
        </div>
      </div>
    </section>
  );
}
