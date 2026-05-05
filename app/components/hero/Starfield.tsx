"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../../lib/seededRandom";

const STAR_COUNT = 200;

const vertexShader = /* glsl */ `
  attribute float aPhase;
  varying float vPhase;
  uniform float uPixelRatio;

  void main() {
    vPhase = aPhase;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 2.0 * uPixelRatio;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vPhase;
  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    // Calm twinkle: small amplitude, slow rate.
    float pulse = 0.7 + 0.15 * sin(uTime * 0.5 + vPhase * 6.28318);
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * pulse * 0.55);
  }
`;

export default function Starfield() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases } = useMemo(() => {
    const rand = mulberry32(7);
    const pos = new Float32Array(STAR_COUNT * 3);
    const ph = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3] = (rand() - 0.5) * 32;
      pos[i * 3 + 1] = (rand() - 0.5) * 18;
      pos[i * 3 + 2] = -3 - rand() * 7;
      ph[i] = rand();
    }
    return { positions: pos, phases: ph };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    }),
    [],
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
