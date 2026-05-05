export type PanelConfig = {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  waveSpeed: number;
  iridescentPhase: number;
};

export const PANELS: PanelConfig[] = [
  {
    id: "main",
    position: [0, 0.6, 0],
    rotation: [0, 0, 0],
    size: [22, 3.5],
    waveSpeed: 0.25,
    iridescentPhase: 0.0,
  },
];
