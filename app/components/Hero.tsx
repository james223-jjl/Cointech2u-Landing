"use client";

import { useEffect, useRef } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";

export default function Hero({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let pending = false;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const hp = total > 0 ? clamp01(scrolled / total) : 0;

      // Three phases over the pin:
      //   0.00 – 0.05  video only (both stages hidden)
      //   0.05 – 0.40  stage 1 (tagline + CTAs) fades in and holds
      //   0.40 – 0.58  stage 1 fades out, stage 2 fades in (brief crossfade)
      //   0.58 – 1.00  stage 2 (badge + sub-title) is the resting view
      const s1In = clamp01((hp - 0.05) * 8);
      const s1Out = clamp01(1 - (hp - 0.40) * 7);
      const s1 = Math.min(s1In, s1Out);
      const s2 = clamp01((hp - 0.55) * 7);

      sec.style.setProperty("--hp", hp.toFixed(4));
      sec.style.setProperty("--s1-opacity", s1.toFixed(4));
      sec.style.setProperty("--s2-opacity", s2.toFixed(4));

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(-50%, ${scrolled * 0.3}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
      }

      pending = false;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ct2u-hero-pin" style={{ position: "relative" }}>
      <div className="ct2u-hero-sticky">
        {/* Hero video backdrop — atmospheric loop behind all 3 stages.
            Layered: <video> at the back, dark vignette gradient on top so
            text + dashboard stay legible. Muted/autoplay/loop/playsInline
            keeps it inline-playing on mobile per iOS rules. */}
        <div
          aria-hidden
          className="ct2u-hero-video-wrap"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <video
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="ct2u-hero-video"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.95,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              /* Vignette — much lighter pass now that the video itself is
                 close to full opacity. Keep a moderate dark band behind the
                 nav for menu legibility, a very faint mid-tone over the
                 stages, and a soft fade into the page bg at the bottom. */
              background:
                "linear-gradient(180deg, rgba(5,5,7,0.70) 0%, rgba(5,5,7,0.45) 7%, rgba(5,5,7,0.20) 16%, rgba(5,5,7,0.04) 32%, rgba(5,5,7,0.10) 55%, rgba(5,5,7,0.55) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Background layers */}
        <div
          ref={glowRef}
          aria-hidden
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translate3d(-50%, 0, 0)",
            width: 1100,
            height: 700,
            background: `radial-gradient(closest-side, ${accent}22 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
        <div
          ref={gridRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center top, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center top, black 30%, transparent 70%)",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
        {/* Stage 1 — Title: badge + headline (revealed on first scroll) */}
        <div className="ct2u-hero-stage ct2u-hero-stage-1">
          <div
            className="ct2u-stage-above"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 12px 6px 6px",
              borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(10,10,12,0.55)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              fontSize: 12,
              color: "rgba(255,255,255,0.85)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.7)",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 99,
                background: "rgba(227,81,238,0.22)",
                color: accent,
                fontSize: 10.5,
                letterSpacing: "0.08em",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              {t("hero.badge.new")}
            </span>
            <span>{t("hero.badge.text")}</span>
            <span style={{ color: "var(--text-3)" }}>→</span>
          </div>

          <h1
            className="ct2u-aurora-text ct2u-stage-focal"
            style={{
              fontSize: "clamp(56px, 8.4vw, 100px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              filter: `drop-shadow(0 0 24px ${accent}40)`,
              margin: 0,
              lineHeight: 1.02,
            }}
          >
            {t("hero.title.line1")}
            <br />
            {t("hero.title.line2.lead")}{" "}
            <em style={{ fontStyle: "normal" }}>{t("hero.title.line2.emph")}</em>.
          </h1>
        </div>

        {/* Stage 2 — Sub-title: tagline + CTAs (revealed on second scroll) */}
        <div className="ct2u-hero-stage ct2u-hero-stage-2">
          <p
            className="ct2u-stage-above"
            style={{
              fontSize: 19,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 680,
              margin: 0,
              lineHeight: 1.55,
              textShadow: "0 1px 24px rgba(0,0,0,0.55)",
            }}
          >
            {t("hero.subtitle.pre")}{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>{t("hero.subtitle.countries")}</span>
            {t("hero.subtitle.post")}
          </p>
          <div
            className="ct2u-stage-focal"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#trading"
              style={{
                padding: "14px 22px",
                borderRadius: 10,
                background: "rgba(10,10,12,0.55)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.18)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 24px -12px rgba(0,0,0,0.7)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  background: "var(--green)",
                  boxShadow: "0 0 8px var(--green)",
                }}
              />
              {t("hero.cta.viewLive")}
            </a>
          </div>
        </div>

        {/* Persistent CTA — sits at the bottom of the hero video the whole
            time the user is inside the pin (independent of stage opacities). */}
        <div className="ct2u-hero-experience">
          <h2 className="ct2u-hero-experience-title">{t("hero.experience.title")}</h2>
          <a
            className="ct2u-hero-experience-btn"
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
              boxShadow: `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            {t("hero.experience.getStarted")} <span style={{ opacity: 0.7 }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
