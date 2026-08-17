import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-void overflow-x-hidden">
      <div className="starfield fixed inset-0 z-0 pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-void/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center px-6 md:px-20 py-4 max-w-[1440px] mx-auto">
          <div className="font-display text-lg tracking-tight text-white">
            ORBITAL<span className="text-nebula-bright">.</span>
          </div>
          <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-wider text-white/60">
            <a href="#brief" className="hover:text-nebula-bright transition-colors">
              Mission Brief
            </a>
            <a href="#how" className="hover:text-nebula-bright transition-colors">
              How It Works
            </a>
          </div>
          <a
            href="#brief"
            className="font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-lg bg-nebula-bright text-void hover:bg-white transition-colors"
          >
            Start Mission
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-28">
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-20 text-center relative overflow-hidden">
          {/* Big planet */}
          <div className="planet w-[520px] h-[520px] md:w-[720px] md:h-[720px] -bottom-64 md:-bottom-80 left-1/2 -translate-x-1/2 animate-drift" />
          <div className="orbit w-[640px] h-[640px] md:w-[860px] md:h-[860px] animate-spin-slow">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-quasar shadow-[0_0_10px_#38bdf8]" />
          </div>
          <div className="orbit w-[820px] h-[820px] md:w-[1040px] md:h-[1040px] animate-spin-slower">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ember shadow-[0_0_10px_#f4c95d]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/15 bg-white/5 font-mono text-[11px] uppercase tracking-widest text-nebula-bright">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula-bright animate-pulse" />
              Taking orders — next launch window open
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-[1.1]">
              Your website.
              <br />
              <span className="text-gradient">Built to your orbit.</span>
            </h1>
            <p className="text-mist text-lg max-w-xl">
              Tell us the mission below. We scope, quote, and build — from landing
              page to full web app — and hand you the keys on launch day.
            </p>
            <a
              href="#brief"
              className="mt-4 px-8 py-4 rounded-lg bg-nebula-bright text-void font-mono text-xs uppercase tracking-widest hover:bg-white transition-colors"
            >
              Start Your Mission 🚀
            </a>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-6 md:px-20 py-16 max-w-[1100px] mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Brief the mission", d: "Tell us the project, the goal, who it's for." },
            { n: "02", t: "We scope it", d: "Sector, budget, timeline — locked in together." },
            { n: "03", t: "Launch", d: "You get updates until it's live on your domain." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-xl p-6">
              <span className="font-mono text-nebula-bright text-xs">{s.n}</span>
              <h3 className="font-display text-white text-lg mt-2">{s.t}</h3>
              <p className="text-mist text-sm mt-1">{s.d}</p>
            </div>
          ))}
        </section>

        {/* Order form */}
        <section id="brief" className="px-6 md:px-20 py-24 max-w-[1000px] mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl text-white">Mission Control</h2>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40 mt-2">
              Configure your trajectory
            </p>
          </div>
          <OrderForm />
        </section>
      </main>

      <footer className="relative z-10 py-14 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start px-6 md:px-20 gap-6 max-w-[1440px] mx-auto">
          <div className="font-display text-lg text-white">ORBITAL</div>
          <p className="font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} ORBITAL — built with Next.js, Prisma & Postgres.
          </p>
        </div>
      </footer>
    </div>
  );
}
