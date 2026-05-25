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
    titleKey: "tut.step1.title",
    descKey: "tut.step1.desc",
    video: "/videos/tut-01-register.mp4",
  },
  {
    n: "02",
    titleKey: "tut.step2.title",
    descKey: "tut.step2.desc",
    video: "/videos/tut-02-bind-api.mp4",
  },
  {
    n: "03",
    titleKey: "tut.step3.title",
    descKey: "tut.step3.desc",
    video: "/videos/tut-03-quick-setup.mp4",
  },
  {
    n: "04",
    titleKey: "tut.step4.title",
    descKey: "tut.step4.desc",
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
  const t = useT();
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
      style={{ padding: "84px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
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
                  <div className="ct2u-tut-tab-title">{t(tab.titleKey)}</div>
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
            <TutorialsBackdrop />
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
            </div>
            <div className="ct2u-tut-stage-info" key={current.n}>
              <h3 className="ct2u-tut-stage-title">{t(current.titleKey)}</h3>
              <p className="ct2u-tut-stage-desc">{t(current.descKey)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
   Decorative polygon-mesh backdrop behind the phone. Original SVG — thin
   pink/purple wireframe lines connecting nodes, with a few bright glowing
   intersections and scattered particle dots. Tuned to the brand palette so
   the network mesh recedes into the dark background, only the bright nodes
   really catch the eye.
   ------------------------------------------------------------------------- */
function TutorialsBackdrop() {
  // Hand-picked node coordinates so the polygons stay visually balanced and
  // avoid overlapping the centered phone (≈ x 280-520 of the 800-wide
  // viewBox). Edge connections are listed below.
  // Wider viewBox (1200 vs 800) lets the mesh extend further horizontally
  // beyond the phone — nodes near x=40 and x=1160 peek out past the bezel.
  const nodes: { x: number; y: number; bright?: boolean }[] = [
    { x: 60,   y: 120, bright: true },
    { x: 260,  y: 70 },
    { x: 460,  y: 140 },
    { x: 760,  y: 80,  bright: true },
    { x: 1020, y: 160 },
    { x: 80,   y: 300 },
    { x: 320,  y: 360, bright: true },
    { x: 1080, y: 320 },
    { x: 40,   y: 500 },
    { x: 280,  y: 580 },
    { x: 820,  y: 560, bright: true },
    { x: 1100, y: 480 },
    { x: 140,  y: 730 },
    { x: 460,  y: 780, bright: true },
    { x: 820,  y: 740 },
    { x: 1100, y: 820 },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [1, 5], [2, 6], [3, 6], [4, 7],
    [5, 6], [6, 7],
    [5, 8], [6, 9], [7, 11],
    [8, 9], [9, 10], [10, 11],
    [8, 12], [9, 12], [10, 13], [10, 14], [11, 14],
    [12, 13], [13, 14], [14, 15],
  ];
  // Tiny scattered particle dots (stars) — also re-spread for the wider
  // viewBox so they don't pile up centre-screen.
  const dots = [
    { x: 200, y: 220 }, { x: 580, y: 90 },  { x: 950, y: 240 },
    { x: 220, y: 440 }, { x: 600, y: 400 }, { x: 1020, y: 620 },
    { x: 360, y: 680 }, { x: 680, y: 700 }, { x: 980, y: 380 },
    { x: 500, y: 290 }, { x: 160, y: 620 }, { x: 880, y: 180 },
  ];
  return (
    <div className="ct2u-tut-backdrop" aria-hidden>
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ct2u-tut-bg-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(124,124,255,0.18)" />
            <stop offset="55%" stopColor="rgba(48,12,90,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="ct2u-tut-node-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {/* USDT (Tether) glyph — paths sourced from the local SVG. Each
              path is set to currentColor so we can tint individual <use>
              instances via the `color` attribute. */}
          <symbol id="ct2u-tut-usdt" viewBox="0 0 1024 1024">
            <path
              d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m0-992.969697a480.969697 480.969697 0 1 0 480.969697 480.969697A480.969697 480.969697 0 0 0 512 31.030303z"
              fill="currentColor"
            />
            <path
              d="M574.060606 847.592727h-131.723636a15.515152 15.515152 0 0 1-15.515152-15.515151V416.892121H269.808485a15.515152 15.515152 0 0 1-15.515152-15.515151v-132.809697a15.515152 15.515152 0 0 1 15.515152-15.515152h476.780606a15.515152 15.515152 0 0 1 15.515151 15.515152v132.809697a15.515152 15.515152 0 0 1-15.515151 15.515151H589.575758v415.185455a15.515152 15.515152 0 0 1-15.515152 15.515151z m-116.053333-31.030303H558.545455V401.37697a15.515152 15.515152 0 0 1 15.515151-15.515152h157.013333v-101.779394H285.323636v101.779394h157.013334a15.515152 15.515152 0 0 1 15.515151 15.515152z"
              fill="currentColor"
            />
            <path
              d="M505.018182 632.552727c-141.653333 0-285.168485-31.030303-285.168485-89.367272 0-53.682424 114.501818-80.213333 221.556364-87.195152l2.016969 31.030303C309.061818 496.484848 250.88 528.446061 250.88 543.030303c0 19.859394 89.677576 58.33697 254.138182 58.33697S759.001212 563.044848 759.001212 543.030303c0-14.273939-56.164848-46.545455-186.181818-55.854545l2.327273-31.030303c103.796364 7.447273 214.884848 34.133333 214.884848 86.729697 0 58.957576-143.36 89.677576-285.013333 89.677575z"
              fill="currentColor"
            />
          </symbol>
        </defs>

        {/* Soft purple wash filling the area — gives the mesh something to
            sit on so the dark background doesn't feel flat. */}
        <rect width="1200" height="900" fill="url(#ct2u-tut-bg-glow)" />

        {/* Polygon mesh edges — hairline brand-pink strokes; reduced alpha
            keeps the network subtle behind the phone. */}
        <g
          stroke="rgba(227, 81, 238, 0.18)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        >
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Node halos — small soft glow behind bright nodes. */}
        <g filter="url(#ct2u-tut-node-glow)">
          {nodes
            .filter((n) => n.bright)
            .map((n, i) => (
              <circle
                key={`halo-${i}`}
                cx={n.x}
                cy={n.y}
                r="5"
                fill="rgba(255, 140, 200, 0.7)"
              />
            ))}
        </g>

        {/* Node cores — small filled dots at each junction. */}
        <g>
          {nodes.map((n, i) => (
            <circle
              key={`node-${i}`}
              cx={n.x}
              cy={n.y}
              r={n.bright ? 1.8 : 1.1}
              fill={n.bright ? "rgba(255, 170, 220, 1)" : "rgba(227, 81, 238, 0.55)"}
            />
          ))}
        </g>

        {/* Scattered particle dots — even smaller for the wider canvas. */}
        <g fill="rgba(255, 255, 255, 0.22)">
          {dots.map((d, i) => (
            <circle key={`dot-${i}`} cx={d.x} cy={d.y} r="0.9" />
          ))}
        </g>

        {/* USDT glyphs floating in the network — three instances at
            different sizes/positions, all tinted with low-opacity brand
            purple so they recede into the atmospheric layer. */}
        <use
          href="#ct2u-tut-usdt"
          x={110}
          y={450}
          width={100}
          height={100}
          color="rgba(227, 81, 238, 0.12)"
        />
        <use
          href="#ct2u-tut-usdt"
          x={1010}
          y={170}
          width={75}
          height={75}
          color="rgba(180, 110, 240, 0.14)"
        />
        <use
          href="#ct2u-tut-usdt"
          x={1040}
          y={650}
          width={62}
          height={62}
          color="rgba(227, 81, 238, 0.10)"
        />
      </svg>
    </div>
  );
}
