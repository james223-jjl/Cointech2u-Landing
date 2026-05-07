"use client";

import { useEffect, useState } from "react";
import { ACCENT } from "./theme";

const links: [string, string][] = [
  ["Live Trading", "#trading"],
  ["User Results", "#user-result"],
  ["Core Strengths", "#core-strengths"],
  ["Our Partners", "#our-partner"],
  ["FAQ", "#faq"],
];

export default function Nav({ accent = ACCENT }: { accent?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter:
            scrolled || mobileOpen ? "blur(20px) saturate(140%)" : "none",
          WebkitBackdropFilter:
            scrolled || mobileOpen ? "blur(20px) saturate(140%)" : "none",
          background:
            scrolled || mobileOpen ? "rgba(5, 5, 7, 0.7)" : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--line)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
        aria-label="Primary"
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <a
            href="/"
            style={{ display: "flex", alignItems: "center" }}
            onClick={closeMobile}
            aria-label="CoinTech2u — home"
          >
            {/* Brand lockup SVG includes wordmark — no separate text span. */}
            <img
              src="/cointech.svg"
              alt="CoinTech2u"
              width={220}
              height={44}
              style={{ height: 44, width: "auto", display: "block" }}
            />
          </a>

          <div className="ct2u-nav-links">
            {links.map(([l, h]) => (
              <a key={l} href={h} className="ct2u-nav-link">
                {l}
              </a>
            ))}
          </div>

          <div className="ct2u-nav-cta-group">
            <a
              href="https://app.cointech2u.com/h5/index.html#/pages/login/login"
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-nav-login"
            >
              Log in
            </a>
            <a
              href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-nav-signup"
            >
              Sign up →
            </a>
          </div>

          <button
            className={mobileOpen ? "ct2u-hamburger open" : "ct2u-hamburger"}
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="ct2u-mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        id="ct2u-mobile-menu"
        className={mobileOpen ? "ct2u-mobile-menu open" : "ct2u-mobile-menu"}
        aria-hidden={!mobileOpen}
      >
        {links.map(([l, h]) => (
          <a
            key={l}
            href={h}
            className="ct2u-mobile-link"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
          >
            {l}
          </a>
        ))}
        <div className="ct2u-mobile-cta-group">
          <a
            href="https://app.cointech2u.com/h5/index.html#/pages/login/login"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px 18px",
              border: "1px solid var(--line-strong)",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.04)",
              color: "var(--text)",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Log in
          </a>
          <a
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px 18px",
              borderRadius: 10,
              background: `linear-gradient(135deg, #7C7CFF, ${accent})`,
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              boxShadow: `0 0 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            Sign up →
          </a>
        </div>
      </div>
    </>
  );
}
