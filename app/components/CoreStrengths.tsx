"use client";

import { useRef } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

type CardLayout = "stat" | "visual";

type CardItem = {
  n: string;
  slug: string;
  /** Tiny uppercase label at the top of the card (Apple "Up to" / category label). */
  eyebrow: string;
  /** "stat" cards lead with a big number; "visual" cards lead with a big icon. */
  layout: CardLayout;
  big?: string;
  bigUnit?: string;
  /** Short tagline below the hero element. */
  caption: string;
  /** Long-form prose shown in the pillar detail section below the card row. */
  body: string;
  /** Short feature/keyword chips shown above the CTA in the pillar block. */
  tags: string[];
  /** Decorative video shown in the pillar's visual block. */
  video: string;
  /** Optional separate video for the small card-row media block. Falls back
      to `video` when omitted. */
  cardVideo?: string;
  /** Small card-row content — decoupled from the pillar block above so the
      highlight row can show its own set of feature labels. */
  cardTitle: string;
  cardSub: string;
  /** Big figure shown in the small card-row body (stat or short word). */
  cardBig: string;
  /** When true, the small card video uses object-fit: contain (full frame)
      instead of cover (cropped fill). */
  cardVideoContain?: boolean;
  /** Optional scale multiplier for the pillar (big card) video — e.g. 1.15
      to zoom in 15%. */
  pillarVideoZoom?: number;
};

// 5 cards — virtuals.io-style row. "Always on" was dropped because it overlaps
// with "Live since 2022".
const items: CardItem[] = [
  {
    n: "01",
    slug: "custody",
    // Pillar 01 now shows the Equity Guard pillar content (swapped with 02).
    // Videos + small-card content stay on item 01 — only the pillar copy
    // (eyebrow / caption / body / tags) switched.
    eyebrow: "core.card.ai.eyebrow",
    layout: "stat",
    big: "100%",
    bigUnit: "core.card.custody.unit",
    caption: "core.card.ai.caption",
    body: "core.card.ai.body",
    tags: ["Equity cut-loss", "Auto position close", "Drawdown protection", "CoinTech2u 3.0"],
    video: "/videos/strength-01-custody.mp4",
    cardVideo: "/videos/strength-01-card.mp4",
    cardTitle: "core.hl.1.title",
    cardSub: "core.hl.1.sub",
    cardBig: "SAFE",
  },
  {
    n: "02",
    slug: "ai",
    // Pillar 02 now shows the Profit Guard pillar content.
    eyebrow: "core.card.custody.eyebrow",
    layout: "visual",
    caption: "core.card.custody.caption",
    body: "core.card.custody.body",
    tags: ["Auto profit transfer", "Equity target", "Trading → Funding wallet", "CoinTech2u 3.0"],
    video: "/videos/strength-02-ai.mp4",
    cardVideo: "/videos/strength-02-card.mp4",
    cardTitle: "core.hl.2.title",
    cardSub: "core.hl.2.sub",
    cardBig: "AUTO",
    pillarVideoZoom: 1.08,
  },
  {
    n: "03",
    slug: "live2022",
    eyebrow: "core.card.live2022.eyebrow",
    layout: "stat",
    big: "1,587",
    bigUnit: "core.card.live2022.unit",
    caption: "core.card.live2022.caption",
    body: "core.card.live2022.body",
    tags: ["Self-custody", "Own exchange accounts", "Zero third-party risk", "Full transparency"],
    video: "/videos/strength-03-pillar.mp4",
    cardVideo: "/videos/strength-03-card.mp4",
    cardTitle: "core.hl.3.title",
    cardSub: "core.hl.3.sub",
    cardBig: "100%",
  },
  {
    n: "04",
    slug: "latency",
    eyebrow: "core.card.latency.eyebrow",
    layout: "stat",
    big: "42",
    bigUnit: "core.card.latency.unit",
    caption: "core.card.latency.caption",
    body: "core.card.latency.body",
    tags: ["Continuous learning", "Volatility monitoring", "Entry/exit optimization", "Risk-minimizing"],
    video: "/videos/strength-04-pillar.mp4",
    cardVideo: "/videos/strength-04-card.mp4",
    cardTitle: "core.hl.4.title",
    cardSub: "core.hl.4.sub",
    cardBig: "24/7",
  },
  {
    n: "05",
    slug: "discipline",
    eyebrow: "core.card.discipline.eyebrow",
    layout: "visual",
    caption: "core.card.discipline.caption",
    body: "core.card.discipline.body",
    tags: ["98% win rate", "Verifiable data", "Real user performance", "100+ countries"],
    video: "/videos/strength-05-pillar.mp4",
    cardVideo: "/videos/strength-05-card.mp4",
    cardTitle: "core.hl.5.title",
    cardSub: "core.hl.5.sub",
    cardBig: "98%",
  },
];

