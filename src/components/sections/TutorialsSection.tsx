import { BlurReveal } from "../BlurReveal";
import { Tutorials } from "../Tutorials";

export function TutorialsSection() {
  return (
    <section id="tutorials" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">— Setup guides</div>
          <h2 className="display text-5xl md:text-6xl">
            <BlurReveal>From setup to success.</BlurReveal>
          </h2>
          <p className="mt-6 text-paper/60 text-lg leading-relaxed">
            Four short videos. One live account. Follow along and you&apos;ll
            have a running bot before the last one ends.
          </p>
        </div>

        <Tutorials />
      </div>
    </section>
  );
}
