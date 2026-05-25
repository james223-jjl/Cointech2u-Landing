import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LivePerformance from "./components/LivePerformance";
import Partners from "./components/Partners";
import CoreStrengths from "./components/CoreStrengths";
import Tutorials from "./components/Tutorials";
import Leaders from "./components/Leaders";
import Insights from "./components/Insights";
import AppDownload from "./components/AppDownload";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
// Canonical English Q&A for SEO JSON-LD. The page-level FAQ renders via the
// i18n hook (so it swaps language with the rest of the page), but JSON-LD is
// emitted server-side and indexed by crawlers under <html lang="en"> — so we
// keep these strings inlined and in English here. Mirrors faq-data.ts order.
const faqJsonLdEntries: { name: string; text: string }[] = [
  {
    name: "What is CoinTech2u?",
    text: "CoinTech2u is an AI-powered trading infrastructure that automates crypto futures trading on your behalf. The engine handles market monitoring, entry/exit analysis, and execution — your funds stay in your own exchange account at all times.",
  },
  {
    name: "Is CoinTech2u safe to use?",
    text: "Yes. CoinTech2u operates on a zero-custody model. Your funds always remain in your own exchange account. API connections are fully encrypted, read-only, and trade-only — withdrawal access is rejected by design.",
  },
  {
    name: "What makes CoinTech2u different from manual trading?",
    text: "CoinTech2u automates the complex part of trading through AI-driven analytics, real-time market insights, and smart portfolio tracking — all in one dashboard. The engine has been refined over four years of live performance data.",
  },
  {
    name: "Do I need trading experience to use CoinTech2u?",
    text: "No. CoinTech2u is designed for both beginners and experienced traders. Our AI handles the analysis and strategy execution. You simply observe portfolio performance — no manual trading or constant market monitoring required.",
  },
  {
    name: "How do I connect my exchange account?",
    text: "Log in to your CoinTech2u account, navigate to Fast API Binding, and follow the on-screen instructions. The process takes less than a minute. Your futures account and trading activity sync automatically in real time.",
  },
  {
    name: "Can I monitor multiple exchange accounts at once?",
    text: "Yes. CoinTech2u supports binding, managing, and tracking multiple sub-accounts simultaneously — ideal for users who diversify capital across portfolio sizes, coin selection, or risk levels.",
  },
  {
    name: "Is there customer support if I face issues?",
    text: "Yes. We provide dedicated support through in-app live chat and our official Telegram channel. Our team helps with setup guidance, technical support, and general inquiries.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqJsonLdEntries.map(({ name, text }) => ({
    "@type": "Question",
    name,
    acceptedAnswer: { "@type": "Answer", text },
  })),
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LivePerformance />
        <Partners />
        <CoreStrengths />
        <Tutorials />
        {/* <Performance /> hidden — re-enable when metrics are real */}
        <Leaders />
        <Insights />
        <AppDownload />
        <FAQ />
        <Contact />
        {/* <FinalCTA /> hidden — restore when ready */}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
