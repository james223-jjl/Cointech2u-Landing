"use client";

import { useEffect, useState } from "react";
import ArchiveCard from "../components/ArchiveCard";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { ACCENT } from "../components/theme";
import { useT } from "../lib/i18n";

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

function extractImage(desc: string | undefined): string | null {
  if (!desc) return null;
  const m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AnnouncementsPage() {
  const t = useT();
  const [items, setItems] = useState<Announcement[]>(FALLBACK_ITEMS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/announcements")
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(r.status)))
      .then((d) => {
        if (cancelled) return;
        const list = d?.data?.announcements?.data;
        if (d?.ok && Array.isArray(list) && list.length > 0) setItems(list);
      })
      .catch(() => {
        // Keep FALLBACK_ITEMS.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            {t("arch.ann.eyebrow")}
          </p>
          <h1 className="ct2u-arch-title">
            {t("arch.ann.title.line1")}
            <br />
            <span className="ct2u-arch-title-italic">{t("arch.ann.title.line2")}</span>
          </h1>
          <p className="ct2u-arch-lede">{t("arch.ann.lede")}</p>
        </header>

        <div className="ct2u-arch-grid">
          {items.map((it) => (
            <ArchiveCard
              key={it.id}
              href={`https://app.cointech2u.com/h5/en/announcements/${encodeURIComponent(it.slug)}`}
              external
              title={it.title}
              excerpt={it.subtitle}
              date={formatDate(it.created_at)}
              tag="Update"
              image={extractImage(it.desc)}
              fallbackKey={it.slug}
            />
          ))}
        </div>

        {items.length === 0 && (
          <p className="ct2u-arch-empty">{t("arch.empty")}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
