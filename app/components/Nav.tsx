"use client";

import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { ACCENT } from "./theme";

// Translation keys for nav labels — resolved at render via the i18n hook
// so the bar swaps language live without remounting.
const navItems: { key: string; href: string }[] = [
  { key: "nav.liveTrading", href: "/#trading" },
  { key: "nav.userResults", href: "/#user-result" },
  { key: "nav.coreStrengths", href: "/#core-strengths" },
  { key: "nav.ourPartners", href: "/#our-partner" },
  { key: "nav.news", href: "/#insights" },
  { key: "nav.faq", href: "/#faq" },
];

export default function Nav({ accent = ACCENT }: { accent?: string }) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // virtuals.io-style scroll behavior:
  //   • Show nav at the very top of the page (no hide threshold reached yet)
  //   • Hide when the user scrolls DOWN past ~80px
  //   • Show again the moment they scroll UP, even mid-page
  //   • A small delta (4px) suppresses jitter from inertial scroll wobble
  // Uses a ref-style closure variable (`lastY`) instead of useState so the
  // scroll handler doesn't trigger React re-renders on every wheel tick.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const DELTA = 4;
    const HIDE_AFTER = 80;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const diff = y - lastY;
      if (Math.abs(diff) > DELTA) {
        if (diff > 0 && y > HIDE_AFTER) {
          setHidden(true); // scrolling down past threshold
        } else if (diff < 0) {
          setHidden(false); // any upward scroll
        }
        lastY = y;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile menu open always forces nav visible — can't hide the close button.
  const isHidden = hidden && !mobileOpen;

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
          // Slide the bar off-canvas when hidden. Separate transition speeds
          // for transform vs the chrome props so the slide feels snappy
          // while the blur/background still fade smoothly.
          transform: isHidden ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 0.35s cubic-bezier(.22,.61,.36,1), background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
          willChange: "transform",
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
            {navItems.map((item) => (
              <a key={item.key} href={item.href} className="ct2u-nav-link">
                {t(item.key)}
              </a>
            ))}
          </div>

          <div className="ct2u-nav-cta-group">
            <LanguageSwitcher />
            <a
              href="https://app.cointech2u.com/h5/index.html#/pages/login/login"
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-nav-login"
            >
              {t("nav.login")}
            </a>
            <a
              href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
              target="_blank"
              rel="noopener noreferrer"
              className="ct2u-nav-signup"
            >
              {t("nav.signup")}
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
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="ct2u-mobile-link"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
          >
            {t(item.key)}
          </a>
        ))}
        <div className="ct2u-mobile-cta-group">
          <div className="ct2u-mobile-lang">
            <LanguageSwitcher />
          </div>
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
            {t("nav.login")}
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
            {t("nav.signup")}
          </a>
        </div>
      </div>
    </>
  );
}
