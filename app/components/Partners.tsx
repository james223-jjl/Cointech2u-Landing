"use client";

import { useRef } from "react";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

const partners = [
  {
    name: "OKX",
    tag: "Spot · Futures",
    href: "https://cointech2u.com/reg-okx",
    logo: "/logos/okx.svg",
  },
  {
    name: "Bitget",
    tag: "Copy · Futures",
    href: "https://cointech2u.com/reg-bitget",
    logo: "/logos/bitget.svg",
  },
  {
    name: "Bybit",
    tag: "Derivatives",
    href: "https://cointech2u.com/reg-bybit",
    logo: "/logos/bybit.svg",
  },
  {
    name: "Binance",
    tag: "Spot · Futures",
    href: "https://cointech2u.com/reg-binance",
    logo: "/logos/binance.svg",
  },
];

export default function Partners({ accent = ACCENT }: { accent?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  return (
    <section
      ref={sectionRef}
      id="our-partner"
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 56 }}>
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
            Official partners
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginBottom: 18,
            }}
          >
            Connected to the world&apos;s
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400 }}>
              leading exchanges.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Recognised by the industry&apos;s biggest names for innovation, reliability, and advanced
            AI infrastructure.
          </p>
        </div>

        <div className="ct2u-partner-grid">
          {partners.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-partner-card"
              data-idx={i}
            >
              <div className="ct2u-partner-card-top">
                <span className="mono ct2u-partner-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ct2u-partner-card-arrow" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 L17 7" />
                    <path d="M9 7 H17 V15" />
                  </svg>
                </span>
              </div>
              <div className="ct2u-partner-card-logo">
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" />
              </div>
              <div className="mono ct2u-partner-card-tag">{p.tag}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
