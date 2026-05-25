"use client";

import { useEffect, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES, useLanguage, type LangCode } from "../lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (next: LangCode) => {
    setLang(next);
    setOpen(false);
  };

  const active = SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  return (
    <div ref={rootRef} className="ct2u-lang">
      <button
        type="button"
        className="ct2u-lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language — current: ${active.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span>{active.label}</span>
        <svg
          className="ct2u-lang-caret"
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <ul className="ct2u-lang-menu" role="listbox" aria-label="Language">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isActive = l.code === lang;
            return (
              <li key={l.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={
                    isActive
                      ? "ct2u-lang-item ct2u-lang-item--active"
                      : "ct2u-lang-item"
                  }
                  onClick={() => pick(l.code)}
                >
                  <span>{l.label}</span>
                  {isActive && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
