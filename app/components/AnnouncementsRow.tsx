"use client";

import { useEffect, useState } from "react";
import { ACCENT } from "./theme";

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

// External CoinTech app announcement page — opens the canonical detail page
// on app.cointech2u.com in a new tab.
const ALL_URL = "https://app.cointech2u.com/h5/en/announcements";
const detailUrl = (slug: string) => `${ALL_URL}/${slug}`;

// Static fallback shown in `next dev` (where /api/announcements is unavailable
// because Cloudflare Pages Functions don't run) and as a safety net if the
// upstream fetch fails in production. Replaced with live data on mount.
// Image URLs are embedded in `desc` so extractImage() pulls them out the same
// way it does for live API rows — keeps a single rendering code path.
const FALLBACK_ITEMS: Announcement[] = [
  {
    id: -1,
    slug: "equity-guard",
    title: "Equity Guard — Ultimate Portfolio Protection",
    subtitle: "Automatically safeguard your capital and limit maximum drawdown.",
    desc: '<img src="/announcements/equity-guard.png" alt="">',
    created_at: "2025-10-12 00:00:00",
  },
  {
    id: -2,
    slug: "profit-guard",
    title: "Profit Guard — Secure What You Earn",
    subtitle: "Automatically transfer profits and reduce risk exposure.",
    desc: '<img src="/announcements/profit-guard.png" alt="">',
    created_at: "2025-11-04 00:00:00",
  },
  {
    id: -3,
    slug: "features-launch",
    title: "New Features in CoinTech2u 3.0",
    subtitle: "A powerful upgrade to your AI trading experience.",
    desc: '<img src="/announcements/features-launch.png" alt="">',
    created_at: "2025-12-06 00:00:00",
  },
  {
    id: -4,
    slug: "version3.0",
    title: "CoinTech2u 3.0 Is Launching Soon!",
    subtitle: "A brand-new experience is on the way.",
    desc: '<img src="/announcements/version3.0.jpg" alt="">',
    created_at: "2025-12-13 00:00:00",
  },
];

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Pull the first <img src="..."> URL out of the `desc` HTML returned by the
// announcements API — that's the article's hero image, used as the card visual.
function extractImage(desc: string | undefined): string | null {
  if (!desc) return null;
  const m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

// Deterministic gradient based on slug so each fallback card gets a stable
// distinctive visual without external assets.
function gradientFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  const a = Math.abs(hash) % 360;
  const b = (a + 60) % 360;
  return `linear-gradient(135deg, hsl(${a} 65% 28%) 0%, hsl(${b} 70% 18%) 100%)`;
}

export default function AnnouncementsRow({ accent = ACCENT }: { accent?: string }) {
  // Seed with FALLBACK_ITEMS so the row always renders something — even on
  // first paint, even in `next dev` where /api/announcements is unavailable.
  // The fetch below replaces it with live data when the Cloudflare Function
  // succeeds (production / wrangler preview).
  const [items, setItems] = useState<Announcement[]>(FALLBACK_ITEMS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/announcements")
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(r.status)))
      .then((d) => {
        if (cancelled) return;
        const list = d?.data?.announcements?.data;
        if (d?.ok && Array.isArray(list) && list.length > 0) {
          setItems(list.slice(0, 4));
        }
      })
      .catch(() => {
        // Keep showing FALLBACK_ITEMS — no state change needed.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ct2u-app-ann">
      <div className="ct2u-app-ann-header">
        <p className="ct2u-app-ann-eyebrow" style={{ color: accent }}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 24,
              height: 1,
              background: accent,
              verticalAlign: "middle",
              marginRight: 10,
            }}
          />
          Latest announcements
        </p>
        <a href="/announcements/" className="ct2u-app-ann-link">
          View all <span style={{ opacity: 0.5 }}>→</span>
        </a>
      </div>

      <div className="ct2u-app-ann-grid">
        {items.map((it) => {
          const image = extractImage(it.desc);
          return (
            <a
              key={it.id}
              href={detailUrl(it.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-app-ann-card"
            >
              <div
                className="ct2u-app-ann-media"
                style={
                  image ? undefined : { background: gradientFor(it.slug) }
                }
              >
                {image ? (
                  // Plain <img> is fine here — these are upstream CDN URLs and
                  // next/image would require remotePatterns config + breaks
                  // when running under `next export`.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="ct2u-app-ann-media-mark" aria-hidden>
                    {it.title.charAt(0)}
                  </span>
                )}
              </div>

              <div className="ct2u-app-ann-body">
                <div className="ct2u-app-ann-row">
                  <div className="ct2u-app-ann-title">{it.title}</div>
                  <span className="ct2u-app-ann-arrow" aria-hidden>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 L17 7" />
                      <path d="M9 7 H17 V15" />
                    </svg>
                  </span>
                </div>
                {it.subtitle && (
                  <div className="ct2u-app-ann-sub">{it.subtitle}</div>
                )}
                <div className="mono ct2u-app-ann-date">
                  {formatDate(it.created_at)}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
