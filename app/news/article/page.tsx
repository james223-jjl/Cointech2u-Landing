"use client";

import { Suspense, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import { ACCENT } from "../../components/theme";
import { findCuratedById, type CuratedNewsItem } from "../../lib/news";

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readId(): number | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search).get("id");
  if (!p) return null;
  const n = parseInt(p, 10);
  return Number.isNaN(n) ? null : n;
}

function NewsArticleContent() {
  const [item, setItem] = useState<CuratedNewsItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound">("loading");

  useEffect(() => {
    const id = readId();
    if (id === null) {
      setStatus("notfound");
      return;
    }
    const found = findCuratedById(id);
    if (found) {
      setItem(found);
      setStatus("ok");
    } else {
      setStatus("notfound");
    }
  }, []);

  if (status === "loading") return <ArticleSkeleton />;
  if (status === "notfound" || !item) {
    return (
      <ArticleEmpty
        title="Article not found"
        body="This story may have been removed or the link is incorrect."
      />
    );
  }

  // If the curated entry has no long-form body yet, surface the framing
  // line as the body paragraph so the page still feels intentional.
  const body =
    item.body ??
    `<p>${escapeHtml(item.framing)}</p>` +
      "<p>For the full reporting and context, read the original story on " +
      `<a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">MyCoinDeck</a>.</p>`;

  return (
    <article className="ct2u-article">
      <header className="ct2u-article-head">
        <p className="ct2u-article-tag mono" style={{ color: ACCENT }}>
          {item.tag}
        </p>
        <h1 className="ct2u-article-title">{item.title}</h1>
        <div className="ct2u-article-meta mono">
          <span>{formatDate(item.date)}</span>
          <span aria-hidden>·</span>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            Original source ↗
          </a>
        </div>
      </header>

      {item.image && (
        <div className="ct2u-article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" loading="eager" decoding="async" />
        </div>
      )}

      <div className="ct2u-prose" dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function NewsArticlePage() {
  return (
    <>
      <Nav />
      <main className="ct2u-article-page">
        <a href="/news/" className="ct2u-arch-back mono" aria-label="Back to news">
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
          Back to news
        </a>
        <Suspense fallback={<ArticleSkeleton />}>
          <NewsArticleContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div className="ct2u-article ct2u-article-skel" aria-hidden>
      <div className="ct2u-article-skel-line" style={{ width: "80px", height: 14 }} />
      <div className="ct2u-article-skel-line" style={{ width: "85%", height: 36, marginTop: 20 }} />
      <div className="ct2u-article-skel-line" style={{ width: "60%", height: 36, marginTop: 10 }} />
      <div className="ct2u-article-skel-line" style={{ width: "240px", height: 12, marginTop: 24 }} />
      <div className="ct2u-article-skel-block" style={{ marginTop: 40 }} />
      <div className="ct2u-article-skel-line" style={{ width: "100%", marginTop: 32 }} />
      <div className="ct2u-article-skel-line" style={{ width: "94%", marginTop: 10 }} />
      <div className="ct2u-article-skel-line" style={{ width: "88%", marginTop: 10 }} />
    </div>
  );
}

function ArticleEmpty({ title, body }: { title: string; body: string }) {
  return (
    <div className="ct2u-article ct2u-article-empty">
      <h1 className="ct2u-article-title">{title}</h1>
      <p className="ct2u-article-empty-body">{body}</p>
      <a href="/news/" className="ct2u-arch-back mono">
        Back to news
      </a>
    </div>
  );
}
