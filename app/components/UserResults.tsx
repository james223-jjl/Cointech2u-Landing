import Sparkline from "./Sparkline";
import { ACCENT } from "./theme";

const bots = [
  { name: "Flash2", profit: "+320.95", id: 120 },
  { name: "BOT 2", profit: "+250.84", id: 182 },
  { name: "Sub-account 03", profit: "+122.70", id: 606 },
  { name: "JamesMax05", profit: "+94.21", id: 607 },
  { name: "Main account", profit: "+73.19", id: 605 },
  { name: "Strategy A1", profit: "+52.47", id: 52 },
  { name: "BOT 1", profit: "+36.27", id: 183 },
  { name: "Trend-Adaptive", profit: "+218.40", id: 204 },
  { name: "Vol-Hedge", profit: "+89.55", id: 311 },
  { name: "Mean-Rev", profit: "+147.22", id: 412 },
];

type Bot = (typeof bots)[number];

function BotCard({ bot, accent, seed }: { bot: Bot; accent: string; seed: number }) {
  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "#08080B",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 99,
              background: `linear-gradient(135deg, ${accent}, #6B2BFF)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-inter-tight)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {bot.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{bot.name}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>
              ID #{bot.id}
            </div>
          </div>
        </div>
        <span
          className="mono"
          style={{
            fontSize: 10,
            color: accent,
            padding: "3px 7px",
            border: "1px solid rgba(227,81,238,0.25)",
            borderRadius: 4,
            background: "rgba(227,81,238,0.05)",
          }}
        >
          ×5
        </span>
      </div>
      <div style={{ height: 64 }}>
        <Sparkline width={280} height={64} accent={accent} seed={seed} />
      </div>
      <div
        style={{
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10.5,
              color: "var(--text-3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Profit
          </div>
          <div
            className="mono"
            style={{ fontSize: 14, color: "var(--green)", fontWeight: 500 }}
          >
            {bot.profit} USDT
          </div>
        </div>
        <a
          href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "var(--text-2)" }}
        >
          View →
        </a>
      </div>
    </div>
  );
}

export default function UserResults({ accent = ACCENT }: { accent?: string }) {
  const all = [...bots, ...bots];
  return (
    <section
      id="user-result"
      className="reveal ct2u-section-y"
      style={{ padding: "120px 0 120px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              margin: 0,
              marginBottom: 22,
            }}
          >
            User results
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
            }}
          >
            Backtested. Verified.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Ready to trade.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Every CoinTech2u strategy is built on years of live trading data and rigorous
            backtesting — adapting to market volatility while maintaining transparent, verifiable
            performance.
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="marquee-track">
          {all.map((b, i) => (
            <BotCard key={i} bot={b} accent={accent} seed={i + 7} />
          ))}
        </div>
      </div>
    </section>
  );
}
