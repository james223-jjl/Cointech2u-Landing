"use client";

import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import Grid from "./Grid";
import PanelStack from "./PanelStack";
import Starfield from "./Starfield";
import { protocolTheme } from "../../lib/theme";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[protocolTheme.bgDeep]} />
      <Background />
      <Starfield />
      <Grid />
      <PanelStack />
    </Canvas>
  );
}
