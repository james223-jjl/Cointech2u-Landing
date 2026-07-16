"use client";

import { useRef } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

// `id` is the locale-independent discriminator (icon path, "coming soon"
// styling). Other fields are i18n keys, resolved via t() at render time.
const platforms = [
  {
    id: "ios" as const,
    osKey: "app.platform.ios",
    labelKey: "app.platform.ios.label",
    subKey: "app.platform.ios.sub",
  },
  {
    id: "android" as const,
    osKey: "app.platform.android",
    labelKey: "app.platform.android.label",
    subKey: "app.platform.android.sub",
  },
];

export default function AppDownload({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  return (
    <section
      ref={sectionRef}
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
          <div className="ct2u-px-rise-fade">
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
              {t("app.eyebrow")}
            </p>
            <h2
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                letterSpacing: "-0.025em",
                marginBottom: 22,
              }}
            >
              {t("app.title.line1")}
              <br />
              <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
                {t("app.title.line2")}
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            {platforms.map((p) => (
              <div
                key={p.id}
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
                    src={p.id === "ios" ? "/icons/ios.svg" : "/icons/android.svg"}
                    alt={`${t(p.osKey)} icon`}
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
                    {t(p.subKey)}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginTop: 2 }}>{t(p.osKey)}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: p.id === "ios" ? "var(--text-3)" : accent,
                      marginTop: 4,
                    }}
                  >
                    {t(p.labelKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ct2u-phone-stage">
          <div aria-hidden className="ct2u-phone-halo" />
          <div className="ct2u-phone-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mockup.png"
              alt="CoinTech2u mobile app"
              loading="lazy"
              decoding="async"
              className="ct2u-phone"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
