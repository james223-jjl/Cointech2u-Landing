export const protocolTheme = {
  bgDeep: "#08060F",
  bgInk: "#0F0820",
  base: "#7C7CFF",
  pulse: "#E351EE",
  mint: "#5EEAD4",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.6)",
  textDim: "rgba(255,255,255,0.4)",
} as const;

export type ProtocolTheme = typeof protocolTheme;
