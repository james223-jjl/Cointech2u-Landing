"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2000;
const TARGET_SIZE = 5;
const RASTER_SIZE = 256;
const ALPHA_THRESHOLD = 32;
const OUTLINE_RATIO = 0.4;     // % of particles that hug the silhouette edge
const EDGE_NEIGHBORHOOD = 2;   // pixels — width of the edge band
const EDGE_PARTICLE_SIZE = 4.5;
const INTERIOR_PARTICLE_SIZE = 2.5;

const vertexShader = /* glsl */ `
  uniform float time;
  uniform float progress;

  attribute vec3 aRandom;
  attribute vec3 aLogo;
  attribute float aDelay;
  attribute float aSize;
  attribute float aType;

  varying float vType;
  varying float vY;

  float ease(float t) {
    return t < 0.5
      ? 2.0 * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
  }

  void main() {
    float d = aDelay * 0.5;
    float p = clamp((progress - d) / (1.0 - d), 0.0, 1.0);
    p = ease(p);

    // Noise fades out as particles assemble, so the formed logo holds steady.
    vec3 noise = vec3(
      sin(aRandom.x + time * 1.5),
      cos(aRandom.y + time * 1.2),
      sin(aRandom.z + time)
    ) * (0.1 * (1.0 - p));

    vec3 pos = mix(aRandom, aLogo, p) + noise;

    vType = aType;
    vY = aLogo.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (0.8 + p * 0.5);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vType;
  varying float vY;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Vertical gradient: deep purple at the bottom → bright pink at the top.
    float grad = clamp((vY + 2.0) / 4.0, 0.0, 1.0);
    vec3 colPurple = vec3(0.5, 0.1, 0.9);
    vec3 colPink   = vec3(1.0, 0.3, 0.7);
    vec3 color = mix(colPurple, colPink, grad);

    // Edge particles (vType = 1) get a brightness boost.
    color += vType * 0.2;

    float alpha = smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(color, alpha);
  }
`;

type Buffers = {
  position: Float32Array;
  aRandom: Float32Array;
  aLogo: Float32Array;
  aDelay: Float32Array;
  aSize: Float32Array;
  aType: Float32Array;
};

type LogoSample = {
  logo: Float32Array;
  aSize: Float32Array;
  aType: Float32Array;
};

function generateRandomBuffers(): { rand: Float32Array; delays: Float32Array } {
  const rand = new Float32Array(COUNT * 3);
  const delays = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    rand[i * 3]     = (Math.random() - 0.5) * 12;
    rand[i * 3 + 1] = (Math.random() - 0.5) * 7;
    rand[i * 3 + 2] = (Math.random() - 0.5) * 6;
    delays[i] = Math.random();
  }
  return { rand, delays };
}

