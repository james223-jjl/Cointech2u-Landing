import { ACCENT } from "./theme";

const items = [
  {
    n: "01",
    t: "Zero custody risk",
    d: "Maintain full control of your funds at all times. Your assets stay safely in your own exchange accounts — zero third-party custody, full transparency on every trade.",
  },
  {
    n: "02",
    t: "Adaptive AI intelligence",
    d: "Our engine never stops learning. Algorithms continuously monitor volatility regimes, calibrating entry and exit logic to changing market conditions.",
  },
  {
    n: "03",
    t: "Verified, transparent results",
    d: "Every metric — Sharpe, drawdown, win/loss, latency — is published from production. No selective backtests, no marketing-friendly windows.",
  },
  {
    n: "04",
    t: "Seamless Fast API",
    d: "Connect in seconds, trade smarter forever. Our secure Fast API links instantly to OKX, Bitget, Bybit, or Binance — real-time analytics with zero setup complexity.",
  },
];

export default function CoreStrengths({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      id="core-strengths"
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 64,
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
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
            Core strengths
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            AI-driven insights.
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              Smart analysis. Verified results.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6 }}>
            Experience CoinTech2u&apos;s adaptive logic in action — real-time analytics, risk control,
            and consistent performance backed by four years of live data.
          </p>
        </div>

        <div className="ct2u-strength-cols">
          {items.map((it) => (
            <div key={it.n} className="ct2u-strength-col" tabIndex={0}>
              <div className="ct2u-strength-col-rail">
                <span className="mono ct2u-strength-num">{it.n}</span>
                <h3 className="ct2u-strength-title-rail">{it.t}</h3>
                <span className="ct2u-strength-arrow" aria-hidden>
                  →
                </span>
              </div>
              <div className="ct2u-strength-col-panel">
                <span className="mono ct2u-strength-num">{it.n}</span>
                <h3 className="ct2u-strength-title-horiz">{it.t}</h3>
                <p>{it.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
