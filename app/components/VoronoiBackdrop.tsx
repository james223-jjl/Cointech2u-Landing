"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Delaunay } from "d3-delaunay";

/* Voronoi panel backdrop — Glass-Hero style chamfered panels.
   Sizes to its parent (must be position: relative + clipped).
   Cursor pushes nearby seeds away with cubic falloff; idle drift via
   dual-sine; Lloyd's relaxation runs once on init for even cells.
   Pauses RAF when off-screen and freezes drift on prefers-reduced-motion. */

const RELAX_ITERATIONS = 4;
const SPRING_K = 0.07;
const SPRING_DAMP = 0.82;

type Seed = { baseX: number; baseY: number; phase: number };
type Vec2 = { x: number; y: number };

type Props = {
  /** Voronoi cell count. Default 5 reads well at section size; 3 fits inside a card. */
  numPoints?: number;
  /** px — distance at which cursor influences seeds. Scale down for small canvases. */
  mouseRadius?: number;
  /** px — peak displacement of seed nearest the cursor. */
  mouseForce?: number;
  /** px — idle wander amplitude per seed. */
  driftAmp?: number;
  /**
   * Optional anchored seed placement as [xRatio, yRatio] pairs in [0..1].
   * Skips ring + Lloyd's relaxation so each cell stays paired with its anchor
   * (e.g. one Voronoi panel per card in a 2×2 grid). Pass a stable reference
   * — define at module scope or memoize.
   */
  seedAnchors?: ReadonlyArray<readonly [number, number]>;
  /**
   * Element refs to clip-path each frame. Index i clips to cell i.
   * When provided the canvas only draws boundary lines (no fills/chamfer),
   * so each card's own background shows through its Voronoi-shaped clip.
   * Cards pair with cells by index — typically used together with seedAnchors.
   */
  cardRefs?: ReadonlyArray<RefObject<HTMLElement | null>>;
  /** px — polygon inset toward centroid before clip-path is applied. Creates
   *  a visible gap between cards so the canvas's boundary lines glow through. */
  clipInset?: number;
  /** Below this viewport width, clip-path + canvas drawing are suspended.
   *  Cards return to their normal rectangular layout (CSS handles the stack). */
  mobileBreakpoint?: number;
  /** px — hard cap on seed displacement from its anchor. Limits how dramatic
   *  the cell deformation can get. Defaults to Infinity (no cap). For
   *  near-rectangular Voronoi panels, cap to ~5–8% of canvas dimension. */
  maxOffset?: number;
};

