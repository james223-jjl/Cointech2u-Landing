"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { protocolTheme } from "../../lib/theme";

const NAV_ITEMS = ["Product", "Performance", "Docs", "Pricing"];

export default function HeroOverlay() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const els = [
      headerRef.current,
      eyebrowRef.current,
      h1Ref.current,
      subRef.current,
      ctaRef.current,
    ].filter(Boolean) as HTMLElement[];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(headerRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.5)
      .to(h1Ref.current, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
      .to(
        subRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        1.15,
      )
      .to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        1.3,
      );
  }, []);

  const hiddenStyle = { opacity: 0, transform: "translateY(20px)" };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        ref={headerRef}
        style={{
          ...hiddenStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 32px",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: "-0.01em",
          }}
        >
          CoinTech2u
        </div>
        <nav
          style={{
            display: "flex",
            gap: 30,
            fontSize: 13,
            color: protocolTheme.textMuted,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: protocolTheme.text,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Launch App
        </a>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 32px 14vh",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          ref={eyebrowRef}
          style={{
            ...hiddenStyle,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: protocolTheme.pulse,
            marginBottom: 22,
          }}
        >
          // EXECUTION ENGINE · v4
        </div>

        <h1
          ref={h1Ref}
          style={{
            ...hiddenStyle,
            fontFamily: "var(--font-inter-tight)",
            fontSize: "clamp(44px, 6.5vw, 88px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 24px",
            maxWidth: 920,
          }}
        >
          <span style={{ display: "block" }}>Trade intelligence,</span>
          <span style={{ display: "block" }}>
            not{" "}
            <em
              style={{
                fontStyle: "normal",
                background: `linear-gradient(135deg, ${protocolTheme.base}, ${protocolTheme.pulse} 50%, ${protocolTheme.mint})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              emotion
            </em>
            .
          </span>
        </h1>

        <p
          ref={subRef}
          style={{
            ...hiddenStyle,
            color: protocolTheme.textMuted,
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: 580,
            margin: "0 0 36px",
          }}
        >
          AI-powered precision, real-time analytics, and verified intelligence —
          for traders in 100+ countries.
        </p>

        <div
          ref={ctaRef}
          style={{
            ...hiddenStyle,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <a
            href="#"
            style={{
              padding: "13px 22px",
              borderRadius: 10,
              background: `linear-gradient(135deg, ${protocolTheme.base}, ${protocolTheme.pulse})`,
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: `0 0 30px ${protocolTheme.pulse}55`,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Get started <span style={{ opacity: 0.7 }}>→</span>
          </a>
          <a
            href="#"
            style={{
              padding: "13px 22px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: protocolTheme.text,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: "#34d399",
                boxShadow: "0 0 8px #34d399",
              }}
            />
            View live performance
          </a>
        </div>
      </main>
    </div>
  );
}
