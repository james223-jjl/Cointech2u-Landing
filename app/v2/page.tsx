import HeroCanvas from "../components/hero/HeroCanvas";
import HeroOverlay from "../components/hero/HeroOverlay";
import { protocolTheme } from "../lib/theme";

export const metadata = {
  title: "CoinTech2u — v2 hero preview",
};

export default function V2Page() {
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
      <HeroCanvas />
      <HeroOverlay />
    </main>
  );
}
