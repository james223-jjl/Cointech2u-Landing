import { ArrowIcon } from "../ArrowIcon";
import { BlurReveal } from "../BlurReveal";

const posts = [
  {
    date: "Apr 21, 2026 · Listings",
    title: "Coinbase to list CHIP for spot trading.",
    slot: "[ post-coinbase-chip.jpg ]",
  },
  {
    date: "Apr 21, 2026 · Macro",
    title: "Trump surprised by stock market rebound after predicting 20% drop.",
    slot: "[ post-trump-markets.jpg ]",
  },
  {
    date: "Apr 21, 2026 · DeFi",
    title: "Arkham launches a decentralized exchange feature.",
    slot: "[ post-arkham-dex.jpg ]",
  },
  {
    date: "Apr 21, 2026 · Stablecoins",
    title: "Tempo partners with DoorDash on stablecoin-based delivery rewards.",
    slot: "[ post-tempo-doordash.jpg ]",
  },
];

export function Insights() {
  return (
    <section id="insights" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="eyebrow mb-4">
              — Insights, news &amp; market updates
            </div>
            <h2 className="display text-5xl md:text-6xl max-w-2xl">
              <BlurReveal>
                Discover trends.
                <br />
                Learn from data.
                <br />
                <span className="neon-text">Stay ahead of the market.</span>
              </BlurReveal>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.cointech2u.com/blog/"
              className="btn-ghost px-5 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2"
            >
              View all posts
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mb-6">
          <a
            href="https://www.cointech2u.com/blog/"
            className="card p-0 overflow-hidden block group"
          >
            <div
              className="media-slot w-full"
              style={{
                aspectRatio: "16/10",
                borderRadius: 0,
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
              }}
            >
              <div className="text-center">
                <div className="eyebrow mb-2">Featured · Partnerships</div>
                <div className="font-display text-2xl text-paper normal-case tracking-normal max-w-md">
                  Bitget × CoinTech2u
                </div>
                <div className="text-[10px] text-mute mt-3">
                  [ featured-bitget-partnership.jpg ]
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-mute mb-4">
                <span>Apr 21, 2026</span>
                <span>·</span>
                <span className="text-neon">Partnership</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl mb-3 leading-tight">
                Bitget partners with CoinTech2u: elevating crypto trading with
                AI-driven innovations.
              </h3>
              <p className="text-paper/60 leading-relaxed text-sm">
                A deep-dive into the partnership, the technical integration,
                and what it unlocks for traders on both platforms — from
                tighter spreads to faster AI signal execution.
              </p>
              <div className="mt-6 text-sm text-neon font-mono inline-flex items-center gap-2">
                Read the story
                <ArrowIcon size={12} />
              </div>
            </div>
          </a>

          <a
            href="https://www.cointech2u.com/blog/"
            className="card p-0 overflow-hidden block"
          >
            <div
              className="media-slot w-full"
              style={{
                aspectRatio: "4/3",
                borderRadius: 0,
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
              }}
            >
              <div className="text-center">
                <div className="eyebrow mb-2">Event</div>
                <div className="font-display text-xl text-paper normal-case tracking-normal">
                  Coinfest Asia 2024
                </div>
                <div className="text-[10px] text-mute mt-3">
                  [ coinfest-asia-highlights.jpg ]
                </div>
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-mute mb-3">
                <span>Event recap</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl leading-tight">
                CoinTech2u at Coinfest Asia 2024: highlights &amp; innovations.
              </h3>
              <div className="mt-4 text-sm text-neon font-mono inline-flex items-center gap-2">
                Read recap
                <ArrowIcon size={12} />
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((p) => (
            <a
              key={p.title}
              href="https://www.cointech2u.com/blog/"
              className="card p-0 overflow-hidden block"
            >
              <div
                className="media-slot w-full aspect-[4/3]"
                style={{
                  borderRadius: 0,
                  borderLeft: 0,
                  borderRight: 0,
                  borderTop: 0,
                }}
              >
                {p.slot}
              </div>
              <div className="p-5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-mute mb-2">
                  {p.date}
                </div>
                <h4 className="font-display text-lg leading-snug text-paper">
                  {p.title}
                </h4>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center">
          <a
            href="https://www.cointech2u.com/blog/"
            className="btn-primary px-6 py-3.5 rounded-full font-medium text-sm inline-flex items-center gap-2"
          >
            Load more insights
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
