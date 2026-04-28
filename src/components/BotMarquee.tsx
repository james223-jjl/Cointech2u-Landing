import { ArrowIcon } from "./ArrowIcon";

type Bot = { n: string; p: string; l: string };

const bots: Bot[] = [
  { n: "Flash2", p: "+320.95", l: "5x" },
  { n: "BOT 2", p: "+250.84", l: "5x" },
  { n: "Orion", p: "+188.42", l: "3x" },
  { n: "JamesMax05", p: "+94.21", l: "4x" },
  { n: "NebulaOne", p: "+142.07", l: "5x" },
  { n: "StarForge", p: "+73.19", l: "3x" },
  { n: "Quasar", p: "+52.47", l: "6x" },
  { n: "BOT 1", p: "+36.27", l: "3x" },
  { n: "MoonRaker", p: "+412.68", l: "5x" },
  { n: "VoidWalker", p: "+91.03", l: "4x" },
  { n: "Supernova", p: "+267.51", l: "6x" },
  { n: "Phoenix", p: "+128.92", l: "5x" },
];

function hueFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 260 + (h % 60);
}

function BotCard({ bot }: { bot: Bot }) {
  const hue = hueFor(bot.n);
  return (
    <a
      href="#"
      className="card p-5 flex flex-col gap-3 min-w-[260px] hover:border-neon/40"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs text-paper"
          style={{
            background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${
              hue + 20
            },60%,35%))`,
          }}
        >
          {bot.n.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-sm text-paper">{bot.n}</div>
          <div className="text-[10px] font-mono text-mute uppercase tracking-widest">
            {bot.l} · USDT-M
          </div>
        </div>
      </div>
      <div className="font-display text-2xl text-profit tabular-nums">
        {bot.p}{" "}
        <span className="text-xs text-mute font-sans">USDT</span>
      </div>
      <div className="text-[11px] font-mono text-mute flex items-center justify-between">
        <span>View portfolio</span>
        <ArrowIcon size={12} />
      </div>
    </a>
  );
}

export function BotMarquee() {
  const doubled = [...bots, ...bots];
  const reversed = [...bots].reverse();
  const doubledReversed = [...reversed, ...reversed];

  return (
    <>
      <div className="marquee py-4">
        <div className="marquee-track">
          {doubled.map((b, i) => (
            <BotCard key={`a-${i}`} bot={b} />
          ))}
        </div>
      </div>

      <div className="marquee py-4 mt-4">
        <div
          className="marquee-track"
          style={{ animationDirection: "reverse", animationDuration: "65s" }}
        >
          {doubledReversed.map((b, i) => (
            <BotCard key={`b-${i}`} bot={b} />
          ))}
        </div>
      </div>
    </>
  );
}
