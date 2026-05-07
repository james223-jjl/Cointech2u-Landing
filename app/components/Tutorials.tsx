"use client";

import { useEffect, useRef, useState } from "react";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

const tabs = [
  {
    n: "01",
    t: "Register an exchange account",
    d: "Walk through creating an account with one of our supported exchanges in under three minutes.",
    video: "/videos/tut-01-register.mp4",
  },
  {
    n: "02",
    t: "Bind Fast API",
    d: "Generate a read-only API key, paste it in, and we verify scopes — withdrawal access is rejected automatically.",
    video: "/videos/tut-02-bind-api.mp4",
  },
  {
    n: "03",
    t: "Quick setup",
    d: "The engine inspects your balance and risk preferences and proposes an initial strategy configuration.",
    video: "/videos/tut-03-quick-setup.mp4",
  },
  {
    n: "04",
    t: "View account performance",
    d: "Open the analytics dashboard for equity curves, position history, and exportable PnL reports.",
    video: "/videos/tut-04-view-performance.mp4",
  },
];

/* Apple-style guided walkthrough.
   – Auto-advances every 9s via a CSS animation on the active tab's progress
     bar (`animationend` → setActive(next)). Pauses when hovered, off-screen,
     or the user prefers reduced motion.  The 9s duration lives in
     globals.css on `.ct2u-tut-tab-progress > span` — change it there.
   – Dual <video> layer crossfade. Two video elements stacked; only the front
     layer is visible (opacity 1). On step change, we set the back layer's src
     and swap front/back in the next frame so the new video starts playing
     under the cover of the still-visible old layer, then fades in. */

export default function Tutorials({ accent = ACCENT }: { accent?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  // Dual-video crossfade — `front` is which layer is currently visible
  const [layerSrcs, setLayerSrcs] = useState<[string, string]>([tabs[0].video, ""]);
  const [front, setFront] = useState<0 | 1>(0);

  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  const current = tabs[active];

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Crossfade videos when `active` changes: load new src into the back layer,
  // then on next frame swap which layer is in front.
  useEffect(() => {
    let raf2 = 0;
    setFront((curFront) => {
      const back = ((curFront + 1) % 2) as 0 | 1;
      setLayerSrcs((srcs) => {
        if (srcs[back] === tabs[active].video) return srcs; // no-op
        const out: [string, string] = [srcs[0], srcs[1]];
        out[back] = tabs[active].video;
        return out;
      });
      return curFront;
    });
    // Two RAFs: one for React to commit the src change, one for the browser
    // to start loading. Then flip front so the new video is visible.
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
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              margin: 0,
              marginBottom: 22,
            }}
          >
            From setup to success
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
            }}
          >
            Walkthrough videos.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Setup, end to end.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Follow our secure step-by-step API guides and start automating in minutes — with full
            control over your exchange funds.
          </p>
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
                        NOW PLAYING
                      </span>
                    )}
                  </div>
                  <div className="ct2u-tut-tab-title">{tab.t}</div>
                  {isActive && (
                    <div
                      className="ct2u-tut-tab-progress"
                      data-paused={isPaused ? "true" : undefined}
                      aria-hidden
                    >
                      {/* `key` re-mounts the span on every active change so
                          the CSS animation restarts from 0% cleanly. */}
                      <span
                        key={i}
                        onAnimationEnd={() => setActive((a) => (a + 1) % tabs.length)}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ct2u-tut-stage">
            <div className="ct2u-tut-stage-video">
              {[0, 1].map((idx) => (
                <video
                  key={idx}
                  src={layerSrcs[idx] || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="ct2u-tut-video"
                  style={{ opacity: front === idx ? 1 : 0 }}
                />
              ))}
              <span className="ct2u-tut-pill mono">
                <span className="ct2u-tut-pill-dot" aria-hidden />
                NOW PLAYING · {current.n}
              </span>
              <span className="mono ct2u-tut-step">
                STEP {String(active + 1).padStart(2, "0")}
                <span style={{ opacity: 0.4 }}> / {String(tabs.length).padStart(2, "0")}</span>
              </span>
            </div>
            <div className="ct2u-tut-stage-info" key={current.n}>
              <h3 className="ct2u-tut-stage-title">{current.t}</h3>
              <p className="ct2u-tut-stage-desc">{current.d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
