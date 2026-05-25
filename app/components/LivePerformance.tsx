"use client";

import { useT } from "../lib/i18n";
import HeroDashboard from "./HeroDashboard";
import HeroLiveCounter from "./HeroLiveCounter";
import { ACCENT } from "./theme";

// String fields hold i18n keys, not literals — resolved via t() at render
// time. `title` stays untranslated for "Equity Guard" / "Profit Guard"
// product names; the surrounding descriptions translate.
// Internal article routes — same detail page used by /announcements/.
const GUARDS = [
  {
    icon: "/icons/equity-guard.svg",
    titleKey: "livePerf.guard.equity.title",
    descKey: "livePerf.guard.equity.desc",
    href: "/announcements/article/?slug=equity-guard",
  },
  {
    icon: "/icons/profit-guard.svg",
    titleKey: "livePerf.guard.profit.title",
    descKey: "livePerf.guard.profit.desc",
    href: "/announcements/article/?slug=profit-guard",
  },
];

export default function LivePerformance({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  return (
    <section id="trading" className="ct2u-live-performance">
      <div className="ct2u-hero-stage-3-row">
        <div className="ct2u-hero-stage-3-caption">
          <p className="ct2u-hero-stage-3-eyebrow">
            <span aria-hidden className="ct2u-hero-stage-3-eyebrow-rule" />
            {t("livePerf.eyebrow")}
          </p>
          <h2 className="ct2u-hero-stage-3-title">
            {t("livePerf.title.line1")}
            <br />
            <span className="ct2u-hero-stage-3-title-italic">
              {t("livePerf.title.line2")}
            </span>
          </h2>
          <HeroLiveCounter />

          <div className="ct2u-guards">
            {GUARDS.map((g) => (
              <a
                key={g.titleKey}
                href={g.href}
                className="ct2u-guard-card"
              >
                <span className="ct2u-guard-card-icon-wrap">
                  <img
                    src={g.icon}
                    alt=""
                    aria-hidden
                    className="ct2u-guard-card-icon"
                  />
                </span>
                <span className="ct2u-guard-card-body">
                  <span className="ct2u-guard-card-title">{t(g.titleKey)}</span>
                  <span className="ct2u-guard-card-desc">{t(g.descKey)}</span>
                </span>
                <span aria-hidden className="ct2u-guard-card-arrow">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="float-soft ct2u-hero-stage-3-dash">
          <HeroDashboard accent={accent} />
        </div>
      </div>
    </section>
  );
}
