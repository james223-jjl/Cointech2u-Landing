export function Footer() {
  return (
    <footer className="py-14 border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span
              className="w-5 h-5 rounded-md"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #F9C8FD, #8B2FCC 70%)",
                boxShadow: "0 0 20px rgba(227,81,238,0.5)",
              }}
            />
            CoinTech2u
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-mute">
            <a href="#pulse" className="hover:text-paper transition">
              Live
            </a>
            <a href="#strengths" className="hover:text-paper transition">
              Why us
            </a>
            <a href="#how" className="hover:text-paper transition">
              How it works
            </a>
            <a href="#results" className="hover:text-paper transition">
              Results
            </a>
            <a href="#insights" className="hover:text-paper transition">
              Insights
            </a>
            <a href="#faq" className="hover:text-paper transition">
              FAQ
            </a>
          </nav>
          <div className="text-xs text-mute font-mono">
            © 2026 CoinTech2u. All rights reserved.
          </div>
        </div>
        <div className="mt-10 pt-6 border-t hairline text-[11px] text-mute leading-relaxed max-w-4xl">
          Crypto trading involves substantial risk of loss and is not suitable
          for every investor. Past performance does not guarantee future
          results. CoinTech2u is a non-custodial software product — we never
          take possession of your funds. Always trade responsibly.
        </div>
      </div>
    </footer>
  );
}
