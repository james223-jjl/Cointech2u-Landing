"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useT } from "../lib/i18n";
import {
  fetchLeadersClient,
  type Leader,
  type LeadersFilter,
  type LeadersResult,
} from "../lib/leaders";

type TabDef = { key: LeadersFilter; labelKey: string; subKey: string };

const TABS: TabDef[] = [
  { key: "today", labelKey: "leaders.tab.today", subKey: "leaders.tab.today.sub" },
  { key: "monthly", labelKey: "leaders.tab.monthly", subKey: "leaders.tab.monthly.sub" },
  { key: "alltime", labelKey: "leaders.tab.alltime", subKey: "leaders.tab.alltime.sub" },
];

type Datasets = Record<LeadersFilter, LeadersResult>;

export default function LeadersTabs({
  accent,
  datasets: initialDatasets,
}: {
  accent: string;
  datasets: Datasets;
}) {
  const t = useT();
  const [datasets, setDatasets] = useState<Datasets>(initialDatasets);
  const [idx, setIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    locked: false as false | "x" | "y",
    fromIdx: 0,
    w: 0,
    delta: 0,
  });

  const applyTransform = (px: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate
      ? "transform 0.42s cubic-bezier(.22,1,.36,1)"
      : "none";
    track.style.transform = `translate3d(${px}px, 0, 0)`;
  };

  const snap = (target: number, animate = true) => {
    const w = viewportRef.current?.clientWidth ?? 0;
    applyTransform(-target * w, animate);
  };

  useLayoutEffect(() => {
    snap(idx, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    snap(idx, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    const onResize = () => snap(idx, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Best-effort client refresh via same-origin proxy. Falls back silently
  // when the proxy is not configured (static export without rewrite).
  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        setRefreshing(true);
        const [t, m, a] = await Promise.all([
          fetchLeadersClient("today", 10, ctrl.signal),
          fetchLeadersClient("monthly", 10, ctrl.signal),
          fetchLeadersClient("alltime", 10, ctrl.signal),
        ]);
        if (cancelled) return;
        setDatasets({ today: t, monthly: m, alltime: a });
      } catch {
        // proxy missing or network error — keep build-time data
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    const vp = viewportRef.current;
    if (!vp) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      locked: false,
      fromIdx: idx,
      w: vp.clientWidth,
      delta: 0,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    if (!drag.current.locked) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        drag.current.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (drag.current.locked === "y") return;
    if (drag.current.locked !== "x") return;

    e.preventDefault();
    let resist = dx;
    if ((idx === 0 && dx > 0) || (idx === TABS.length - 1 && dx < 0)) {
      resist = dx * 0.35;
    }
    drag.current.delta = resist;
    applyTransform(-drag.current.fromIdx * drag.current.w + resist, false);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    const { delta, w, fromIdx, locked } = drag.current;
    drag.current.active = false;

    if (locked !== "x") {
      snap(fromIdx, false);
      return;
    }

    const threshold = Math.min(90, w * 0.18);
    let next = fromIdx;
    if (delta < -threshold) next = Math.min(TABS.length - 1, fromIdx + 1);
    else if (delta > threshold) next = Math.max(0, fromIdx - 1);

    if (next === idx) snap(next, true);
    else setIdx(next);
  };

  return (
    <div>
      <TabPills accent={accent} idx={idx} onSelect={setIdx} refreshing={refreshing} />

      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--line)",
          background: "#08080B",
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: "grab",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: "100%",
            willChange: "transform",
          }}
        >
          {TABS.map((tab) => (
            <div
              key={tab.key}
              style={{ flex: "0 0 100%", minWidth: 0 }}
              role="tabpanel"
              aria-label={t(tab.labelKey)}
            >
              <Panel data={datasets[tab.key]} accent={accent} tab={tab} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 22,
        }}
      >
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setIdx(i)}
            aria-label={`Show ${t(tab.labelKey)}`}
            style={{
              appearance: "none",
              border: "none",
              cursor: "pointer",
              width: idx === i ? 26 : 6,
              height: 6,
              borderRadius: 3,
              background: idx === i ? accent : "rgba(255,255,255,0.18)",
              transition: "all .3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TabPills({
  accent,
  idx,
  onSelect,
  refreshing,
}: {
  accent: string;
  idx: number;
  onSelect: (i: number) => void;
  refreshing: boolean;
}) {
  const t = useT();
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 26,
        flexWrap: "wrap",
      }}
    >
      {TABS.map((tab, i) => {
        const active = idx === i;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(i)}
            style={{
              appearance: "none",
              cursor: "pointer",
              padding: "10px 20px",
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: active ? "#fff" : "var(--text-2)",
              background: active
                ? `linear-gradient(135deg, ${accent}, #6B2BFF)`
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "transparent" : "var(--line)"}`,
              transition: "background .25s, color .25s, border-color .25s, box-shadow .25s",
              boxShadow: active ? `0 6px 24px -8px ${accent}` : "none",
            }}
          >
            {t(tab.labelKey)}
          </button>
        );
      })}
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          marginLeft: 4,
          background: refreshing ? "var(--green)" : "rgba(255,255,255,0.18)",
          transition: "background .3s",
          boxShadow: refreshing ? "0 0 8px var(--green)" : "none",
        }}
        title={refreshing ? "Refreshing live data" : "Build-time snapshot"}
      />
    </div>
  );
}

function Panel({
  data,
  accent,
  tab,
}: {
  data: LeadersResult;
  accent: string;
  tab: TabDef;
}) {
  const t = useT();
  const { rows } = data;

  if (rows.length === 0) {
    return (
      <div
        style={{
          padding: "80px 32px",
          textAlign: "center",
          color: "var(--text-3)",
          fontSize: 13,
        }}
      >
        {t("leaders.empty")}
      </div>
    );
  }

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  // Top-of-list profit used to normalise each row's bar. Using rows[0] (the
  // #1 leader) keeps the scale consistent across podium + list so a row
  // never visually outranks the podium.
  const maxProfit = rows[0]?.total_profit ?? 0;

  return (
    <div>
      <Podium leaders={top3} accent={accent} subtitle={t(tab.subKey)} />
      {rest.length > 0 && (
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {rest.map((r, i) => (
            <LeaderRow
              key={r.user_id}
              row={r}
              rank={i + 4}
              accent={accent}
              maxProfit={maxProfit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const PODIUM_ORDER = [1, 0, 2] as const; // visual: #2, #1, #3

function Podium({
  leaders,
  accent,
  subtitle,
}: {
  leaders: Leader[];
  accent: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        padding: "20px 20px 18px",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(227,81,238,0.08), transparent 70%)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          textAlign: "center",
          color: "var(--text-3)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          // Must exceed the rank-1 podium lift (22px in PODIUM_HEIGHT) so the
          // #1 avatar doesn't crash into the subtitle text.
          marginBottom: 36,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr 1fr",
          alignItems: "end",
          gap: 8,
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        {PODIUM_ORDER.map((srcIdx) => {
          const leader = leaders[srcIdx];
          if (!leader) return <div key={srcIdx} />;
          const rank = (srcIdx + 1) as 1 | 2 | 3;
          return (
            <PodiumCard key={leader.user_id} leader={leader} rank={rank} accent={accent} />
          );
        })}
      </div>
    </div>
  );
}

const PODIUM_HEIGHT: Record<1 | 2 | 3, number> = { 1: 22, 2: 12, 3: 6 };
const PODIUM_AVATAR: Record<1 | 2 | 3, number> = { 1: 64, 2: 52, 3: 48 };
const PODIUM_RING: Record<1 | 2 | 3, string> = {
  1: "linear-gradient(135deg, #FFD56B, #E351EE 60%, #6B2BFF)",
  2: "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(227,81,238,0.55))",
  3: "linear-gradient(135deg, rgba(217,142,80,0.85), rgba(227,81,238,0.45))",
};
const PODIUM_BADGE: Record<1 | 2 | 3, string> = {
  1: "linear-gradient(135deg, #FFD56B, #E351EE)",
  2: "linear-gradient(135deg, #C8C8D0, #8B8B96)",
  3: "linear-gradient(135deg, #D38B58, #6B4429)",
};

function PodiumCard({
  leader,
  rank,
  accent,
}: {
  leader: Leader;
  rank: 1 | 2 | 3;
  accent: string;
}) {
  const avatarSize = PODIUM_AVATAR[rank];
  const liftPx = PODIUM_HEIGHT[rank];
  return (
    <div
      style={{
        textAlign: "center",
        transform: `translateY(-${liftPx}px)`,
      }}
    >
      <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
        <Avatar
          name={leader.name}
          src={leader.avatar}
          size={avatarSize}
          ring={PODIUM_RING[rank]}
          accent={accent}
        />
        <span
          className="mono"
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            background: PODIUM_BADGE[rank],
            color: "#0A0A0E",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 99,
            border: "2px solid #08080B",
            letterSpacing: "0.04em",
          }}
        >
          #{rank}
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          marginBottom: 3,
          padding: "0 6px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={leader.name}
      >
        {leader.name || `User ${leader.user_id}`}
      </div>
      <div
        className="mono"
        style={{
          fontSize: rank === 1 ? 14 : 12.5,
          color: "var(--green)",
          fontWeight: 500,
          lineHeight: 1.1,
        }}
      >
        +{formatProfit(leader.total_profit)}
      </div>
      <div
        className="mono"
        style={{ fontSize: 9.5, color: "var(--text-3)", marginTop: 2 }}
      >
        USDT
      </div>
    </div>
  );
}

function LeaderRow({
  row,
  rank,
  accent,
  maxProfit,
}: {
  row: Leader;
  rank: number;
  accent: string;
  maxProfit: number;
}) {
  // Percentage of this row's profit relative to the #1 leader, with a
  // small floor so even the lowest bar reads as a bar (and not a sliver).
  const pct =
    maxProfit > 0
      ? Math.max(6, Math.min(100, (row.total_profit / maxProfit) * 100))
      : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="mono"
        style={{
          width: 24,
          textAlign: "center",
          fontSize: 11.5,
          color: "var(--text-3)",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {rank}
      </div>
      <Avatar name={row.name} src={row.avatar} size={30} accent={accent} />
      <div className="ct2u-lr-name" style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.name}
        >
          {row.name || `User ${row.user_id}`}
        </div>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>
          ID #{row.user_id}
        </div>
      </div>

      {/* Relative profit bar — Apple-style horizontal magnitude visual.
          Fills the empty middle space on desktop only; hidden on mobile
          so the row falls back to the original tighter layout. */}
      <div
        aria-hidden
        className="ct2u-lr-bar"
        style={{
          height: 5,
          borderRadius: 99,
          background: "rgba(255, 255, 255, 0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 99,
            background: `linear-gradient(90deg, ${accent}55, ${accent})`,
            boxShadow: `0 0 12px -2px ${accent}66`,
            transition: "width 0.6s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div>

      <div
        className="mono ct2u-lr-amount"
        style={{
          fontSize: 13,
          color: "var(--green)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        +{formatProfit(row.total_profit)}{" "}
        <span style={{ fontSize: 9.5, color: "var(--text-3)" }}>USDT</span>
      </div>
    </div>
  );
}

function Avatar({
  name,
  src,
  size,
  ring,
  accent,
}: {
  name: string;
  src: string | null;
  size: number;
  ring?: string;
  accent: string;
}) {
  const initials =
    (name || "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s.charAt(0).toUpperCase())
      .join("") || "?";

  const inner: CSSProperties = {
    width: size,
    height: size,
    borderRadius: 99,
    flexShrink: 0,
    background: src
      ? `#0E0E12 url(${src}) center/cover no-repeat`
      : `linear-gradient(135deg, ${accent}, #6B2BFF)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.max(11, Math.round(size * 0.32)),
    fontWeight: 600,
    color: "#fff",
    border: ring ? "none" : "1px solid var(--line)",
  };

  if (!ring) {
    return <div style={inner}>{src ? null : initials}</div>;
  }

  return (
    <div
      style={{
        width: size + 6,
        height: size + 6,
        borderRadius: 99,
        padding: 3,
        background: ring,
        display: "inline-flex",
      }}
    >
      <div style={{ ...inner, border: "2px solid #08080B" }}>
        {src ? null : initials}
      </div>
    </div>
  );
}

function formatProfit(n: number): string {
  if (!Number.isFinite(n)) return "0.00";
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "M";
  }
  if (Math.abs(n) >= 100_000) {
    return (n / 1_000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "K";
  }
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
