import Sparkline from "./Sparkline";
import { ACCENT } from "./theme";

const platforms = [
  { os: "iOS", label: "Coming soon", sub: "Apple App Store" },
  { os: "Android", label: "Click to download", sub: "Google Play / APK" },
];

export default function AppDownload({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div
        className="ct2u-md-stack"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div>
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
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: accent,
                verticalAlign: "middle",
                marginRight: 10,
              }}
            />
            Mobile app
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 22,
            }}
          >
            Trade anywhere,
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              anytime.
            </span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--text-2)",
              maxWidth: 480,
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            Unlock the power of AI-driven trading from your pocket. Whether you&apos;re a beginner or
            pro, CoinTech2u helps you trade smarter and with data-backed confidence.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {platforms.map((p) => (
              <div
                key={p.os}
                className="ct2u-platform-card"
                style={{
                  flex: "1 1 240px",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  padding: 20,
                  background: "#08080B",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <svg className="ct2u-glow-svg" aria-hidden>
                  <rect className="ct2u-glow-blur" pathLength={100} />
                  <rect className="ct2u-glow-stroke" pathLength={100} />
                </svg>
                <div
                  aria-hidden
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--line)",
                    position: "relative",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={p.os === "iOS" ? "/icons/ios.svg" : "/icons/android.svg"}
                    alt={`${p.os} icon`}
                    width={36}
                    height={36}
                    style={{ display: "block" }}
                  />
                </div>
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                    }}
                  >
                    {p.sub}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginTop: 2 }}>{p.os}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: p.label === "Coming soon" ? "var(--text-3)" : accent,
                      marginTop: 4,
                    }}
                  >
                    {p.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", maxWidth: 320, margin: "0 auto" }}>
          <div
            className="ct2u-phone"
            style={{
              aspectRatio: "9 / 19",
              border: "8px solid #16161B",
              borderRadius: 40,
              background: "#08080B",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), 0 60px 120px -40px ${accent}55`,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 22,
                borderRadius: 99,
                background: "#000",
              }}
            />
            <div
              style={{
                padding: "50px 18px 18px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>
                PORTFOLIO
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter-tight)",
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                $128,402<span style={{ color: "var(--text-3)" }}>.51</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--green)" }}>
                +$1,284.20 · +1.01%
              </div>
              <div style={{ height: 100, marginTop: 8 }}>
                <Sparkline width={260} height={100} accent={accent} seed={5} />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {["BTC", "ETH", "SOL"].map((s, i) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.025)",
                      fontSize: 12,
                    }}
                  >
                    <span className="mono">{s}-PERP</span>
                    <span
                      className="mono"
                      style={{ color: i === 2 ? "var(--red)" : "var(--green)" }}
                    >
                      {i === 2 ? "−0.18%" : `+${(0.84 + i * 0.4).toFixed(2)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
