"use client";

import { useEffect, useRef } from "react";
import HeroDashboard from "./HeroDashboard";
import LogoParticlesScene from "./v3/LogoParticles";
import { ACCENT } from "./theme";

export default function Hero({ accent = ACCENT }: { accent?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const blurFilterRef = useRef<SVGFEGaussianBlurElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let pending = false;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    let lastY = window.scrollY;
    let lastT = performance.now();
    let smoothVel = 0; // px/ms, low-pass filtered

    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const hp = total > 0 ? clamp01(scrolled / total) : 0;

      // Stage opacities — sequential, very brief overlaps so the title's
      // motion blur doesn't bleed visually into stage 2's tagline/CTAs.
      // s1 fully gone by hp=0.38; s2 starts fading in at 0.40.
      const s1Lin = clamp01(1 - (hp - 0.25) * 8);
      const s1 = s1Lin * s1Lin;
      const s2In = clamp01((hp - 0.40) * 7);
      const s2Out = clamp01(1 - (hp - 0.65) * 6);
      const s2 = Math.min(s2In, s2Out);
      const s3 = clamp01((hp - 0.78) * 6);

      // Scroll velocity → vertical motion blur (smoothed via EMA).
      // Lower caps so the smear stays inside the title's row.
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const instVel = (window.scrollY - lastY) / dt;
      smoothVel = smoothVel * 0.85 + instVel * 0.15;
      lastY = window.scrollY;
      lastT = now;
      // Triangle: blur peaks while title is mid-transition, returns to 0
      // when title is fully visible OR fully gone — so it never streaks
      // while invisible behind stage 2.
      const triBlur = 4 * s1 * (1 - s1) * 9; // peak ~9px at s1=0.5
      const velBlur = Math.min(5, Math.abs(smoothVel) * 1.5);
      const totalBlur = Math.min(12, triBlur + velBlur);
      blurFilterRef.current?.setAttribute("stdDeviation", `0 ${totalBlur.toFixed(2)}`);

      sec.style.setProperty("--hp", hp.toFixed(4));
      sec.style.setProperty("--s1-opacity", s1.toFixed(4));
      sec.style.setProperty("--s2-opacity", s2.toFixed(4));
      sec.style.setProperty("--s3-opacity", s3.toFixed(4));

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(-50%, ${scrolled * 0.3}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `translate3d(-50%, ${scrolled * 0.18}px, 0)`;
      }

      pending = false;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    // Continuous rAF loop — decays velocity smoothly when scrolling stops.
    const tick = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const instVel = (window.scrollY - lastY) / dt;
      smoothVel = smoothVel * 0.9 + instVel * 0.1;
      lastY = window.scrollY;
      lastT = now;
      const sec = sectionRef.current;
      const s1 = sec
        ? parseFloat(sec.style.getPropertyValue("--s1-opacity") || "1")
        : 1;
      const triBlur = 4 * s1 * (1 - s1) * 9;
      const velBlur = Math.min(5, Math.abs(smoothVel) * 1.5);
      const totalBlur = Math.min(12, triBlur + velBlur);
      blurFilterRef.current?.setAttribute("stdDeviation", `0 ${totalBlur.toFixed(2)}`);
      raf = requestAnimationFrame(tick);
    };

    update();
    raf = requestAnimationFrame(tick);
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
      {/* Hidden SVG filter — vertical-only Gaussian blur for the title.
          Filter region is generously expanded so vertical blur won't clip. */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter
            id="ct2u-h1-blur"
            x="-2%"
            y="-30%"
            width="104%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur ref={blurFilterRef} stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>

      <div className="ct2u-hero-sticky">
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
          }}
        >
          <LogoParticlesScene transparent />
        </div>

        {/* Stage 1 — Badge + H1 */}
        <div className="ct2u-hero-stage ct2u-hero-stage-1">
          <div
            className="reveal ct2u-stage-above"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 12px 6px 6px",
              borderRadius: 99,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.025)",
              fontSize: 12,
              color: "var(--text-2)",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 99,
                background: "rgba(227,81,238,0.12)",
                color: accent,
                fontSize: 10.5,
                letterSpacing: "0.08em",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              NEW
            </span>
            <span>Adaptive execution engine v4 — now in production</span>
            <span style={{ color: "var(--text-3)" }}>→</span>
          </div>

          <h1
            className="reveal ct2u-aurora-text ct2u-stage-focal ct2u-h1-mask"
            style={{
              fontSize: "clamp(58px, 8.5vw, 96px)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              filter: `drop-shadow(0 0 24px ${accent}40)`,
              margin: 0,
            }}
          >
            <span className="ct2u-h1-line">
              <span className="ct2u-h1-line-inner">Trade intelligence,</span>
            </span>
            <span className="ct2u-h1-line">
              <span className="ct2u-h1-line-inner">
                not <em style={{ fontStyle: "normal" }}>emotion</em>.
              </span>
            </span>
          </h1>
        </div>

        {/* Stage 2 — Tagline + CTAs */}
        <div className="ct2u-hero-stage ct2u-hero-stage-2">
          <p
            className="ct2u-stage-above"
            style={{
              fontSize: 19,
              color: "var(--text-2)",
              maxWidth: 680,
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Stay ahead of every market move with AI-powered precision, real-time analytics, and
            verified intelligence — built for traders across{" "}
            <span style={{ color: "var(--text)" }}>100+ countries</span>.
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
              href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 22px",
                borderRadius: 10,
                background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
              }}
            >
              Get started <span style={{ opacity: 0.7 }}>→</span>
            </a>
            <a
              href="#trading"
              style={{
                padding: "14px 22px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                color: "var(--text)",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid var(--line-strong)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
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
              View live performance
            </a>
          </div>
        </div>

        {/* Stage 3 — Live dashboard */}
        <div className="ct2u-hero-stage ct2u-hero-stage-3">
          <div
            className="float-soft ct2u-stage-focal"
            style={{ margin: "0 auto", position: "relative" }}
          >
            <HeroDashboard accent={accent} />
          </div>
        </div>
      </div>
    </section>
  );
}
