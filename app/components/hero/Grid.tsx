"use client";

import { useMemo } from "react";
import * as THREE from "three";

const PLANE_W = 30;
const PLANE_H = 17;
const CELL_SIZE = 0.4;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec2  uPlaneSize;
  uniform float uCellSize;

  varying vec2 vUv;

  void main() {
    // Cells in world units so density is constant regardless of plane size.
    vec2 worldUv = vUv * uPlaneSize;
    vec2 cell = abs(fract(worldUv / uCellSize) - 0.5);
    float gridLine = smoothstep(0.47, 0.5, max(cell.x, cell.y));

    // Radial mask — densest at center, fades to nothing at edges.
    vec2 d = vUv - 0.5;
    d.y *= 1.5;
    float mask = 1.0 - smoothstep(0.20, 0.55, length(d));

    float alpha = gridLine * 0.07 * mask;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

export default function Grid() {
  const uniforms = useMemo(
    () => ({
      uPlaneSize: { value: new THREE.Vector2(PLANE_W, PLANE_H) },
      uCellSize: { value: CELL_SIZE },
    }),
    [],
  );

  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