const CTA_URL = "https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca";

export default function CoreStrengths({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  const handleCardClick = (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(`pillar-${slug}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      id="core-strengths"
      className="reveal ct2u-section ct2u-strengths"
      style={{ padding: "84px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.06em",
              color: accent,
              margin: 0,
              marginBottom: 22,
            }}
          >
            {t("core.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(38px, 4.6vw, 60px)",
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            {t("core.title.line1")}
          </h2>
        </div>

        <div className="ct2u-strengths-row">
          {items.map((it) => (
            <a
              key={it.slug}
              href={`#pillar-${it.slug}`}
              onClick={handleCardClick(it.slug)}
              className="ct2u-strengths-card"
            >
              <div className="ct2u-strengths-card-media">
                <video
                  src={it.cardVideo ?? it.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={
                    "ct2u-strengths-card-video" +
                    (it.cardVideoContain ? " ct2u-strengths-card-video--contain" : "")
                  }
                  aria-hidden
                />
              </div>
              <div className="ct2u-strengths-card-body">
                <span className="mono ct2u-strengths-card-num">{it.n}</span>
                <span className="ct2u-strengths-card-stat-row">
                  <span className="ct2u-strengths-card-stat-big">{it.cardBig}</span>
                </span>
                <h3 className="ct2u-strengths-card-title">{t(it.cardTitle)}</h3>
                <p className="ct2u-strengths-card-sub">{t(it.cardSub)}</p>
              </div>
              <span className="ct2u-strengths-card-cta mono">
                {t(it.cardTitle)} <span aria-hidden>→</span>
              </span>
            </a>
          ))}
        </div>

        <div className="ct2u-strengths-pillars">
          {items.map((it, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={it.slug}
                id={`pillar-${it.slug}`}
                className={
                  "ct2u-strengths-pillar" +
                  (reversed ? " ct2u-strengths-pillar--reverse" : "")
                }
              >
                <div className="ct2u-strengths-pillar-visual" aria-hidden>
                  <video
                    src={it.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="ct2u-strengths-pillar-video"
                    style={
                      it.pillarVideoZoom
                        ? { transform: `scale(${it.pillarVideoZoom})` }
                        : undefined
                    }
                  />
                </div>
                <div className="ct2u-strengths-pillar-content">
                  <div className="ct2u-strengths-pillar-head mono">
                    <span className="ct2u-strengths-pillar-num">{it.n}</span>
                    <span className="ct2u-strengths-pillar-divider" aria-hidden />
                    <span className="ct2u-strengths-pillar-name">{t(it.eyebrow)}</span>
                  </div>
                  <h3 className="ct2u-strengths-pillar-headline">{t(it.caption)}</h3>
                  <p className="ct2u-strengths-pillar-body">{t(it.body)}</p>
                  <a
                    className="ct2u-strengths-pillar-cta"
                    href={CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
                      boxShadow: `0 0 24px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    }}
                  >
                    Explore {t(it.eyebrow)} now <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