export default function VoronoiBackdrop({
  numPoints = 5,
  mouseRadius = 320,
  mouseForce = 90,
  driftAmp = 18,
  seedAnchors,
  cardRefs,
  clipInset = 4,
  mobileBreakpoint = 768,
  maxOffset = Infinity,
}: Props = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    const seeds: Seed[] = [];
    const live: Vec2[] = [];
    const vel: Vec2[] = [];
    const mouse = { x: -1e6, y: -1e6 };
    const aim = { x: -1e6, y: -1e6 };

    const tracePoly = (poly: ArrayLike<[number, number]>) => {
      ctx.beginPath();
      ctx.moveTo(poly[0][0], poly[0][1]);
      for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
      ctx.closePath();
    };

    const lloydStep = () => {
      const d = Delaunay.from(seeds.map((p) => [p.baseX, p.baseY]));
      const v = d.voronoi([0, 0, width, height]);
      for (let i = 0; i < seeds.length; i++) {
        const poly = v.cellPolygon(i);
        if (!poly) continue;
        let cx = 0;
        let cy = 0;
        const n = poly.length - 1; // last vertex repeats first
        for (let j = 0; j < n; j++) {
          cx += poly[j][0];
          cy += poly[j][1];
        }
        seeds[i].baseX = cx / n;
        seeds[i].baseY = cy / n;
        live[i].x = seeds[i].baseX;
        live[i].y = seeds[i].baseY;
      }
    };

    const init = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seeds.length = 0;
      live.length = 0;
      vel.length = 0;

      if (seedAnchors && seedAnchors.length > 0) {
        // Anchored placement — each seed pinned to its [xRatio, yRatio].
        // Skip ring/relaxation so each cell stays paired with its anchor.
        for (const [rx, ry] of seedAnchors) {
          const x = rx * width;
          const y = ry * height;
          seeds.push({ baseX: x, baseY: y, phase: Math.random() * Math.PI * 2 });
          live.push({ x, y });
          vel.push({ x: 0, y: 0 });
        }
      } else {
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2 + Math.random() * 0.5;
          const r = Math.min(width, height) * 0.30 * (0.55 + Math.random() * 0.5);
          const x = width / 2 + Math.cos(angle) * r + (Math.random() - 0.5) * 120;
          const y = height / 2 + Math.sin(angle) * r + (Math.random() - 0.5) * 120;
          seeds.push({ baseX: x, baseY: y, phase: Math.random() * Math.PI * 2 });
          live.push({ x, y });
          vel.push({ x: 0, y: 0 });
        }
        for (let n = 0; n < RELAX_ITERATIONS; n++) lloydStep();
      }
    };

    /** Inset polygon vertices toward the centroid by `inset` px — but ONLY
     *  for interior vertices. Vertices touching the canvas extent get snapped
     *  exactly to that extent and never moved, so the assembled outer
     *  perimeter of all cells stays a perfect 0..W × 0..H rectangle. */
    const EDGE_TOL = 1; // px: how close to extent before we treat as "on edge"
    const insetPoly = (poly: ArrayLike<[number, number]>, inset: number): [number, number][] => {
      const n = poly.length - 1; // last vertex repeats first in d3-delaunay output
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < n; i++) {
        cx += poly[i][0];
        cy += poly[i][1];
      }
      cx /= n;
      cy /= n;
      const out: [number, number][] = [];
      for (let i = 0; i < poly.length; i++) {
        let x = poly[i][0];
        let y = poly[i][1];

        const onLeft = x < EDGE_TOL;
        const onRight = x > width - EDGE_TOL;
        const onTop = y < EDGE_TOL;
        const onBottom = y > height - EDGE_TOL;

        if (onLeft || onRight || onTop || onBottom) {
          // Snap to the extent boundary, do NOT inset — keeps the outer
          // perimeter strictly locked at 0%/100%.
          if (onLeft) x = 0;
          else if (onRight) x = width;
          if (onTop) y = 0;
          else if (onBottom) y = height;
          out.push([x, y]);
        } else {
          // Interior vertex (e.g. the cross point at the grid centre) — pull
          // toward centroid to create a visible gap on internal edges only.
          const dx = x - cx;
          const dy = y - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < inset) {
            out.push([cx, cy]);
          } else {
            const f = (len - inset) / len;
            out.push([cx + dx * f, cy + dy * f]);
          }
        }
      }
      return out;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const d = Delaunay.from(live.map((p) => [p.x, p.y]));
      const v = d.voronoi([0, 0, width, height]);
      const isMobile = window.innerWidth < mobileBreakpoint;
      const useClipPath = !!cardRefs && !isMobile;

      if (useClipPath) {
        // Card-clipping mode: cards become Voronoi-shaped via clip-path; canvas
        // draws layered glow lines through the inset gaps — soft halo + crisp
        // core line — so the boundaries read as a beveled edge, not a hairline.
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Soft halo (wide, low alpha) — sells the chamfer "thickness"
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i < live.length; i++) {
          const poly = v.cellPolygon(i);
          if (!poly) continue;
          tracePoly(poly);
          ctx.stroke();
        }

        // Core line (sharp, brighter)
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
        for (let i = 0; i < live.length; i++) {
          const poly = v.cellPolygon(i);
          if (!poly) continue;
          tracePoly(poly);
          ctx.stroke();
        }
        // Apply clip-paths (inset) to each ref'd card
        for (let i = 0; i < live.length && cardRefs && i < cardRefs.length; i++) {
          const card = cardRefs[i]?.current;
          if (!card) continue;
          const poly = v.cellPolygon(i);
          if (!poly) continue;
          const inset = clipInset > 0 ? insetPoly(poly, clipInset) : (poly as [number, number][]);
          // Convert grid-local polygon coords to card-local (card.offsetLeft/Top
          // are relative to the grid, which is the canvas's parent + card's offsetParent).
          const ox = card.offsetLeft;
          const oy = card.offsetTop;
          let s = "polygon(";
          for (let j = 0; j < inset.length; j++) {
            const px = inset[j][0] - ox;
            const py = inset[j][1] - oy;
            if (j > 0) s += ", ";
            s += px.toFixed(1) + "px " + py.toFixed(1) + "px";
          }
          s += ")";
          card.style.clipPath = s;
        }
      } else {
        // Standalone mode (no cardRefs): draw fills + chamfer + outline.
        // Pass 1 — fill + radial gradient (depth fake)
        for (let i = 0; i < live.length; i++) {
          const poly = v.cellPolygon(i);
          if (!poly) continue;

          ctx.save();
          tracePoly(poly);
          ctx.fillStyle = "#111";
          ctx.fill();

          tracePoly(poly);
          ctx.clip();
          const grad = ctx.createRadialGradient(live[i].x, live[i].y, 0, live[i].x, live[i].y, 580);
          grad.addColorStop(0, "rgba(28, 28, 32, 1)");
          grad.addColorStop(0.7, "#0E0E10");
          grad.addColorStop(1, "rgba(7, 7, 9, 1)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // Pass 2 — clipped wide strokes (chamfer rim)
        for (let i = 0; i < live.length; i++) {
          const poly = v.cellPolygon(i);
          if (!poly) continue;

          ctx.save();
          tracePoly(poly);
          ctx.clip();

          tracePoly(poly);
          ctx.lineWidth = 18;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.stroke();

          tracePoly(poly);
          ctx.lineWidth = 4;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
          ctx.stroke();

          ctx.restore();
        }

        // Pass 3 — crisp boundary stroke
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.20)";
        for (let i = 0; i < live.length; i++) {
          const poly = v.cellPolygon(i);
          if (!poly) continue;
          tracePoly(poly);
          ctx.stroke();
        }
      }
    };

    let t = 0;
    let raf = 0;
    let isVisible = true;
    let cancelled = false;

    const frame = () => {
      if (cancelled) return;

      if (isVisible && !document.hidden) {
        if (!reduced) t += 0.016;

        mouse.x += (aim.x - mouse.x) * 0.14;
        mouse.y += (aim.y - mouse.y) * 0.14;

        const drift = reduced ? 0 : driftAmp;

        for (let i = 0; i < seeds.length; i++) {
          const s = seeds[i];

          const driftX =
            Math.sin(t * 0.30 + s.phase) * drift +
            Math.cos(t * 0.45 + s.phase * 1.3) * drift * 0.55;
          const driftY =
            Math.cos(t * 0.35 + s.phase) * drift +
            Math.sin(t * 0.50 + s.phase * 0.7) * drift * 0.55;

          let targetX = s.baseX + driftX;
          let targetY = s.baseY + driftY;

          const dx = live[i].x - mouse.x;
          const dy = live[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            // Edge-proximity falloff: peaks at half mouseRadius (cursor ≈ at the
            // cell boundary), zero at seed center and at outer rim. Quadratic
            // triangular pulse — smoother than a hard triangle.
            const u = (dist / mouseRadius) * 2 - 1; // -1..1
            const f = 1 - u * u; // 1 at u=0 (mid), 0 at u=±1
            const force = f * f * mouseForce;
            targetX += (dx / (dist || 1)) * force;
            targetY += (dy / (dist || 1)) * force;
          }

          // Clamp displacement from anchor — keeps cells "near-rectangular"
          // by hard-capping how far each seed can stray from its baseX/baseY.
          if (maxOffset !== Infinity) {
            const ox = targetX - s.baseX;
            const oy = targetY - s.baseY;
            const odist = Math.sqrt(ox * ox + oy * oy);
            if (odist > maxOffset) {
              const k2 = maxOffset / odist;
              targetX = s.baseX + ox * k2;
              targetY = s.baseY + oy * k2;
            }
          }

          vel[i].x = vel[i].x * SPRING_DAMP + (targetX - live[i].x) * SPRING_K;
          vel[i].y = vel[i].y * SPRING_DAMP + (targetY - live[i].y) * SPRING_K;
          live[i].x += vel[i].x;
          live[i].y += vel[i].y;
        }

        render();
      }
      raf = requestAnimationFrame(frame);
    };

    init();

    const ro = new ResizeObserver(() => init());
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    // Window-level pointer tracking — works whether canvas is interactive or
    // sitting under content with pointer-events: none.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      aim.x = e.clientX - rect.left;
      aim.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      aim.x = -1e6;
      aim.y = -1e6;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    frame();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      // Clear any clip-paths we applied so the cards don't keep stale shapes
      if (cardRefs) {
        for (const ref of cardRefs) {
          if (ref?.current) ref.current.style.clipPath = "";
        }
      }
    };
  }, [numPoints, mouseRadius, mouseForce, driftAmp, seedAnchors, cardRefs, clipInset, mobileBreakpoint, maxOffset]);

  return <canvas ref={canvasRef} aria-hidden className="ct2u-voronoi-backdrop" />;
}
