import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import ScrollReveal from "./components/ScrollReveal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cointech2u.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CoinTech2u — Trade Intelligence, Not Emotion",
    template: "%s · CoinTech2u",
  },
  description:
    "AI-powered, non-custodial crypto trading infrastructure. Connect OKX, Bitget, Bybit, or Binance via secure read-only API and run verified strategies with real-time analytics.",
  applicationName: "CoinTech2u",
  keywords: [
    "AI crypto trading",
    "automated trading",
    "non-custodial",
    "crypto bot",
    "OKX",
    "Bitget",
    "Bybit",
    "Binance",
    "algorithmic trading",
    "quantitative trading",
  ],
  authors: [{ name: "CoinTech2u" }],
  creator: "CoinTech2u",
  publisher: "CoinTech2u",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CoinTech2u",
    title: "CoinTech2u — Trade Intelligence, Not Emotion",
    description:
      "AI-powered, non-custodial crypto trading. Real-time analytics, verified results, four years of live performance data.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoinTech2u — Trade Intelligence, Not Emotion",
    description:
      "AI-powered, non-custodial crypto trading. Verified, real-time, transparent.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CoinTech2u",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: [],
  description:
    "AI-powered crypto trading infrastructure. Non-custodial by design.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CoinTech2u",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ScrollReveal />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
