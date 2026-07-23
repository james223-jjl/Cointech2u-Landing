export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-void/70 border-b hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2 font-display font-semibold tracking-tight text-lg"
        >
          <span
            className="w-6 h-6 rounded-md"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #F9C8FD, #8B2FCC 70%)",
              boxShadow: "0 0 20px rgba(227,81,238,0.5)",
            }}
          />
          CoinTech2u
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-mute">
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
          <a href="#faq" className="hover:text-paper transition">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://app.cointech2u.com/h5/index.html#/pages/login/login"
            className="hidden sm:inline-flex text-sm text-paper/80 hover:text-paper px-3 py-2"
          >
            Log in
          </a>
          <a
            href="https://app.cointech2u.com/h51/index.html#/?invite_code=gr4Mca"
            className="btn-primary text-sm font-medium px-4 py-2 rounded-full"
          >
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}
