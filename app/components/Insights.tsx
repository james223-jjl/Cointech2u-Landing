import { ACCENT } from "./theme";

const featured = {
  tag: "Featured",
  title: "CoinTech2u at Coinfest Asia 2024 — highlights and innovations",
  excerpt:
    "Recap of our keynote on adaptive execution infrastructure, on-stage demos with partner exchanges, and what shipped after the event.",
  date: "Apr 18, 2026",
  read: "6 min read",
};
const posts = [
  {
    tag: "Listings",
    title: "Coinbase to list CHIP for spot trading",
    date: "Apr 21, 2026",
    read: "2 min",
  },
  {
    tag: "Macro",
    title: "Markets rebound: what surprised analysts this quarter",
    date: "Apr 21, 2026",
    read: "4 min",
  },
  {
    tag: "DEX",
    title: "Arkham launches a decentralized exchange feature",
    date: "Apr 21, 2026",
    read: "3 min",
  },
  {
    tag: "Stablecoins",
    title: "Tempo partners with DoorDash on stablecoin-based driver rewards",
    date: "Apr 21, 2026",
    read: "3 min",
  },
  {
    tag: "Derivatives",
    title: "CHIP perpetuals on Binance convert to traditional futures",
    date: "Apr 20, 2026",
    read: "2 min",
  },
];

export default function Insights({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 620 }}>
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
              Insights, News &amp; Market Updates
            </p>
            <h2
              style={{
                fontSize: "clamp(34px, 4vw, 52px)",
                letterSpacing: "-0.025em",
                marginBottom: 18,
              }}
            >
              Discover trends.
              <br />
              <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
                Learn from data. Stay ahead.
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6 }}>
              Research notes, market briefings, and product updates from the CoinTech2u team.
            </p>
          </div>
          <a
            href="#"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--line-strong)",
              fontSize: 13,
              color: "var(--text)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            View all articles <span style={{ opacity: 0.4 }}>→</span>
          </a>
        </div>

        <div
          className="ct2u-md-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <a
            href="#"
            style={{
              display: "block",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              background: "#08080B",
              overflow: "hidden",
              transition: "transform 0.25s ease, border-color 0.25s ease",
            }}
          >
            <div
              style={{
                aspectRatio: "16 / 9",
                position: "relative",
                background: `linear-gradient(135deg, #0E0E12 0%, #1a0a1f 60%, ${accent}22 100%)`,
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  maskImage:
                    "radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at 70% 50%, black 20%, transparent 70%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  padding: "5px 10px",
                  borderRadius: 99,
                  background: "rgba(227,81,238,0.12)",
                  border: "1px solid rgba(227,81,238,0.3)",
                  color: accent,
                  fontSize: 10.5,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {featured.tag}
              </div>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: "linear-gradient(to bottom, transparent, #08080B)",
                }}
              />
            </div>
            <div style={{ padding: "28px 30px 32px" }}>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                {featured.title}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--text-2)",
                  lineHeight: 1.65,
                  margin: 0,
                  marginBottom: 18,
                }}
              >
                {featured.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  fontSize: 12,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.read}</span>
              </div>
            </div>
          </a>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              background: "#08080B",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                }}
              >
                Latest market updates
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--text-3)",
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
                <span className="mono">LIVE</span>
              </span>
            </div>
            <div style={{ flex: 1 }}>
              {posts.map((p, i) => (
                <a
                  key={p.title}
                  href="#"
                  style={{
                    display: "block",
                    padding: "18px 22px",
                    borderBottom: i < posts.length - 1 ? "1px solid var(--line)" : "none",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: accent,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {p.tag}
                    </span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>
                      {p.read}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.4,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>
                    {p.date}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            paddingTop: 16,
            borderTop: "1px solid var(--line)",
          }}
        >
          {["All", "Market briefings", "Product updates", "Research", "Partners", "Tutorials"].map(
            (c, i) => (
              <span
                key={c}
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  color: i === 0 ? accent : "var(--text-2)",
                  background: i === 0 ? "rgba(227,81,238,0.06)" : "transparent",
                  border:
                    i === 0
                      ? "1px solid rgba(227,81,238,0.25)"
                      : "1px solid var(--line)",
                }}
              >
                {c}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
