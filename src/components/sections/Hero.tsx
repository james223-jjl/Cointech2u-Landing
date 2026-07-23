import { ArrowIcon } from "../ArrowIcon";
import { CountUp } from "../CountUp";
import { HeroScene } from "../HeroScene";
import { LiveBotsLabel } from "../LiveBotsLabel";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative galaxy-bg overflow-hidden pt-40 pb-32"
    >
      <HeroScene />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.88) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hairline bg-panel/60 mb-8">
              <span className="live-dot" />
              <LiveBotsLabel />
            </div>

            <h1 className="display text-[64px] md:text-[88px] lg:text-[104px] relative">
              <div className="hero-aurora" aria-hidden="true">
                <span className="hero-aurora__item" />
                <span className="hero-aurora__item" />
                <span className="hero-aurora__item" />
                <span className="hero-aurora__item" />
              </div>
              <span
                className="hero-fade display-grad"
                style={{ animationDelay: "0ms" }}
              >
                Your money,
              </span>
              <br />
              <span
                className="hero-fade display-grad"
                style={{ animationDelay: "120ms" }}
              >
                your exchange,
              </span>
              <br />
              <span
                className="hero-fade text-paper"
                style={{ animationDelay: "240ms" }}
              >
                our{" "}
                <em
                  className="not-italic neon-text"
                  style={{ fontStyle: "normal" }}
                >
                  AI
                </em>
                .
              </span>
            </h1>

            <p
              className="hero-fade mt-8 max-w-xl text-lg text-paper/70 leading-relaxed"
              style={{ animationDelay: "420ms" }}
            >
              CoinTech2u is an autonomous trading intelligence that plugs into
              the exchange you already trust — and trades crypto futures while
              you sleep.{" "}
              <span className="text-paper">
                <strong className="font-semibold">240,000 users.</strong> 100+
                countries. One API key away.
              </span>
            </p>

            <div
              className="hero-fade mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "600ms" }}
            >
              <a
                href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
                data-hero-cta="start"
                className="btn-primary px-6 py-3.5 rounded-full font-medium text-sm inline-flex items-center gap-2"
              >
                Start trading free
                <ArrowIcon />
              </a>
              <a
                href="#how"
                className="btn-ghost px-6 py-3.5 rounded-full font-medium text-sm inline-flex items-center gap-2"
              >
                See how it works
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl border-t hairline pt-10">
              <div>
                <div className="font-display text-3xl md:text-4xl lg:text-5xl text-paper tabular-nums">
                  <CountUp to={240} delay={1100} />K
                  <span className="neon-text">+</span>
                </div>
                <div className="text-sm text-mute mt-2">active users</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl lg:text-5xl text-paper tabular-nums">
                  <CountUp to={98} delay={1200} />
                  <span className="neon-text">%</span>
                </div>
                <div className="text-sm text-mute mt-2">verified win rate</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl lg:text-5xl text-paper tabular-nums">
                  <CountUp to={100} delay={1300} />
                  <span className="neon-text">+</span>
                </div>
                <div className="text-sm text-mute mt-2">countries</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative phone-float"
              style={{
                filter: "drop-shadow(0 40px 80px rgba(139,47,204,0.35))",
              }}
            >
              <div
                className="media-slot"
                style={{
                  width: 320,
                  height: 640,
                  borderRadius: 48,
                  padding: 14,
                }}
              >
                <div
                  className="w-full h-full rounded-[36px] flex items-center justify-center border border-edge"
                  style={{
                    background: "linear-gradient(160deg, #1a1030, #0a0618)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div className="absolute inset-0 p-5 flex flex-col">
                    <div className="flex items-center justify-between text-[9px] font-mono text-paper/60 mb-4">
                      <span>9:41</span>
                      <span>●●● ●</span>
                    </div>
                    <div className="text-[10px] font-mono text-mute uppercase tracking-widest mb-1">
                      Portfolio
                    </div>
                    <div className="font-display text-3xl text-paper">
                      $48,213.
                      <span className="text-mute text-xl">08</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-profit text-xs font-mono">
                      ▲ +2,143.77 (4.65%)
                    </div>

                    <div
                      className="mt-6 flex-1 rounded-xl p-3"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(227,81,238,0.08), transparent)",
                      }}
                    >
                      <svg viewBox="0 0 260 120" className="w-full h-full">
                        <defs>
                          <linearGradient
                            id="heroChart"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#E351EE"
                              stopOpacity="0.4"
                            />
                            <stop
                              offset="100%"
                              stopColor="#E351EE"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          className="chart-fill"
                          d="M0,90 L20,80 L40,85 L60,60 L80,65 L100,40 L120,50 L140,30 L160,35 L180,20 L200,25 L220,15 L240,20 L260,10 L260,120 L0,120 Z"
                          fill="url(#heroChart)"
                        />
                        <path
                          className="chart-line"
                          pathLength="1"
                          d="M0,90 L20,80 L40,85 L60,60 L80,65 L100,40 L120,50 L140,30 L160,35 L180,20 L200,25 L220,15 L240,20 L260,10"
                          fill="none"
                          stroke="#E351EE"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div
                        className="flex items-center justify-between p-2.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(227,81,238,0.1)",
                        }}
                      >
                        <div>
                          <div className="text-xs text-paper font-medium">
                            BTC/USDT
                          </div>
                          <div className="text-[9px] text-mute font-mono">
                            Long · 5x
                          </div>
                        </div>
                        <div className="text-profit text-xs font-mono">
                          +$320.95
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-between p-2.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(227,81,238,0.1)",
                        }}
                      >
                        <div>
                          <div className="text-xs text-paper font-medium">
                            ETH/USDT
                          </div>
                          <div className="text-[9px] text-mute font-mono">
                            Long · 3x
                          </div>
                        </div>
                        <div className="text-profit text-xs font-mono">
                          +$94.21
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 text-[9px] font-mono text-mute uppercase tracking-widest text-center">
                      [ Phone-Galaxy-Final.mp4 ]
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute -inset-10 pointer-events-none phone-ring"
                style={{
                  border: "1px solid rgba(227,81,238,0.12)",
                  borderRadius: "50%",
                  transform: "rotate(-12deg)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="hidden mt-24 pt-10 border-t hairline">
          <div className="text-center text-xs text-mute font-mono uppercase tracking-[0.3em] mb-8">
            Connects directly to
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 text-paper/70">
            <span className="font-display text-2xl tracking-tight">OKX</span>
            <span className="font-display text-2xl tracking-tight">Bitget</span>
            <span className="font-display text-2xl tracking-tight">Bybit</span>
            <span className="font-display text-2xl tracking-tight">
              Binance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
