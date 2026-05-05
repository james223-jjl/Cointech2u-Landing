import { ACCENT } from "./theme";

type StepMedia = { type: "gif"; src: string } | { type: "video"; src: string };

const steps: {
  num: string;
  title: string;
  body: string;
  kicker: string;
  media: StepMedia;
}[] = [
  {
    num: "01",
    title: "Connect your exchange",
    body: "Securely link your OKX, Bitget, Bybit, or Binance account via Fast API. No manual configuration — just a few clicks and you're ready to go.",
    kicker: "~30 seconds",
    media: { type: "gif", src: "/videos/step-01.gif" },
  },
  {
    num: "02",
    title: "Quick setup",
    body: "The AI automatically analyzes your trading balance and generates an optimized configuration tailored to you. No guesswork — personalized automation from the start.",
    kicker: "Automatic",
    media: { type: "gif", src: "/videos/step-02.gif" },
  },
  {
    num: "03",
    title: "AI in action",
    body: "Sit back and let CoinTech2u's engine work for you. It continuously monitors, analyzes, and rebalances your portfolio 24/7 for smarter, data-driven results.",
    kicker: "Continuous",
    media: { type: "video", src: "/videos/step-03.mp4" },
  },
];

export default function Steps({ accent = ACCENT }: { accent?: string }) {
  return (
    <section
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 72,
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
            Get started
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 20,
            }}
          >
            Get started in
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              3 simple steps.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Start your AI-powered trading journey in minutes — no setup hassle, no trading
            experience needed.
          </p>
        </div>

        <div
          className="ct2u-md-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid var(--line)",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="ct2u-step-card"
              style={{
                padding: "40px 36px 44px",
                borderRight: i < 2 ? "1px solid var(--line)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 36,
                }}
              >
                <span className="mono" style={{ fontSize: 13, color: accent }}>
                  {s.num}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                  }}
                >
                  {s.kicker}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  marginBottom: 14,
                  letterSpacing: "-0.015em",
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>
                {s.body}
              </p>
              <div style={{ height: 32, flexShrink: 0 }} aria-hidden />
              <div
                style={{
                  aspectRatio: "16 / 9",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#08080B",
                  marginTop: "auto",
                }}
              >
                {s.media.type === "video" ? (
                  <video
                    src={s.media.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      display: "block",
                    }}
                  />
                ) : (
                  <img
                    src={s.media.src}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      display: "block",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
