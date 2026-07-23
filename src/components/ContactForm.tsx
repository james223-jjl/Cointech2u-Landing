"use client";

import { useState, FormEvent } from "react";
import { ArrowIcon } from "./ArrowIcon";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mute">
            Name
          </span>
          <input
            required
            type="text"
            className="mt-1 w-full bg-transparent border-b hairline focus:border-neon outline-none py-2 text-paper text-sm"
            placeholder="Satoshi N."
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mute">
            Email
          </span>
          <input
            required
            type="email"
            className="mt-1 w-full bg-transparent border-b hairline focus:border-neon outline-none py-2 text-paper text-sm"
            placeholder="you@domain.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[10px] font-mono uppercase tracking-widest text-mute">
          Telegram
        </span>
        <input
          type="text"
          className="mt-1 w-full bg-transparent border-b hairline focus:border-neon outline-none py-2 text-paper text-sm"
          placeholder="@username"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-mono uppercase tracking-widest text-mute">
          Subject
        </span>
        <input
          type="text"
          className="mt-1 w-full bg-transparent border-b hairline focus:border-neon outline-none py-2 text-paper text-sm"
          placeholder="Partnership enquiry"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-mono uppercase tracking-widest text-mute">
          Message
        </span>
        <textarea
          rows={4}
          className="mt-1 w-full bg-transparent border-b hairline focus:border-neon outline-none py-2 text-paper text-sm resize-none"
          placeholder="Tell us what you're building…"
        />
      </label>
      <button
        type="submit"
        className="btn-primary px-6 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2 mt-2"
      >
        Send message
        <ArrowIcon />
      </button>
      {sent && (
        <div className="text-xs text-profit">
          Thanks — we&apos;ll be in touch within 48h.
        </div>
      )}
    </form>
  );
}
