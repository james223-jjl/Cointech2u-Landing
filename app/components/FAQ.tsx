"use client";

import { useState } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { faqItems } from "./faq-data";

export default function FAQ({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="reveal ct2u-section"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--line)" }}
    >
      <div
        className="ct2u-md-stack"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: 80,
          alignItems: "flex-start",
        }}
      >
        <div className="ct2u-faq-aside" style={{ position: "sticky", top: 120 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.06em",
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
            {t("faq.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(42px, 5vw, 68px)",
              letterSpacing: "-0.025em",
              marginBottom: 22,
            }}
          >
            {t("faq.title.line1")}
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
              {t("faq.title.line2")}
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6 }}>
            {t("faq.lede")}
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--line)" }}>
          {faqItems.map((it, i) => (
            <div key={it.qKey} style={{ borderBottom: "1px solid var(--line)" }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "24px 0",
                  background: "transparent",
                  border: "none",
                  color: "var(--text)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 24,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em" }}>
                  {t(it.qKey)}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: 99,
                    border: "1px solid var(--line-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: open === i ? accent : "var(--text-2)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: open === i ? 280 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s ease, padding 0.25s ease",
                  paddingBottom: open === i ? 24 : 0,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: 680,
                  }}
                >
                  {t(it.aKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
