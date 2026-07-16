"use client";

import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";

export default function Hero({ accent = ACCENT }: { accent?: string }) {
  const t = useT();

  return (
    <section className="ct2u-hero">
      <div className="ct2u-hero-shell">
        <div className="ct2u-hero-media">
          <video
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>

        <div className="ct2u-hero-copy">
          <h1
            className="ct2u-hero-title ct2u-aurora-text ct2u-h1-mask reveal in"
            style={{ filter: `drop-shadow(0 0 24px ${accent}40)` }}
          >
            <span className="ct2u-h1-line">
              <span className="ct2u-h1-line-inner">{t("hero.title.line1")}</span>
            </span>
            <span className="ct2u-h1-line">
              <span className="ct2u-h1-line-inner">
                {t("hero.title.line2.lead")}{" "}
                <em style={{ fontStyle: "normal" }}>{t("hero.title.line2.emph")}</em>
              </span>
            </span>
          </h1>

          <p className="ct2u-hero-sub">
            {t("hero.subtitle.pre")}{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>{t("hero.subtitle.countries")}</span>
            {t("hero.subtitle.post")}
          </p>

          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              fontWeight: 700,
              color: "#fff",
              marginTop: 4,
              marginBottom: 10,
            }}
          >
            Since 2022
          </span>
          <a
            className="ct2u-hero-cta"
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
              boxShadow: `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            {t("hero.experience.getStarted")} <span style={{ opacity: 0.75 }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
