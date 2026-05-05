type Props = { live?: boolean };

export default function StatusPill({ live = true }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 99,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.02)",
        fontSize: 11,
        color: "var(--text-2)",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      <span
        className={live ? "ct2u-live-dot" : undefined}
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: live ? "var(--green)" : "var(--text-3)",
          boxShadow: live ? "0 0 8px var(--green)" : "none",
        }}
      />
      {live ? "LIVE" : "IDLE"}
    </div>
  );
}
