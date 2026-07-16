"use client";

import { useRef } from "react";
import AnnouncementsRow from "./AnnouncementsRow";
import FeaturedSlider from "./FeaturedSlider";
import { useT } from "../lib/i18n";
import { CURATED_NEWS } from "../lib/news";
import { ACCENT } from "./theme";
import { useParallax } from "./useParallax";

type Post = {
  tag: string;
  title: string;
  date: string;
  read: string;
  href: string;
};

function readTime(html: string | undefined, fallback: string): string {
  const source = html || fallback;
  const text = source.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  // Floor ~220 wpm; assume 1 min minimum so the row never reads "0 min".
  const min = Math.max(1, Math.ceil(words / 220));
  return `${min} min`;
}

function formatNewsDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Insights({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  // Top 5 of the same curated MyCoinDeck index the /news/ page renders, so
  // the homepage rail and the archive stay in sync. Each row links into the
  // internal article detail page.
  const posts: Post[] = CURATED_NEWS.slice(0, 5).map((n) => ({
    tag: n.tag,
    title: n.title,
    date: formatNewsDate(n.date),
    read: readTime(n.body, n.framing),
    href: `/news/article/?id=${n.id}`,
  }));
  return (
    <section
      ref={sectionRef}
      id="insights"
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
              {t("insights.eyebrow")}
            </p>
            <h2
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                letterSpacing: "-0.025em",
                marginBottom: 18,
              }}
            >
              {t("insights.title.line1")}
              <br />
              <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
                {t("insights.title.line2")}
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6 }}>
              {t("insights.lede")}
            </p>
          </div>
          <a
            href="/news/"
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
            {t("common.viewAllArticles")} <span style={{ opacity: 0.4 }}>→</span>
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
          <FeaturedSlider accent={accent} />

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
                {t("insights.rail.title")}
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
                  key={`${p.title}-${i}`}
                  href={p.href}
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

        <AnnouncementsRow accent={accent} />
      </div>
    </section>
  );
}
