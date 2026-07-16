"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

// titleKey + descKey resolve via t() at render time so the walkthrough
// labels swap language with the rest of the page.
const tabs = [
  {
    n: "01",
    titleKey: "tut.step2.title",
    descKey: "tut.step2.desc",
    video: "/videos/tut-02-bind-api.mp4",
    // Source aspect — used to size the mobile inline video container so
    // `object-fit: contain` shows the full frame with zero letterbox.
    aspect: "1280 / 2770",
  },
  {
    n: "02",
    titleKey: "tut.step3.title",
    descKey: "tut.step3.desc",
    video: "/videos/tut-03-quick-setup.mp4",
    aspect: "1280 / 2770",
  },
  {
    n: "03",
    titleKey: "tut.step4.title",
    descKey: "tut.step4.desc",
    video: "/videos/tut-04-view-performance.mp4",
    aspect: "16 / 9",
  },
];

/* Apple-style guided walkthrough.
   – Desktop (≥769px): 2-column grid with the accordion on the left and a
     DCA-card-style video preview on the right.
   – Mobile (≤768px): single column. The right-side preview hides and each
     active accordion item shows its tutorial video INLINE inside the
     expanded panel (3commas-style).
   – Auto-advances every 9s via a CSS animation on the active tab's progress
     bar; pauses on hover / when off-screen / on prefers-reduced-motion. */

export default function Tutorials({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  // Dual-video crossfade for the desktop DcaCard preview.
  const [layerSrcs, setLayerSrcs] = useState<[string, string]>([tabs[0].video, ""]);
  const [front, setFront] = useState<0 | 1>(0);

  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Crossfade videos when `active` changes: load new src into the back
  // layer, then on next frame swap which layer is in front.
  useEffect(() => {
    let raf2 = 0;
    setFront((curFront) => {
      const back = ((curFront + 1) % 2) as 0 | 1;
      setLayerSrcs((srcs) => {
        if (srcs[back] === tabs[active].video) return srcs;
        const out: [string, string] = [srcs[0], srcs[1]];
        out[back] = tabs[active].video;
        return out;
      });
      return curFront;
    });
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setFront((cur) => ((cur + 1) % 2) as 0 | 1);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [active]);

  // Pause auto-advance + spend zero CPU when section is off-screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => setIsVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin: "0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const isPaused = paused || !isVisible || reduced;

  return (
    <section
      ref={sectionRef}
      id="tutorials"
      className="reveal ct2u-section"
      style={{
        padding: "clamp(56px, 8vw, 84px) clamp(16px, 4vw, 32px)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.06em",
              color: accent,
              margin: 0,
              marginBottom: 18,
            }}
          >
            {t("tut.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(38px, 4.6vw, 60px)",
              letterSpacing: "-0.025em",
              marginBottom: 14,
              whiteSpace: "pre-line",
            }}
          >
            {t("tut.title.line1")}
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
              {t("tut.title.line2")}
            </span>
          </h2>
        </div>

        <div
          className="ct2u-tut-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ct2u-tut-tabs">
            {tabs.map((tab, i) => {
              const isActive = active === i;
              return (
                <button
                  key={tab.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  className={
                    "ct2u-tut-tab" + (isActive ? " ct2u-tut-tab--active" : "")
                  }
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="ct2u-tut-tab-row">
                    <span className="mono ct2u-tut-tab-num">{tab.n}</span>
                    {isActive && (
                      <span className="mono ct2u-tut-tab-now">
                        <span className="ct2u-tut-tab-now-dot" aria-hidden />
                        {t("tut.nowPlaying")}
                      </span>
                    )}
                  </div>
                  <div className="ct2u-tut-tab-titlerow">
                    <span className="ct2u-tut-tab-title">{t(tab.titleKey)}</span>
                    <span className="ct2u-tut-tab-chev" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  {isActive && (
                    <div className="ct2u-tut-tab-expanded">
                      {/* Inline video — visible on mobile only (desktop hides it
                          via CSS). The outer .ct2u-tut-tab-video div is the
                          dark frame; the inner div carries the source aspect
                          ratio so the video sits at exactly the right size,
                          no letterbox + no cropping. */}
                      <div className="ct2u-tut-tab-video">
                        <div
                          className="ct2u-tut-tab-video-inner"
                          style={{ aspectRatio: tab.aspect }}
                        >
                          <video
                            key={tab.video}
                            src={tab.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        </div>
                      </div>
                      <p className="ct2u-tut-tab-desc">{t(tab.descKey)}</p>
                      <div
                        className="ct2u-tut-tab-progress"
                        data-paused={isPaused ? "true" : undefined}
                        aria-hidden
                      >
                        <span
                          key={i}
                          onAnimationEnd={() => setActive((a) => (a + 1) % tabs.length)}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right-side preview card — desktop only (hidden on mobile). */}
          <div className="ct2u-tut-stage">
            <DcaCard layerSrcs={layerSrcs} front={front} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Desktop preview card — just the video with a soft frame. Dual-layer
   crossfade on active step change. */
function DcaCard({
  layerSrcs,
  front,
}: {
  layerSrcs: [string, string];
  front: 0 | 1;
}) {
  return (
    <div className="ct2u-dca">
      <div className="ct2u-dca-body">
        {[0, 1].map((idx) => (
          <video
            key={idx}
            src={layerSrcs[idx] || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="ct2u-dca-video"
            style={{ opacity: front === idx ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
