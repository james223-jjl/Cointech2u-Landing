import EquityTicker from "./dashboard/EquityTicker";
import LatencyValue from "./dashboard/LatencyValue";
import UpdatedAgo from "./dashboard/UpdatedAgo";
import Sparkline from "./Sparkline";
import StatusPill from "./StatusPill";
import { ACCENT } from "./theme";

const panel: React.CSSProperties = {
  background: "linear-gradient(180deg, #0E0E12 0%, #08080B 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "var(--radius-lg)",
  boxShadow:
    "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(227,81,238,0.04), 0 80px 200px -40px rgba(227,81,238,0.18)",
  overflow: "hidden",
  position: "relative",
};

const topbar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 18px",
  borderBottom: "1px solid var(--line)",
  background: "rgba(255,255,255,0.015)",
};

function TrafficDots() {
  const dot: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 99,
    display: "inline-block",
    background: "#26262C",
  };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <span style={dot} />
      <span style={dot} />
      <span style={dot} />
    </div>
  );
}

type KPIProps = {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
};
function KPI({ label, value, delta, positive = true }: KPIProps) {
  return (
    <div style={{ flex: 1, padding: "14px 16px", borderRight: "1px solid var(--line)" }}>
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 19,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      {delta && (
        <div
          style={{
            fontSize: 11,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: positive ? "var(--green)" : "var(--red)",
            marginTop: 4,
          }}
        >
          {positive ? "↑" : "↓"} {delta}
        </div>
      )}
    </div>
  );
}

export default function HeroDashboard({ accent = ACCENT }: { accent?: string }) {
  return (
    <div style={panel}>
      <div style={topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TrafficDots />
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>
            cointech2u — portfolio.live
          </span>
        </div>
        <StatusPill live />
      </div>

      <div
        className="ct2u-md-flex-wrap"
        style={{
          padding: "24px 24px 18px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: 8,
            }}
          >
            Portfolio Equity
          </div>
          <EquityTicker />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["1D", "1W", "1M", "3M", "ALL"].map((t, i) => (
            <span
              key={t}
              className="mono"
              style={{
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 6,
                background: i === 1 ? "rgba(227,81,238,0.08)" : "transparent",
                color: i === 1 ? accent : "var(--text-2)",
                border:
                  i === 1
                    ? "1px solid rgba(227,81,238,0.25)"
                    : "1px solid var(--line)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 8px", height: 180 }}>
        <Sparkline width={800} height={180} accent={accent} seed={3} />
      </div>

      <div
        className="ct2u-tiles-row"
        style={{
          display: "flex",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <KPI label="Sharpe (90d)" value="1.84" delta="0.12" positive />
        <KPI label="Max Drawdown" value="−4.2%" delta="0.6%" positive />
        <KPI label="Open Positions" value="6" />
        <div style={{ flex: 1, padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: 6,
            }}
          >
            Latency
          </div>
          <div
            style={{
              fontSize: 19,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 500,
            }}
          >
            <LatencyValue />
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--text-3)",
              marginTop: 4,
            }}
          >
            p95 · OKX
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 20px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
            }}
          >
            Active Strategies
          </span>
          <UpdatedAgo />
        </div>
        {[
          { sym: "BTC-PERP", strat: "Mean Reversion", size: "0.842", pnl: "+0.84%", pos: true },
          { sym: "ETH-PERP", strat: "Trend / Adaptive", size: "12.40", pnl: "+1.21%", pos: true },
          { sym: "SOL-PERP", strat: "Volatility Hedge", size: "180.0", pnl: "−0.18%", pos: false },
        ].map((row, i) => (
          <div
            key={row.sym}
            className="ct2u-md-row-2col"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1.6fr 1fr 0.8fr",
              alignItems: "center",
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--line)",
              fontSize: 13,
            }}
          >
            <span className="mono" style={{ fontWeight: 500 }}>{row.sym}</span>
            <span style={{ color: "var(--text-2)" }}>{row.strat}</span>
            <span className="mono" style={{ color: "var(--text-2)" }}>{row.size}</span>
            <span
              className="mono"
              style={{ color: row.pos ? "var(--green)" : "var(--red)", textAlign: "right" }}
            >
              {row.pnl}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
