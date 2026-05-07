const groups: [string, string[]][] = [
  ["Product", ["Live Trading", "Core Strengths", "Performance", "Mobile App"]],
  ["Partners", ["OKX", "Bitget", "Bybit", "Binance"]],
  ["Resources", ["Docs", "API", "Blog", "Status"]],
  ["Legal", ["Terms", "Privacy", "Security", "Disclosures"]],
];

export default function Footer() {
  return (
    <footer className="ct2u-section" style={{ padding: "60px 32px 40px", borderTop: "1px solid var(--line)" }}>
      <div
        className="ct2u-md-stack"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <img
              src="/cointech.svg"
              alt="CoinTech2u"
              width={220}
              height={44}
              style={{ height: 44, width: "auto", display: "block" }}
            />
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-3)",
              maxWidth: 320,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            AI-powered crypto trading infrastructure. Non-custodial by design.
          </p>
        </div>

        {groups.map(([title, links]) => (
          <div key={title}>
            <div
              style={{
                fontSize: 11.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 16,
              }}
            >
              {title}
            </div>
            {links.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: "block",
                  fontSize: 13.5,
                  color: "var(--text-2)",
                  marginBottom: 10,
                }}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "60px auto 0",
          paddingTop: 24,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 12,
          color: "var(--text-3)",
        }}
      >
        <span>© 2026 CoinTech2u. Crypto trading involves substantial risk.</span>
        <span className="mono">v4.2.1 · all systems operational</span>
      </div>
    </footer>
  );
}
