import { BlurReveal } from "../BlurReveal";
import { ContactForm } from "../ContactForm";

const faqs = [
  {
    q: "What is CoinTech2u?",
    a: "An AI trading tool that automates your crypto futures trading with a 98% verified win-rate. It monitors the market, analyses entry and exit opportunities, and executes trades automatically — so you can trade smarter, faster, and stress-free.",
  },
  {
    q: "Is CoinTech2u safe to use?",
    a: "Yes. We run a zero-custody model: your funds always remain in your own exchange account. Our API connections are fully encrypted with trade-only permissions — withdrawal access is never granted, under any circumstances.",
  },
  {
    q: "What makes CoinTech2u different from manual trading?",
    a: "We automate the hardest parts of trading — real-time analytics, market insights, portfolio tracking — behind one clean dashboard. Our proprietary AI engine has been refined over four years of live performance and is trusted by 240,000+ users for its consistency.",
  },
  {
    q: "Do I need trading experience to use CoinTech2u?",
    a: "No. CoinTech2u is built for beginners and pros alike. The AI handles every piece of complex analysis and strategy execution — you just watch your portfolio perform.",
  },
  {
    q: "How do I connect my exchange account?",
    a: "Log in, go to Fast API Binding, and follow the on-screen steps. It takes under a minute with no technical experience required. Your futures account syncs automatically in real time.",
  },
  {
    q: "Can I monitor multiple exchange accounts at once?",
    a: "Yes. You can bind, manage, and track multiple exchange sub-accounts simultaneously — ideal if you diversify across strategies, portfolio sizes, or risk levels.",
  },
  {
    q: "Is there customer support if I face issues?",
    a: "Yes. We provide in-app live chat and a dedicated Telegram channel at t.me/CoinTech2u_Admin for setup, technical support, and general questions.",
  },
];

export function FaqContact() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-32 border-t hairline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16">
          <div>
            <div className="eyebrow mb-4">— Answers</div>
            <h2 className="display text-5xl md:text-6xl mb-10">
              <BlurReveal>
                You probably
                <br />
                want to know.
              </BlurReveal>
            </h2>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <details
                  key={f.q}
                  className="border-b hairline py-5 group"
                  open={i === 0}
                >
                  <summary className="flex items-start justify-between gap-6">
                    <span className="font-display text-xl md:text-2xl text-paper">
                      {f.q}
                    </span>
                    <span className="chev text-neon text-2xl leading-none mt-1">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 text-paper/60 leading-relaxed pr-12">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="card p-8 md:p-10 self-start">
            <div className="eyebrow mb-4">— Let&apos;s talk</div>
            <h3 className="font-display text-3xl mb-3">
              Partner, press, or power user?
            </h3>
            <p className="text-paper/60 leading-relaxed mb-8">
              Drop a note. We&apos;ll reach out within 48 hours to explore how
              we can work together.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
