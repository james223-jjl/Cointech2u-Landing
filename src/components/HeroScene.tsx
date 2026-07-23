"use client";

import { useEffect, useRef, useState } from "react";

const SNOISE_GLSL = `
vec3 _m289v3(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 _m289v2(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 _perm(vec3 x){ return _m289v3(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = _m289v2(i);
  vec3 p = _perm(_perm(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0),
                          dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// Convert a plane's triangle indices to a "quads" index buffer (horizontal + vertical line segments only)
function planeToQuads(
  g: { setIndex: (i: number[]) => void },
  segX: number,
  segY: number,
) {
  const indices: number[] = [];
  for (let i = 0; i < segY + 1; i++) {
    let idx11 = 0;
    let idx12 = 0;
    for (let j = 0; j < segX; j++) {
      idx11 = (segX + 1) * i + j;
      idx12 = idx11 + 1;
      const idx22 = idx11 + (segX + 1);
      indices.push(idx11, idx12);
      if (idx22 < (segX + 1) * (segY + 1) - 1) {
        indices.push(idx11, idx22);
      }
    }
    if (idx12 + segX + 1 <= (segX + 1) * (segY + 1) - 1) {
      indices.push(idx12, idx12 + segX + 1);
    }
  }
  g.setIndex(indices);
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover)",
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const lowQ = !desktop;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !lowQ,
        powerPreference: lowQ ? "low-power" : "default",
      });
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, lowQ ? 1.0 : 1.5),
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      const initW = Math.max(1, canvas.clientWidth);
      const initH = Math.max(1, canvas.clientHeight);
      renderer.setSize(initW, initH, false);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(55, initW / initH, 0.1, 200);
      camera.position.set(0, 2.4, 5);
      camera.lookAt(0, -0.8, -4);

      const uTime = { value: 0 };

      const segX = lowQ ? 80 : 160;
      const segY = lowQ ? 80 : 160;
      const terrainGeo = new THREE.PlaneGeometry(80, 80, segX, segY);
      terrainGeo.rotateX(-Math.PI * 0.5);
      planeToQuads(terrainGeo, segX, segY);

      const terrainMat = new THREE.LineBasicMaterial({
        color: 0xe351ee,
        transparent: true,
        opacity: 0.35,
      });

      terrainMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uTime;
        shader.vertexShader = `
          uniform float uTime;
          varying float vN;
          varying vec3 vPos;
          ${SNOISE_GLSL}
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
            float t = uTime * 0.28;
            float posX = position.x - mod(t, 2.0 * sqrt(2.0));
            transformed.x = posX;
            float xShift = posX + t;
            float n = snoise(vec2(xShift, position.z) * 0.085);
            vN = n;
            transformed.y = n * 1.35;
            vPos = transformed;
          `,
        );
        shader.fragmentShader = `
          varying float vN;
          varying vec3 vPos;
          ${shader.fragmentShader}
        `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
            // brand magenta for peaks, deep violet for valleys
            vec3 peak = vec3(0.89, 0.32, 0.93);
            vec3 dip  = vec3(0.32, 0.10, 0.52);
            vec3 col = mix(dip, peak, smoothstep(-0.3, 0.7, vN));
            // distance fade so grid dissolves to horizon
            float d = length(vPos.xz);
            float fade = 1.0 - smoothstep(10.0, 22.0, d);
            vec4 diffuseColor = vec4( col, opacity * fade );
          `,
        );
      };

      const terrain = new THREE.LineSegments(terrainGeo, terrainMat);
      terrain.position.y = -0.9;
      const tScale = lowQ ? 0.07 : 0.19;
      terrain.scale.set(tScale, tScale, tScale);
      scene.add(terrain);

      // ---- floating logo (SVG → extruded wireframe) ----
      let logoGroup: InstanceType<typeof THREE.Group> | null = null;
      let logoMat: InstanceType<typeof THREE.LineBasicMaterial> | null = null;
      let hitProxy: InstanceType<typeof THREE.Mesh> | null = null;
      let hitProxyMat: InstanceType<typeof THREE.MeshBasicMaterial> | null =
        null;
      const logoGeos: InstanceType<typeof THREE.BufferGeometry>[] = [];

      try {
        const svgLoaderMod = await import(
          "three/addons/loaders/SVGLoader.js"
        );
        const { SVGLoader } = svgLoaderMod;
        const loader = new SVGLoader();
        const svgData = await new Promise<
          Awaited<ReturnType<typeof loader.loadAsync>>
        >((resolve, reject) => {
          loader.load(
            "/logo.svg",
            (d) => resolve(d),
            undefined,
            (e) => reject(e),
          );
        });

        if (!cancelled) {
          const shapes: InstanceType<typeof THREE.Shape>[] = [];
          for (const p of svgData.paths) {
            for (const s of SVGLoader.createShapes(p)) shapes.push(s);
          }

          // Extrude each shape into slim 3D geometry
          const extruded = shapes.map((s) =>
            new THREE.ExtrudeGeometry(s, {
              depth: 3.5,
              bevelEnabled: false,
              curveSegments: lowQ ? 6 : 10,
            }),
          );

          // Compute combined bounds → center origin
          const min = new THREE.Vector3(
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
          );
          const max = new THREE.Vector3(
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
          );
          for (const g of extruded) {
            g.computeBoundingBox();
            if (g.boundingBox) {
              min.min(g.boundingBox.min);
              max.max(g.boundingBox.max);
            }
          }
          const cx = (min.x + max.x) * 0.5;
          const cy = (min.y + max.y) * 0.5;
          const cz = (min.z + max.z) * 0.5;
          const svgWidth = Math.max(0.0001, max.x - min.x);
          const svgHeight = Math.max(0.0001, max.y - min.y);
          const svgDepth = Math.max(0.0001, max.z - min.z);

          logoGroup = new THREE.Group();
          logoMat = new THREE.LineBasicMaterial({
            color: 0xe351ee,
            transparent: true,
            opacity: lowQ ? 0.75 : 1.0,
          });

          for (const g of extruded) {
            g.translate(-cx, -cy, -cz);
            const edges = new THREE.EdgesGeometry(g, 18);
            logoGeos.push(g, edges);
            const mesh = new THREE.LineSegments(edges, logoMat);
            logoGroup.add(mesh);
          }

          // Invisible hit proxy that follows the logo — generous box for raycast picking
          hitProxyMat = new THREE.MeshBasicMaterial({ visible: false });
          const hitGeo = new THREE.BoxGeometry(
            svgWidth * 1.1,
            svgHeight * 1.1,
            svgDepth,
          );
          hitProxy = new THREE.Mesh(hitGeo, hitProxyMat);
          logoGeos.push(hitGeo);
          logoGroup.add(hitProxy);

          const targetWidth = lowQ ? 0.55 : 2.0;
          const s = targetWidth / svgWidth;
          // Flip Y because SVG Y-axis is down, Three is up
          logoGroup.scale.set(s, -s, s);
          logoGroup.position.set(0.0, 1.15, 0.0);
          scene.add(logoGroup);
        }
      } catch (err) {
        console.warn("[HeroScene] logo SVG load failed:", err);
      }

      if (cancelled) return;

      const resize = () => {
        const w = Math.max(1, canvas.clientWidth);
        const h = Math.max(1, canvas.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resize();

      let rafId = 0;
      let firstFrameDone = false;
      let start = performance.now();
      let pausedAt: number | null = null;

      // --- mobile: anchor logo to the right of the Start-trading-free button ---
      const ctaEl = document.querySelector<HTMLElement>(
        '[data-hero-cta="start"]',
      );
      const anchorScene = new THREE.Vector3(0.35, 1.0, 0);
      const ndcTmp = new THREE.Vector3();

      const recomputeAnchor = () => {
        if (!ctaEl || !canvas) return;
        const cR = canvas.getBoundingClientRect();
        const bR = ctaEl.getBoundingClientRect();
        if (cR.width <= 0 || cR.height <= 0) return;

        // Target screen point: just past the button's right edge, vertically centered
        const targetPxX = bR.right + 24;
        const targetPxY = bR.top + bR.height / 2;

        const ndcX = ((targetPxX - cR.left) / cR.width) * 2 - 1;
        const ndcY = -(((targetPxY - cR.top) / cR.height) * 2 - 1);

        ndcTmp.set(ndcX, ndcY, 0.5);
        ndcTmp.unproject(camera);
        const dir = ndcTmp.sub(camera.position).normalize();
        // Intersect ray with z=0 plane (matches the camera's focal plane for content)
        const tPlane = -camera.position.z / dir.z;
        anchorScene.copy(camera.position).addScaledVector(dir, tPlane);
      };
      recomputeAnchor();

      // Mouse parallax — target from pointer, smoothed each frame
      const mouseTarget = { x: 0, y: 0 };
      const mouseSmoothed = { x: 0, y: 0 };
      const heroSection = canvas.closest("section");

      const onMouseMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        mouseTarget.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouseTarget.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      };
      const onMouseLeave = () => {
        mouseTarget.x = 0;
        mouseTarget.y = 0;
      };

      const onTouch = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const r = canvas.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        mouseTarget.x = ((touch.clientX - r.left) / r.width) * 2 - 1;
        mouseTarget.y = -(((touch.clientY - r.top) / r.height) * 2 - 1);
      };
      const onTouchEnd = () => {
        mouseTarget.x = 0;
        mouseTarget.y = 0;
      };

      heroSection?.addEventListener("mousemove", onMouseMove);
      heroSection?.addEventListener("mouseleave", onMouseLeave);
      heroSection?.addEventListener("touchstart", onTouch, { passive: true });
      heroSection?.addEventListener("touchmove", onTouch, { passive: true });
      heroSection?.addEventListener("touchend", onTouchEnd);
      heroSection?.addEventListener("touchcancel", onTouchEnd);

      // ---- drag-to-rotate the logo (raycast-gated; empty space stays inert) ----
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      let dragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let userRotXStart = 0;
      let userRotYStart = 0;
      let userRotX = 0;
      let userRotY = 0;
      let bobFreezeY: number | null = null;
      const clamp = (v: number, lo: number, hi: number) =>
        Math.max(lo, Math.min(hi, v));

      // Ambient rotation = what the logo does without user input. Used to bake
      // continuity at drag start/end so handing off control doesn't pop.
      const ambientNow = () => {
        if (lowQ) return { x: 0, y: 0 };
        const tn = (performance.now() - start) * 0.001;
        return {
          x: Math.sin(tn * 0.25 + 0.6) * 0.12 - mouseSmoothed.y * 0.22,
          y: Math.sin(tn * 0.35) * 0.45 + mouseSmoothed.x * 0.35,
        };
      };

      const onPointerDown = (e: PointerEvent) => {
        if (!hitProxy || !logoGroup) return;
        // Only start a drag from empty hero space — buttons/text/phone widget keep their clicks.
        if (e.target !== heroSection) return;
        const r = canvas.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.intersectObject(hitProxy, false).length === 0) return;

        // Bake current ambient INTO userRot so the visual rotation is continuous
        // when ambient gets suppressed for the drag.
        const a = ambientNow();
        userRotX += a.x;
        userRotY += a.y;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        userRotXStart = userRotX;
        userRotYStart = userRotY;
        // Freeze the position-Y bob at its current value so it doesn't fight
        // the gesture on the same screen axis as vertical drag.
        const tn = (performance.now() - start) * 0.001;
        bobFreezeY = 1.1 + Math.sin(tn * 0.5) * 0.18;
        dragging = true;
        e.preventDefault();
        try {
          heroSection?.setPointerCapture(e.pointerId);
        } catch {
          /* some browsers throw if the section isn't focusable */
        }
      };

      const onPointerDrag = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        userRotY = clamp(userRotYStart + dx * 0.01, -1.2, 1.2);
        userRotX = clamp(userRotXStart + dy * 0.01, -1.2, 1.2);
      };

      const onPointerEnd = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        bobFreezeY = null;
        // Bake current ambient OUT of userRot so the springback to 0 lands
        // on the live ambient, not on raw zero (which would pop).
        const a = ambientNow();
        userRotX -= a.x;
        userRotY -= a.y;
        try {
          heroSection?.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };

      heroSection?.addEventListener("pointerdown", onPointerDown);
      heroSection?.addEventListener("pointermove", onPointerDrag);
      heroSection?.addEventListener("pointerup", onPointerEnd);
      heroSection?.addEventListener("pointercancel", onPointerEnd);

      const frame = () => {
        const now = performance.now();
        const t = (now - start) * 0.001;
        uTime.value = t;

        // Damped interpolation so the parallax feels smooth, not twitchy
        mouseSmoothed.x += (mouseTarget.x - mouseSmoothed.x) * 0.08;
        mouseSmoothed.y += (mouseTarget.y - mouseSmoothed.y) * 0.08;

        // Spring user rotation back to 0 only when not actively dragging.
        // While dragging, leave userRot exactly where the pointer put it.
        if (!dragging) {
          userRotX += (0 - userRotX) * 0.08;
          userRotY += (0 - userRotY) * 0.08;
        }

        if (logoGroup) {
          if (lowQ) {
            logoGroup.rotation.x = userRotX;
            logoGroup.rotation.y = userRotY;
            logoGroup.position.x = anchorScene.x + mouseSmoothed.x * 0.9;
            logoGroup.position.y = anchorScene.y + mouseSmoothed.y * 0.7;
          } else if (dragging) {
            // Drag has full control — ambient wave + parallax suppressed and
            // the position-Y bob frozen so vertical gesture isn't fought on
            // the same screen axis.
            logoGroup.rotation.y = userRotY;
            logoGroup.rotation.x = userRotX;
            logoGroup.position.y = bobFreezeY ?? 1.1;
          } else {
            const baseYRot = Math.sin(t * 0.35) * 0.45;
            const baseXRot = Math.sin(t * 0.25 + 0.6) * 0.12;
            logoGroup.rotation.y =
              baseYRot + mouseSmoothed.x * 0.35 + userRotY;
            logoGroup.rotation.x =
              baseXRot - mouseSmoothed.y * 0.22 + userRotX;
            logoGroup.position.y = 1.1 + Math.sin(t * 0.5) * 0.18;
          }
        }

        renderer.render(scene, camera);
        if (!firstFrameDone) {
          firstFrameDone = true;
          setVisible(true);
        }
        rafId = requestAnimationFrame(frame);
      };

      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
          pausedAt = performance.now();
        } else if (pausedAt !== null) {
          start += performance.now() - pausedAt;
          pausedAt = null;
          rafId = requestAnimationFrame(frame);
        }
      };

      const onResize = () => {
        resize();
        recomputeAnchor();
      };

      const bootId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(frame);
      });

      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        cancelAnimationFrame(bootId);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        heroSection?.removeEventListener("mousemove", onMouseMove);
        heroSection?.removeEventListener("mouseleave", onMouseLeave);
        heroSection?.removeEventListener("touchstart", onTouch);
        heroSection?.removeEventListener("touchmove", onTouch);
        heroSection?.removeEventListener("touchend", onTouchEnd);
        heroSection?.removeEventListener("touchcancel", onTouchEnd);
        heroSection?.removeEventListener("pointerdown", onPointerDown);
        heroSection?.removeEventListener("pointermove", onPointerDrag);
        heroSection?.removeEventListener("pointerup", onPointerEnd);
        heroSection?.removeEventListener("pointercancel", onPointerEnd);
        terrainGeo.dispose();
        terrainMat.dispose();
        for (const g of logoGeos) g.dispose();
        logoMat?.dispose();
        hitProxyMat?.dispose();
        renderer.dispose();
      };
    })().catch((err) => {
      console.warn("[HeroScene] init failed:", err);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
      style={{
        opacity: visible ? 1 : 0,
        mixBlendMode: "screen",
        maskImage:
          "linear-gradient(180deg, transparent 0%, transparent 28%, black 55%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, transparent 28%, black 55%, black 100%)",
      }}
      aria-hidden="true"
    />
  );
}
