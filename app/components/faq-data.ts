// Translation-key pairs — the actual Q&A copy lives in app/lib/i18n.tsx so the
// content swaps language with the rest of the page. Keep the order stable; the
// FAQ component and the JSON-LD generator both rely on it.
export const faqItems = [
  { qKey: "faq.q1.q", aKey: "faq.q1.a" },
  { qKey: "faq.q2.q", aKey: "faq.q2.a" },
  { qKey: "faq.q3.q", aKey: "faq.q3.a" },
  { qKey: "faq.q4.q", aKey: "faq.q4.a" },
  { qKey: "faq.q5.q", aKey: "faq.q5.a" },
  { qKey: "faq.q6.q", aKey: "faq.q6.a" },
  { qKey: "faq.q7.q", aKey: "faq.q7.a" },
] as const;
