import HeroDashboard from "./HeroDashboard";
import LogoParticlesScene from "./v3/LogoParticles";
import { ACCENT } from "./theme";

export default function Hero({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      style={{ position: "relative", paddingTop: 140, paddingBottom: 80, overflow: "hidden" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 700,
          background: `radial-gradient(closest-side, ${accent}22 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center top, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center top, black 30%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        className="ct2u-hero-logo"
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2000,
          height: 1500,
          pointerEvents: "none",
        }}
      >
        <LogoParticlesScene transparent />
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        <div
          className="reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 12px 6px 6px",
            borderRadius: 99,
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.025)",
            fontSize: 12,
            color: "var(--text-2)",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 99,
              background: "rgba(227,81,238,0.12)",
              color: accent,
              fontSize: 10.5,
              letterSpacing: "0.08em",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            NEW
          </span>
          <span>Adaptive execution engine v4 — now in production</span>
          <span style={{ color: "var(--text-3)" }}>→</span>
        </div>

        <h1
          className="reveal ct2u-aurora-text"
          style={{
            fontSize: "clamp(58px, 8.5vw, 96px)",
            fontWeight: 500,
            marginBottom: 28,
            letterSpacing: "-0.035em",
            filter: `drop-shadow(0 0 24px ${accent}40)`,
          }}
        >
          Trade intelligence,
          <br />
          not <em style={{ fontStyle: "normal" }}>emotion</em>.
        </h1>

        <p
          className="reveal"
          style={{
            fontSize: 19,
            color: "var(--text-2)",
            maxWidth: 680,
            margin: "0 auto 40px",
            lineHeight: 1.55,
          }}
        >
          Stay ahead of every market move with AI-powered precision, real-time analytics, and verified
          intelligence — built for traders across{" "}
          <span style={{ color: "var(--text)" }}>100+ countries</span>.
        </p>

        <div
          className="reveal"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 80,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            Get started <span style={{ opacity: 0.7 }}>→</span>
          </a>
          <a
            href="#trading"
            style={{
              padding: "14px 22px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              color: "var(--text)",
              fontSize: 14,
              fontWeight: 500,
              border: "1px solid var(--line-strong)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: "var(--green)",
                boxShadow: "0 0 8px var(--green)",
              }}
            />
            View live performance
          </a>
        </div>

        <div
          className="reveal float-soft"
          style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}
        >
          <HeroDashboard accent={accent} />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -120,
              left: 0,
              right: 0,
              height: 200,
              background: "linear-gradient(to bottom, transparent, var(--bg))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
