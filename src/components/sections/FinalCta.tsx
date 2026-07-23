import { ArrowIcon } from "../ArrowIcon";
import { BlurReveal } from "../BlurReveal";

export function FinalCta() {
  return (
    <section className="py-32 border-t hairline galaxy-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
          <div>
            <div className="eyebrow mb-5">— Start today</div>
            <h2 className="display text-5xl md:text-7xl">
              <BlurReveal>
                Start earning
                <br />
                while the market
                <br />
                <span className="display-grad">sleeps.</span>
              </BlurReveal>
            </h2>
            <p className="mt-8 text-paper/70 text-lg max-w-xl leading-relaxed">
              Available in 100+ countries. Beginner or pro — CoinTech2u makes
              every trader faster, smarter, and data-backed. Trade anywhere,
              anytime.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
                className="btn-primary px-6 py-3.5 rounded-full font-medium text-sm inline-flex items-center gap-2"
              >
                Create free account
                <ArrowIcon />
              </a>
              <a
                href="https://t.me/CoinTech2u_Admin"
                className="btn-ghost px-6 py-3.5 rounded-full font-medium text-sm"
              >
                Talk to us on Telegram
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 text-center">
              <div className="media-slot aspect-square w-full mb-4 text-[10px]">
                [ QR · iOS ]
              </div>
              <div className="font-display text-lg mb-1">iOS</div>
              <div className="text-xs text-mute font-mono uppercase tracking-widest">
                Coming soon
              </div>
            </div>
            <div className="card p-6 text-center">
              <div className="media-slot aspect-square w-full mb-4 text-[10px]">
                [ QR · Android ]
              </div>
              <div className="font-display text-lg mb-1">Android</div>
              <div className="text-xs text-neon font-mono uppercase tracking-widest">
                Download →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
