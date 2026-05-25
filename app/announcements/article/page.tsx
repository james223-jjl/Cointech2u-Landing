"use client";

import { Suspense, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import { ACCENT } from "../../components/theme";

type Announcement = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  desc?: string;
  created_at: string;
};
type ApiResponse = {
  ok?: number;
  data?: { announcements?: { data?: Announcement[] } };
};

// Fallback content keyed by slug so direct hits in `next dev` still render
// something useful when the Cloudflare Function isn't available.
const FALLBACK_BY_SLUG: Record<string, Announcement> = {
  "equity-guard": {
    id: -1,
    slug: "equity-guard",
    title: "Equity Guard — Ultimate Portfolio Protection",
    subtitle: "Automatically safeguard your capital and limit maximum drawdown.",
    desc:
      '<img src="/announcements/equity-guard.png" alt="">' +
      "<h2>Equity Guard is now live</h2>" +
      "<p>At CoinTech2u, risk management has always been our top priority. " +
      "Equity Guard adds an automatic floor to every portfolio so a single " +
      "bad regime never wipes out months of compounding.</p>" +
      "<p>Set the floor, the engine enforces it. No babysitting.</p>",
    created_at: "2025-10-12 00:00:00",
  },
  "profit-guard": {
    id: -2,
    slug: "profit-guard",
    title: "Profit Guard — Secure What You Earn",
    subtitle: "Automatically transfer profits and reduce risk exposure.",
    desc:
      '<img src="/announcements/profit-guard.png" alt="">' +
      "<h2>Lock in gains as they accumulate</h2>" +
      "<p>Profit Guard ratchets your protected base upward over time — " +
      "every time the portfolio crosses a configurable threshold, profits " +
      "are swept off the table and your downside floor is reset higher.</p>",
    created_at: "2025-11-04 00:00:00",
  },
  "features-launch": {
    id: -3,
    slug: "features-launch",
    title: "New Features in CoinTech2u 3.0",
    subtitle: "A powerful upgrade to your AI trading experience.",
    desc:
      '<img src="/announcements/features-launch.png" alt="">' +
      "<h2>What's new in 3.0</h2>" +
      "<p>Faster execution, refreshed dashboards, new exchange integrations, " +
      "and a fully redesigned mobile experience.</p>",
    created_at: "2025-12-06 00:00:00",
  },
  "version3.0": {
    id: -4,
    slug: "version3.0",
    title: "CoinTech2u 3.0 Is Launching Soon!",
    subtitle: "A brand-new experience is on the way.",
    desc:
      '<img src="/announcements/version3.0.jpg" alt="">' +
      "<h2>Built for clarity and efficiency</h2>" +
      "<p>3.0 offers a smoother way to explore insights, market news, " +
      "analytics, and portfolio trends — clean, fast, and unmistakably " +
      "CoinTech2u.</p>",
    created_at: "2025-12-13 00:00:00",
  },
};

function extractImage(desc: string | undefined): string | null {
  if (!desc) return null;
  const m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

// Remove the first <img> from the body since we render it as the hero
// separately. Leaves any subsequent inline images in place.
function stripFirstImage(desc: string | undefined): string {
  if (!desc) return "";
  return desc.replace(/<img[^>]*>\s*/i, "");
}

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readSlug(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("slug");
}

function AnnouncementArticleContent() {
  const [item, setItem] = useState<Announcement | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">(
    "loading",
  );

  useEffect(() => {
    const slug = readSlug();
    if (!slug) {
      setStatus("notfound");
      return;
    }
    // Seed with fallback if we recognize the slug — keeps the page from
    // flashing a skeleton when running on `next dev` or when the API is slow.
    const seed = FALLBACK_BY_SLUG[slug];
    if (seed) {
      setItem(seed);
      setStatus("ok");
    }

    let cancelled = false;
    fetch("/api/announcements")
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(r.status)))
      .then((d) => {
        if (cancelled) return;
        const list = d?.data?.announcements?.data;
        if (!Array.isArray(list)) {
          if (!seed) setStatus("error");
          return;
        }
        const found = list.find((a) => a.slug === slug);
        if (found) {
          setItem(found);
          setStatus("ok");
        } else if (!seed) {
          setStatus("notfound");
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (!seed) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading" && !item) return <ArticleSkeleton />;
  if (status === "notfound" || !item) {
    return (
      <ArticleEmpty
        title="Announcement not found"
        body="This announcement may have been removed or the link is incorrect."
      />
    );
  }
  if (status === "error" && !item) {
    return (
      <ArticleEmpty
        title="Unable to load"
        body="We couldn't reach the announcements service right now. Please try again shortly."
      />
    );
  }

  const heroImage = extractImage(item.desc);
  const body = stripFirstImage(item.desc);

  return (
    <article className="ct2u-article">
      <header className="ct2u-article-head">
        <p className="ct2u-article-tag mono" style={{ color: ACCENT }}>
          Update
        </p>
        <h1 className="ct2u-article-title">{item.title}</h1>
        {item.subtitle && (
          <p className="ct2u-article-subtitle">{item.subtitle}</p>
        )}
        <div className="ct2u-article-meta mono">
          <span>{formatDate(item.created_at)}</span>
          <span aria-hidden>·</span>
          <a
            href={`https://app.cointech2u.com/h5/en/announcements/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read on app.cointech2u.com ↗
          </a>
        </div>
      </header>

      {heroImage && (
        <div className="ct2u-article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="" loading="eager" decoding="async" />
        </div>
      )}

      <div
        className="ct2u-prose"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}

export default function AnnouncementArticlePage() {
  return (
    <>
      <Nav />
      <main className="ct2u-article-page">
        <a
          href="/announcements/"
          className="ct2u-arch-back mono"
          aria-label="Back to announcements"
        >
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
          Back to announcements
        </a>
        <Suspense fallback={<ArticleSkeleton />}>
          <AnnouncementArticleContent />
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
      <a href="/announcements/" className="ct2u-arch-back mono">
        Back to announcements
      </a>
    </div>
  );
}
