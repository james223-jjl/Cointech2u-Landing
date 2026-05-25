"use client";

import { useRef, useState } from "react";
import { useT } from "../lib/i18n";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

type FieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
};

function Field({ label, placeholder, type = "text", textarea }: FieldProps) {
  const sharedStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 11.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-3)",
        }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea placeholder={placeholder} rows={5} style={{ ...sharedStyle, resize: "vertical" }} />
      ) : (
        <input type={type} placeholder={placeholder} style={sharedStyle} />
      )}
    </label>
  );
}

export default function Contact({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          gridTemplateColumns: "1fr 1.2fr",
          gap: 80,
          alignItems: "flex-start",
        }}
      >
        <div className="ct2u-px-rise-fade">
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
            {t("contact.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(42px, 5vw, 68px)",
              letterSpacing: "-0.025em",
              marginBottom: 22,
            }}
          >
            {t("contact.title.line1")}
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
              {t("contact.title.line2")}
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 28 }}>
            {t("contact.lede")}
          </p>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 22 }}>
            <div
              style={{
                fontSize: 11.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                marginBottom: 10,
              }}
            >
              {t("contact.support.heading")}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>
              {t("contact.support.telegram")}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-2)" }}>{t("contact.support.chat")}</div>
          </div>
        </div>

        <form onSubmit={handle} style={{ display: "grid", gap: 14 }}>
          <div className="ct2u-md-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t("contact.field.name")} placeholder={t("contact.field.name.placeholder")} />
            <Field label={t("contact.field.email")} type="email" placeholder={t("contact.field.email.placeholder")} />
          </div>
          <div className="ct2u-md-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t("contact.field.telegram")} placeholder={t("contact.field.telegram.placeholder")} />
            <Field label={t("contact.field.subject")} placeholder={t("contact.field.subject.placeholder")} />
          </div>
          <Field label={t("contact.field.message")} placeholder={t("contact.field.message.placeholder")} textarea />
          <button
            type="submit"
            className="ct2u-contact-submit"
            style={{
              justifySelf: "flex-start",
              padding: "14px 22px",
              borderRadius: 10,
              background: submitted
                ? "rgba(52,211,153,0.1)"
                : `linear-gradient(135deg, #7C7CFF, ${accent})`,
              color: submitted ? "var(--green)" : "#fff",
              fontSize: 14,
              fontWeight: 500,
              border: submitted ? "1px solid rgba(52,211,153,0.3)" : "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: submitted
                ? "none"
                : `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
              marginTop: 8,
              cursor: "pointer",
            }}
          >
            {submitted ? (
              t("contact.submit.success")
            ) : (
              <>
                {t("contact.submit")} <span style={{ opacity: 0.4 }}>→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
