import { BlurReveal } from "../BlurReveal";
import { BotMarquee } from "../BotMarquee";

export function Results() {
  return (
    <section id="results" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">— Live bot results</div>
            <h2 className="display text-5xl md:text-6xl max-w-xl">
              <BlurReveal>
                Backtested. Verified.
                <br />
                <span className="neon-text">Making money right now.</span>
              </BlurReveal>
            </h2>
          </div>
          <p className="text-paper/60 max-w-md leading-relaxed">
            Every card is a real bot on a real account. Hover to pause. Click a
            bot to see its full trade history and live positions.
          </p>
        </div>
      </div>

      <BotMarquee />
    </section>
  );
}
