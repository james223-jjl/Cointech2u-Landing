import LogoParticlesScene from "../components/v3/LogoParticles";
import { protocolTheme } from "../lib/theme";

export const metadata = {
  title: "CoinTech2u — v3 animation lab",
};

export default function V3Page() {
  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: protocolTheme.bgDeep,
        color: protocolTheme.text,
      }}
    >
      <LogoParticlesScene />
    </main>
  );
}
