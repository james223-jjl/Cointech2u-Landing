import { ArrowIcon } from "../ArrowIcon";
import { BlurReveal } from "../BlurReveal";

const partners = [
  { n: "01", name: "OKX", desc: "Spot · Futures · Copy", href: "https://cointech2u.com/reg-okx" },
  { n: "02", name: "Bitget", desc: "Spot · Futures · Copy", href: "https://cointech2u.com/reg-bitget" },
  { n: "03", name: "Bybit", desc: "Spot · Futures · Options", href: "https://cointech2u.com/reg-bybit" },
  { n: "04", name: "Binance", desc: "Spot · Futures · Margin", href: "https://cointech2u.com/reg-binance" },
];

export function Partners() {
  return (
    <section id="partners" className="py-32 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="eyebrow mb-4">— Partnerships</div>
            <h2 className="display text-5xl md:text-6xl max-w-xl">
              <BlurReveal>
                Trusted by the exchanges
                <br />
                you already use.
              </BlurReveal>
            </h2>
          </div>
          <p className="text-paper/60 max-w-md leading-relaxed">
            Official partners of the world&apos;s largest crypto exchanges.
            One-click Fast API binding. Read-only, trade-only keys — never
            withdrawal access.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="partner p-8 block"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow">{p.n}</span>
                <ArrowIcon className="text-mute" />
              </div>
              <div className="font-display text-3xl mb-2">{p.name}</div>
              <div className="text-xs text-mute font-mono">{p.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
