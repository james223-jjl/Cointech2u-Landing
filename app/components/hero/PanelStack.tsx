"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PANELS } from "../../lib/panels";
import Panel from "./Panel";

const TILT_AMOUNT_Y = 0.15;
const TILT_AMOUNT_X = 0.10;
const TILT_LERP = 0.05;

export default function PanelStack() {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    target.current.y = state.pointer.x * TILT_AMOUNT_Y;
    target.current.x = -state.pointer.y * TILT_AMOUNT_X;

    current.current.x += (target.current.x - current.current.x) * TILT_LERP;
    current.current.y += (target.current.y - current.current.y) * TILT_LERP;

    g.rotation.x = current.current.x;
    g.rotation.y = current.current.y;
  });

  return (
    <group ref={groupRef}>
      {PANELS.map((p) => (
        <Panel key={p.id} config={p} />
      ))}
    </group>
  );
}
