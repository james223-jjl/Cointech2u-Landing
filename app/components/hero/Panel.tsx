"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PanelConfig } from "../../lib/panels";
import { fragmentShader, vertexShader } from "./panelShader";

export default function Panel({ config }: { config: PanelConfig }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: config.iridescentPhase },
      uWaveSpeed: { value: config.waveSpeed },
      uPanelSize: { value: new THREE.Vector2(config.size[0], config.size[1]) },
    }),
    [config.iridescentPhase, config.waveSpeed, config.size[0], config.size[1]],
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={config.position} rotation={config.rotation}>
      <planeGeometry args={[config.size[0], config.size[1], 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
