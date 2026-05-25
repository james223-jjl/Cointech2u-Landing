"use client";

import { useEffect, useState } from "react";
import { fetchLeadersClient, type LeadersFilter } from "../lib/leaders";
import { ACCENT } from "./theme";

// Mobile-app-style portfolio dashboard. Frame + Equity card + stats grid
// are visual mocks of the CoinTech2u mobile app screen (private user data
// is auth-gated). The Performance section pulls *live* aggregate network
// profit from /api/leaders (the same Cloudflare Function the leaderboard
// uses), so visitors see real, refreshing totals.

const PERF_TIMEFRAMES: { key: string; filter: LeadersFilter; fallback: string }[] = [
  { key: "1D",  filter: "today",   fallback: "+1.84" },
  { key: "30D", filter: "monthly", fallback: "+28.18" },
  { key: "ALL", filter: "alltime", fallback: "+78.40K" },
];

const GREEN = "#34D399";
const PINK = "#F87171";

function formatProfit(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "−";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "M";
  }
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "K";
  }
  return sign + abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function HeroDashboard({ accent = ACCENT }: { accent?: string }) {
  const [tf, setTf] = useState<string>("30D");
  // null = not loaded yet (fall back to mock); otherwise real total profit
  // per timeframe from /api/leaders.
  const [totals, setTotals] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          PERF_TIMEFRAMES.map((t) =>
            fetchLeadersClient(t.filter, 1, ctrl.signal).then((r) => [t.key, r.totalProfit] as const),
          ),
        );
        if (cancelled) return;
        setTotals(Object.fromEntries(results));
      } catch {
        // /api/leaders unreachable (e.g. `next dev`) — keep showing the
        // hand-tuned fallback values so the section never goes blank.
      }
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  const live = totals !== null;
  const perfDef = PERF_TIMEFRAMES.find((t) => t.key === tf) ?? PERF_TIMEFRAMES[1];
  const perfValue =
    totals?.[perfDef.key] !== undefined
      ? formatProfit(totals[perfDef.key])
      : perfDef.fallback;

  return (
    <div
      className="ct2u-dash"
      style={{
        background: "linear-gradient(180deg, #0E0E12 0%, #08080B 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-lg)",
        boxShadow:
          "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(227,81,238,0.04), 0 80px 200px -40px rgba(227,81,238,0.18)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* === Header bar === */}
      <div
        style={{
          padding: "12px 14px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <ChevronLeft />
          <PortfolioBadge accent={accent} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            1000U 1/26 | P1
          </span>
        </div>
        <FolderIcon />
      </div>

      {/* === Selected portfolio chip === */}
      <div style={{ padding: "2px 14px 10px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 10,
            border: "1px solid transparent",
            backgroundImage: `
              linear-gradient(#08080B, #08080B),
              linear-gradient(135deg, ${PINK}, ${accent}, #6B2BFF)
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            fontSize: 11.5,
            fontWeight: 500,
          }}
        >
          <PortfolioBadge accent={accent} size={14} />
          1000U 1/…
        </span>
      </div>

      {/* === Tabs === */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <DashboardTab active>Dashboard</DashboardTab>
          <DashboardTab>Positions (12)</DashboardTab>
          <DashboardTab>Market</DashboardTab>
        </div>
        <div style={{ display: "flex", gap: 10, color: "var(--text-2)" }}>
          <DocumentIcon accent={accent} />
          <HistoryIcon accent={accent} />
        </div>
      </div>

      {/* === Equity card === */}
      <div style={{ padding: "12px 14px 6px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: "12px 14px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              color: "var(--text-3)",
              letterSpacing: "0.04em",
              marginBottom: 3,
            }}
          >
            Equity
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              924.14
              <ShieldIcon accent={accent} />
            </span>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: GREEN,
                textAlign: "right",
                lineHeight: 1.3,
              }}
            >
              Current Equity:
              <br />
              924.1427
            </div>
          </div>
          {/* Equity Guard split bar — pink portion = below recorded equity,
              green portion = above recorded. Proportions match the mobile
              screenshot (≈80/20). */}
          <div
            aria-hidden
            style={{
              marginTop: 12,
              height: 7,
              borderRadius: 99,
              overflow: "hidden",
              display: "flex",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ width: "80%", background: PINK }} />
            <div style={{ width: "20%", background: GREEN }} />
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: PINK, fontWeight: 500 }}>Equity Guard: 721</span>
            <span style={{ color: "var(--text)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Recorded Equity: 900.8316
              <DocumentIcon accent={accent} size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* === Stats grid === */}
      <div style={{ padding: "12px 14px 2px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <Stat label="Wallet Balance" value="932.32" />
          <Stat label="Unrealized P&L" value="-8.18" color={PINK} />
          <Stat label="Today" value="+1.84192" color={GREEN} arrow />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <Stat label="Available Margin" value="924.04" />
          <Stat label="Activated Coins" value="6" />
          <div />
        </div>
      </div>

      {/* === Performance === */}
      <div style={{ padding: "14px 14px 10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Performance
            {live && (
              <span
                aria-label="Live network data"
                title="Live network data"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  background: GREEN,
                  boxShadow: `0 0 8px ${GREEN}`,
                }}
              />
            )}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>
            Closed Orders{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>784</span>
          </span>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: "12px 14px 10px",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: GREEN,
              letterSpacing: "-0.01em",
            }}
          >
            {perfValue}
          </div>
          <div style={{ height: 88, marginTop: 6 }}>
            <PerfChart green={GREEN} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 6,
              gap: 6,
            }}
          >
            {PERF_TIMEFRAMES.map((t) => (
              <TFPill
                key={t.key}
                active={t.key === tf}
                accent={accent}
                onClick={() => setTf(t.key)}
              >
                {t.key}
              </TFPill>
            ))}
          </div>
        </div>
      </div>

      {/* === Quick Actions === */}
      <div style={{ padding: "0 14px 14px" }}>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid transparent",
            backgroundImage: `
              linear-gradient(#08080B, #08080B),
              linear-gradient(135deg, ${PINK}, ${accent}, #6B2BFF)
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            color: "var(--text)",
            fontSize: 13,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <SlidersIcon accent={accent} />
          Quick Actions
        </button>
      </div>
    </div>
  );
}

/* ---------- Inner pieces ---------- */

function DashboardTab({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      style={{
        position: "relative",
        padding: "8px 0 10px",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        color: active ? "var(--text)" : "var(--text-3)",
      }}
    >
      {children}
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1,
            height: 2,
            borderRadius: 2,
            background: "linear-gradient(90deg, #F87171, #E351EE)",
          }}
        />
      )}
    </span>
  );
}

function Stat({
  label,
  value,
  color,
  arrow,
}: {
  label: string;
  value: string;
  color?: string;
  arrow?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          color: "var(--text-3)",
          marginBottom: 3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter-tight), sans-serif",
          fontSize: 14.5,
          fontWeight: 600,
          color: color ?? "var(--text)",
          fontVariantNumeric: "tabular-nums",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {value}
        {arrow && <span style={{ fontSize: 10, opacity: 0.7 }}>›</span>}
      </div>
    </div>
  );
}

function TFPill({
  children,
  active,
  accent,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mono"
      style={{
        appearance: "none",
        cursor: "pointer",
        flex: 1,
        padding: "5px 0",
        borderRadius: 8,
        fontSize: 10.5,
        fontWeight: 500,
        color: active ? "var(--text)" : "var(--text-3)",
        border: active ? "1px solid transparent" : "1px solid transparent",
        backgroundImage: active
          ? `linear-gradient(#0F0F14, #0F0F14), linear-gradient(135deg, #F87171, ${accent}, #6B2BFF)`
          : "none",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        background: active ? undefined : "transparent",
        transition: "color 0.2s, background 0.2s",
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Performance chart (ascending green curve) ---------- */

function PerfChart({ green }: { green: string }) {
  // Hand-tuned points giving a clean upward trend with two visible plateaus
  // — mirrors the screenshot of the 30D performance curve.
  const pts = [
    [0, 92], [5, 88], [12, 86], [20, 80], [28, 75], [35, 70], [42, 68],
    [50, 60], [58, 55], [65, 52], [72, 48], [80, 42], [88, 36], [96, 30],
    [100, 26],
  ];
  const W = 300;
  const H = 100;
  const toXY = (p: number[]) => [
    (p[0] / 100) * W,
    (p[1] / 100) * H,
  ] as const;
  const path = pts
    .map((p, i) => {
      const [x, y] = toXY(p);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="pf-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={green} stopOpacity="0.22" />
          <stop offset="100%" stopColor={green} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#pf-fill)" />
      <path
        d={path}
        fill="none"
        stroke={green}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map(([x, y]) => {
        const [cx, cy] = toXY([x, y]);
        return <circle key={`${x},${y}`} cx={cx} cy={cy} r="1.4" fill={green} />;
      })}
    </svg>
  );
}

/* ---------- Icons (inline SVG) ---------- */

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function PortfolioBadge({ accent, size = 22 }: { accent: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: `linear-gradient(135deg, #6BE4F0, ${accent})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 0 12px -2px rgba(107,228,240,0.6)",
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          d="M7 7h7a3 3 0 0 1 0 6H7M7 13h9a3 3 0 0 1 0 6H7"
          stroke="#0A0A0E"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function ShieldIcon(_: { accent: string }) {
  return (
    <img
      src="/icons/equity-guard.svg"
      alt=""
      aria-hidden
      width={22}
      height={22}
      style={{ verticalAlign: "middle", marginLeft: 6, display: "inline-block" }}
    />
  );
}

function DocumentIcon({ accent, size = 18 }: { accent: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M9 12h6M9 16h6"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HistoryIcon({ accent }: { accent: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
      <path
        d="M12 7v5l3 2"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlidersIcon({ accent }: { accent: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h10M4 12h6M4 18h12" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="6" r="2.2" fill={accent} />
      <circle cx="13" cy="12" r="2.2" fill={accent} />
      <circle cx="19" cy="18" r="2.2" fill={accent} />
    </svg>
  );
}
