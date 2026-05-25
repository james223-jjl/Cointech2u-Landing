// Single source of truth for the curated MyCoinDeck news index. Imported by
// both /news/ (the archive listing) and /news/article/ (the detail page) so
// adding or editing an item only needs to happen here.
//
// `framing` is the short summary shown on the card.
// `body` is the optional longer HTML rendered on the detail page; if omitted
// the detail page falls back to the framing line. Both are in original
// editorial wording — no source-site copy is mirrored. Each item points back
// to its canonical MyCoinDeck URL via `sourceUrl`.

export type CuratedNewsItem = {
  id: number;
  title: string;
  framing: string;
  tag: string;
  date: string; // "YYYY-MM-DD HH:mm:ss"
  sourceUrl: string;
  image?: string;
  body?: string; // HTML
};

const MYCOINDECK_INDEX = "https://app.mycoindeck.com/en/home/news";

// Thematic stock images served from Unsplash's CDN. Each URL embeds sizing
// params so the CDN returns a card-ready 1200×750 jpeg. Unsplash's license
// permits free editorial use; we keep neutral / topical photography rather
// than mirroring any third-party article imagery.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&auto=format&fit=crop&q=80`;

export const CURATED_NEWS: CuratedNewsItem[] = [
  {
    id: 9187,
    title: "AMD's AI Story Is Shifting — What Investors Should Watch Next",
    framing:
      "AMD's role in the AI chip cycle is no longer a single trade. New accelerator launches, partnerships, and software-stack moves are reshaping the narrative.",
    tag: "Macro",
    date: "2026-04-14 09:00:00",
    sourceUrl:
      "https://app.mycoindeck.com/en/home/news/9187-amd-s-ai-story-is-shifting-what-investors-should-watch-next",
    image: img("1518770660439-4636190af475"), // semiconductor / circuit-board
    body: `
      <p>AMD's role in the AI chip cycle is no longer a single trade. As the
      company recalibrates around new accelerator launches, partnerships, and
      a broader software stack, the signal-to-noise on its narrative is
      changing — and so is what's worth tracking for anyone with exposure to
      the sector.</p>
      <h3>Why this matters for traders</h3>
      <p>AI infrastructure remains one of the dominant macro stories driving
      risk assets. Shifts in the competitive positioning of major chip
      suppliers feed back into crypto and equity markets through both
      sentiment and capital flows — so a clearer read on AMD's trajectory is
      useful context regardless of which side of the trade you're on.</p>
    `,
  },
  {
    id: 9186,
    title:
      "A Defective Weld Halted Gravity Deliveries for 29 Days as Lucid Stock Tumbles 64% Over the Last Year",
    framing:
      "A production-line snag stalls Gravity SUV deliveries for nearly a month, deepening Lucid's brutal twelve-month slide.",
    tag: "Equities",
    date: "2026-04-13 12:00:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1571607388263-1044f9ea01dd"), // electric vehicle
  },
  {
    id: 9185,
    title:
      "Forecast: This Under-the-Radar Growth Stock Stands to Gain Most from the AI Supercycle",
    framing:
      "One quieter name in the AI supply chain is being flagged as a disproportionate beneficiary as build-out spend accelerates.",
    tag: "Macro",
    date: "2026-04-12 16:00:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1558494949-ef010cbdcc31"), // server room / data centre
  },
  {
    id: 9184,
    title: "What Drove Alibaba Shares Down Nearly 13% in a Single Month",
    framing:
      "Macro overhang and sector rotation combine to wipe almost an eighth off BABA's market cap in 30 days.",
    tag: "Equities",
    date: "2026-04-11 09:30:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1531971589569-0d9370cbe1e5"), // Shanghai / China skyline
  },
  {
    id: 9183,
    title: "Ciena Shares Surge Over 11% in March: Here's What Drove the Rally",
    framing:
      "Networking-gear demand and a constructive earnings tape send Ciena double-digits higher into quarter-end.",
    tag: "Equities",
    date: "2026-04-10 14:15:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1544197150-b99a580bb7a8"), // fibre / network cables
  },
  {
    id: 9182,
    title:
      "Trump Cautions 'Entire Civilization Could Collapse This Evening' as Markets Tumble Ahead of Iran Ultimatum",
    framing:
      "Geopolitical brinkmanship rattles risk assets; equity volatility spikes while traders price the tail event.",
    tag: "Macro",
    date: "2026-04-09 18:45:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1611974789855-9c2a0a7236a3"), // stock chart / market panic
  },
  {
    id: 9181,
    title: "Is This Overlooked Healthcare Stock Your Path to Long-Term Wealth?",
    framing:
      "A defensive-sector pick gets a fresh look as rotation talk picks up — durable cash flows versus crowded growth.",
    tag: "Equities",
    date: "2026-04-08 11:20:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1559757148-5c350d0d3c56"), // healthcare / stethoscope
  },
  {
    id: 9180,
    title:
      "ShipMonk Opens Dedicated Apparel Fulfillment Hub to Address Returns and SKU Challenges",
    framing:
      "Apparel-specific logistics infrastructure goes live as the category's return-rate problem keeps pressuring margins.",
    tag: "Markets",
    date: "2026-04-07 10:00:00",
    sourceUrl: MYCOINDECK_INDEX,
    image: img("1553413077-190dd305871c"), // warehouse / logistics
  },
];

export function findCuratedById(id: number): CuratedNewsItem | undefined {
  return CURATED_NEWS.find((it) => it.id === id);
}
