"use client";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

export default function PostFX() {
  const caOffset = useMemo(() => new THREE.Vector2(0.0003, 0.0003), []);

  return (
    <EffectComposer>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.25}
        radius={0.85}
      />
      <ChromaticAberration
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.4} darkness={0.6} />
    </EffectComposer>
  );
}
