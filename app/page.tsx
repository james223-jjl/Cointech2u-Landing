import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LiveTrading from "./components/LiveTrading";
import Partners from "./components/Partners";
import CoreStrengths from "./components/CoreStrengths";
import Steps from "./components/Steps";
import Tutorials from "./components/Tutorials";
import Performance from "./components/Performance";
import UserResults from "./components/UserResults";
import Insights from "./components/Insights";
import AppDownload from "./components/AppDownload";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import { faqItems } from "./components/faq-data";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LiveTrading />
        <Partners />
        <CoreStrengths />
        <Steps />
        <Tutorials />
        <Performance />
        <UserResults />
        <Insights />
        <AppDownload />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
