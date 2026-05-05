import { ACCENT } from "./theme";

export default function FinalCTA({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      className="reveal ct2u-section"
      style={{
        padding: "160px 32px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 700,
          background: `radial-gradient(closest-side, ${accent}24 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <p
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: 24,
          }}
        >
          —  Start your crypto AI journey  —
        </p>
        <h2
          style={{
            fontSize: "clamp(48px, 6vw, 84px)",
            letterSpacing: "-0.035em",
            marginBottom: 28,
          }}
        >
          Markets don&apos;t sleep.
          <br />
          <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
            Neither should your edge.
          </span>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-2)",
            maxWidth: 540,
            margin: "0 auto 44px",
            lineHeight: 1.6,
          }}
        >
          Connect an exchange in under a minute. Run your first strategy by lunch.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "16px 26px",
              borderRadius: 12,
              background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 0 40px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            Connect exchange <span style={{ opacity: 0.7 }}>→</span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=cointech2u.com&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "16px 26px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              color: "var(--text)",
              fontSize: 15,
              fontWeight: 500,
              border: "1px solid var(--line-strong)",
            }}
          >
            Download app
          </a>
        </div>

        <p style={{ marginTop: 36, fontSize: 12, color: "var(--text-3)" }}>
          Free to evaluate · No credit card · Disconnect anytime
        </p>
      </div>
    </section>
  );
}
