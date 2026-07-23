import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/sections/Hero";
import { Pulse } from "@/components/sections/Pulse";
import { Partners } from "@/components/sections/Partners";
import { Strengths } from "@/components/sections/Strengths";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TutorialsSection } from "@/components/sections/TutorialsSection";
import { Results } from "@/components/sections/Results";
import { Insights } from "@/components/sections/Insights";
import { FaqContact } from "@/components/sections/FaqContact";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reveal><Pulse /></Reveal>
        <Reveal><Partners /></Reveal>
        <Reveal><Strengths /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <Reveal><TutorialsSection /></Reveal>
        <Reveal><Results /></Reveal>
        <Reveal><Insights /></Reveal>
        <Reveal><FaqContact /></Reveal>
        <Reveal><FinalCta /></Reveal>
      </main>
      <Footer />
    </>
  );
}