// Rasterize the SVG to a canvas, then sample COUNT random non-transparent
// pixels and map them into world space — uniform fill density across the
// entire logo silhouette regardless of path complexity.
function loadLogoPositions(src: string): Promise<LogoSample> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = RASTER_SIZE;
      canvas.height = RASTER_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("2D canvas context unavailable"));
        return;
      }

      // Preserve aspect ratio: fit the image inside the canvas, centered.
      const imgAspect = img.width / img.height;
      let drawW = RASTER_SIZE;
      let drawH = RASTER_SIZE;
      if (imgAspect > 1) drawH = RASTER_SIZE / imgAspect;
      else drawW = RASTER_SIZE * imgAspect;
      const offsetX = (RASTER_SIZE - drawW) / 2;
      const offsetY = (RASTER_SIZE - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      const data = ctx.getImageData(0, 0, RASTER_SIZE, RASTER_SIZE).data;

      // Collect every pixel above the alpha threshold as a candidate.
      const candidates: Array<[number, number]> = [];
      for (let y = 0; y < RASTER_SIZE; y++) {
        for (let x = 0; x < RASTER_SIZE; x++) {
          if (data[(y * RASTER_SIZE + x) * 4 + 3] > ALPHA_THRESHOLD) {
            candidates.push([x, y]);
          }
        }
      }

      if (candidates.length === 0) {
        reject(new Error("Logo has no non-transparent pixels"));
        return;
      }

      // Classify each candidate as edge (has a transparent neighbor within
      // EDGE_NEIGHBORHOOD pixels) or interior. The edge pool will be sampled
      // at OUTLINE_RATIO density to crisp the silhouette.
      const isOpaque = (x: number, y: number): boolean => {
        if (x < 0 || x >= RASTER_SIZE || y < 0 || y >= RASTER_SIZE) return false;
        return data[(y * RASTER_SIZE + x) * 4 + 3] > ALPHA_THRESHOLD;
      };

      const edgeCandidates: Array<[number, number]> = [];
      const interiorCandidates: Array<[number, number]> = [];
      for (const [x, y] of candidates) {
        let edge = false;
        scan: for (let dy = -EDGE_NEIGHBORHOOD; dy <= EDGE_NEIGHBORHOOD; dy++) {
          for (let dx = -EDGE_NEIGHBORHOOD; dx <= EDGE_NEIGHBORHOOD; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (!isOpaque(x + dx, y + dy)) {
              edge = true;
              break scan;
            }
          }
        }
        if (edge) edgeCandidates.push([x, y]);
        else interiorCandidates.push([x, y]);
      }

      // Bounds → center → scale to TARGET_SIZE → Y-flip.
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      for (const [x, y] of candidates) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const scale = TARGET_SIZE / Math.max(maxX - minX, maxY - minY);

      // Hybrid sampling: OUTLINE_RATIO from edges, rest from interior.
      // Falls back to the full candidate pool if either bucket is empty.
      const edgePool = edgeCandidates.length > 0 ? edgeCandidates : candidates;
      const interiorPool = interiorCandidates.length > 0 ? interiorCandidates : candidates;
      const outlineCount = Math.round(COUNT * OUTLINE_RATIO);

      const positions = new Float32Array(COUNT * 3);
      const aSize = new Float32Array(COUNT);
      const aType = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        const isEdge = i < outlineCount;
        const pool = isEdge ? edgePool : interiorPool;
        const [px, py] = pool[(Math.random() * pool.length) | 0];
        positions[i * 3]     = (px - cx) * scale;
        positions[i * 3 + 1] = -(py - cy) * scale;
        positions[i * 3 + 2] = 0;
        aSize[i] = isEdge ? EDGE_PARTICLE_SIZE : INTERIOR_PARTICLE_SIZE;
        aType[i] = isEdge ? 1.0 : 0.0;
      }
      resolve({ logo: positions, aSize, aType });
    };

    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function ParticleSystem({ bufs }: { bufs: Buffers }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  // Start at state 1 (logo holding, progress=1) so the page loads with the
  // logo already visible. Cycle: hold → dissipate → reform → hold → ...
  // holdTime accumulates seconds while in the "logo visible" state.
  const stateRef = useRef({ state: 1, progress: 1, holdTime: 0 });

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      progress: { value: 1 },
    }),
    [],
  );

  useFrame((s, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const time = s.clock.elapsedTime;
    mat.uniforms.time.value = time;

    const st = stateRef.current;
    if (st.state === 0) {
      st.progress += 0.003;
      if (st.progress >= 1) {
        st.progress = 1;
        st.state = 1;
        st.holdTime = 0;
      }
    } else if (st.state === 1) {
      // Hold the logo for at least 5.5 seconds (frame-rate independent).
      st.holdTime += delta;
      if (st.holdTime > 5.5) {
        st.state = 2;
        st.holdTime = 0;
      }
    } else if (st.state === 2) {
      st.progress -= 0.003;
      if (st.progress <= 0) {
        st.progress = 0;
        st.state = 0;
      }
    }
    mat.uniforms.progress.value = st.progress;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[bufs.position, 3]} />
        <bufferAttribute attach="attributes-aRandom"  args={[bufs.aRandom, 3]} />
        <bufferAttribute attach="attributes-aLogo"    args={[bufs.aLogo, 3]} />
        <bufferAttribute attach="attributes-aDelay"   args={[bufs.aDelay, 1]} />
        <bufferAttribute attach="attributes-aSize"    args={[bufs.aSize, 1]} />
        <bufferAttribute attach="attributes-aType"    args={[bufs.aType, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}

export default function LogoParticlesScene({
  src = "/logo.svg",
  transparent = false,
}: {
  src?: string;
  transparent?: boolean;
}) {
  const [bufs, setBufs] = useState<Buffers | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { rand, delays } = generateRandomBuffers();

    loadLogoPositions(src)
      .then(({ logo, aSize, aType }) => {
        if (cancelled) return;
        setBufs({
          position: rand,
          aRandom: rand,
          aLogo: logo,
          aDelay: delays,
          aSize,
          aType,
        });
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6b8a", fontFamily: "var(--font-jetbrains-mono)", fontSize: 12 }}>
        SVG load failed: {error}
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: transparent }}
      style={{ position: "absolute", inset: 0 }}
    >
      {!transparent && <color attach="background" args={["#08060F"]} />}
      {bufs && <ParticleSystem bufs={bufs} />}
    </Canvas>
  );
}
