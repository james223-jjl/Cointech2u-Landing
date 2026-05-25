"use client";

import { useMemo, useState } from "react";
import ArchiveCard from "../components/ArchiveCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { ACCENT } from "../components/theme";
import { useT } from "../lib/i18n";
import { CURATED_NEWS } from "../lib/news";

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ALL_TAG = "All";

export default function NewsPage() {
  const t = useT();
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);

  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const it of CURATED_NEWS) seen.add(it.tag);
    return [ALL_TAG, ...Array.from(seen)];
  }, []);

  const filtered = useMemo(() => {
    if (activeTag === ALL_TAG) return CURATED_NEWS;
    return CURATED_NEWS.filter((it) => it.tag === activeTag);
  }, [activeTag]);

  return (
    <>
      <Nav />
      <main className="ct2u-arch">
        <a href="/#insights" className="ct2u-arch-back mono" aria-label="Back to Discover trends">

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {t("common.back")}
        </a>
        <header className="ct2u-arch-hero">
          <p className="ct2u-arch-eyebrow" style={{ color: ACCENT }}>
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: ACCENT,
                verticalAlign: "middle",
                marginRight: 10,
              }}
            />
            {t("arch.news.eyebrow")}
          </p>
          <h1 className="ct2u-arch-title">
            {t("arch.news.title.line1")}
            <br />
            <span className="ct2u-arch-title-italic">{t("arch.news.title.line2")}</span>
          </h1>
          <p className="ct2u-arch-lede">{t("arch.news.lede")}</p>
        </header>

        {tags.length > 1 && (
          <div className="ct2u-arch-filters" role="tablist" aria-label="Filter news by category">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={tag === activeTag}
                onClick={() => setActiveTag(tag)}
                className={
                  tag === activeTag
                    ? "ct2u-arch-chip ct2u-arch-chip--active mono"
                    : "ct2u-arch-chip mono"
                }
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="ct2u-arch-grid">
          {filtered.map((n) => (
            <ArchiveCard
              key={n.id}
              href={`/news/article/?id=${n.id}`}
              title={n.title}
              excerpt={n.framing}
              date={formatDate(n.date)}
              tag={n.tag}
              image={n.image}
              fallbackKey={String(n.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="ct2u-arch-empty">{t("arch.empty")}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
