"use client";

import { useEffect, useRef } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";
import LogoParticlesScene from "./v3/LogoParticles";

// `tagKey` resolves to a translation at render time so the pill swaps
// language with the rest of the page. Exchange names + URLs stay literal.
const partners = [
  {
    name: "OKX",
    tagKey: "partners.tag.spotFutures",
    href: "https://cointech2u.com/reg-okx",
    logo: "/logos/okx.svg",
  },
  {
    name: "Bitget",
    tagKey: "partners.tag.copyFutures",
    href: "https://cointech2u.com/reg-bitget",
    logo: "/logos/bitget.svg",
  },
  {
    name: "Bybit",
    tagKey: "partners.tag.derivatives",
    href: "https://cointech2u.com/reg-bybit",
    logo: "/logos/bybit.svg",
  },
  {
    name: "Binance",
    tagKey: "partners.tag.spotFutures",
    href: "https://cointech2u.com/reg-binance",
    logo: "/logos/binance.svg",
  },
];

export default function Partners({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  useParallax(sectionRef);

  /* Section-scoped logo silhouette parallax. The drift is driven by the
     section's own viewport position (rect.top + half-height vs viewport
     centre), so the silhouette rises into view as the user scrolls into
     the Partners section and drifts past as they scroll out. */
  useEffect(() => {
    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const sec = sectionRef.current;
      const logo = logoRef.current;
      if (!sec || !logo) return;
      const rect = sec.getBoundingClientRect();
      const offset =
        rect.top + rect.height / 2 - window.innerHeight / 2;
      logo.style.transform = `translate3d(-50%, ${offset * -0.18}px, 0)`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-partner"
      className="reveal ct2u-section"
      style={{
        padding: "180px 32px",
        borderTop: "1px solid var(--line)",
        position: "relative",
        overflow: "hidden",
        // Min-height holds the section open even if content is short, so
        // more of the 1500px-tall logo silhouette stays in frame.
        minHeight: "min(95vh, 900px)",
      }}
    >
      {/* Logo silhouette backdrop — relocated from the Hero section. */}
      <div
        ref={logoRef}
        aria-hidden
        className="ct2u-hero-logo"
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          transform: "translate3d(-50%, 0, 0)",
          width: 2000,
          height: 1500,
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 0,
        }}
      >
        <LogoParticlesScene transparent />
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.06em",
              color: accent,
              margin: 0,
              marginBottom: 22,
            }}
          >
            {t("partners.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(44px, 5.5vw, 72px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
              whiteSpace: "pre-line",
            }}
          >
            {t("partners.title.line1")}
          </h2>
          <p
            style={{
              /* Matches `.ct2u-hero-stage-3-title-italic` — that span lives
                 inside an h2 with `clamp(34px, 4vw, 52px)`, so its 0.5em
                 resolves to `clamp(17px, 2vw, 26px)` here. */
              fontSize: "clamp(17px, 2vw, 26px)",
              color: "var(--text-2)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {t("partners.subtitle.line1")}
            <br />
            {t("partners.subtitle.line2")}
          </p>
        </div>

        <div className="ct2u-partner-grid">
          {partners.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-partner-card"
              data-idx={i}
            >
              {/* Oversized faded logo watermark — fills the card and bleeds
                  past the edges, masked with a radial gradient so it fades
                  toward the rim. Small foreground logo stays visible for
                  legibility. */}
              <span
                className="ct2u-partner-card-watermark"
                aria-hidden
                style={{ backgroundImage: `url(${p.logo})` }}
              />
              <div className="ct2u-partner-card-top">
                <span className="mono ct2u-partner-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ct2u-partner-card-arrow" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 L17 7" />
                    <path d="M9 7 H17 V15" />
                  </svg>
                </span>
              </div>
              <div className="ct2u-partner-card-logo">
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" />
              </div>
              <div className="mono ct2u-partner-card-tag">{t(p.tagKey)}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
