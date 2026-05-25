"use client";

import { useT } from "../lib/i18n";

// Column groups defined as i18n keys — Partners column intentionally keeps
// literal brand names since exchange names don't translate.
const groups: { titleKey: string; links: { key?: string; literal?: string }[] }[] = [
  {
    titleKey: "footer.col.product",
    links: [
      { key: "footer.link.liveTrading" },
      { key: "footer.link.coreStrengths" },
      { key: "footer.link.performance" },
      { key: "footer.link.mobileApp" },
    ],
  },
  {
    titleKey: "footer.col.partners",
    links: [
      { literal: "OKX" },
      { literal: "Bitget" },
      { literal: "Bybit" },
      { literal: "Binance" },
    ],
  },
  {
    titleKey: "footer.col.resources",
    links: [
      { key: "footer.link.docs" },
      { key: "footer.link.api" },
      { key: "footer.link.blog" },
      { key: "footer.link.status" },
    ],
  },
  {
    titleKey: "footer.col.legal",
    links: [
      { key: "footer.link.terms" },
      { key: "footer.link.privacy" },
      { key: "footer.link.security" },
      { key: "footer.link.disclosures" },
    ],
  },
];

export default function Footer() {
  const t = useT();
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
            {t("footer.tagline")}
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.titleKey}>
            <div
              style={{
                fontSize: 11.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 16,
              }}
            >
              {t(group.titleKey)}
            </div>
            {group.links.map((l, i) => {
              const label = l.key ? t(l.key) : l.literal ?? "";
              return (
                <a
                  key={l.key ?? `${group.titleKey}-${i}`}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: 13.5,
                    color: "var(--text-2)",
                    marginBottom: 10,
                  }}
                >
                  {label}
                </a>
              );
            })}
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
        <span>{t("footer.copyright")}</span>
        <span className="mono">{t("footer.statusLine")}</span>
      </div>
    </footer>
  );
}
