import heroGraphic from "../assets/images/hero/hero-graphic.svg";
import { trustIndicators } from "../data/services";

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-navy pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 line-grid opacity-[0.05]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="animate-fade-in text-center lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Academic, Research and IT Solutions
          </span>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Empowering Academic Excellence &amp;{" "}
            <span className="text-gold-gradient">Next-Gen IT Solutions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 lg:mx-0">
            Comprehensive research mentorship, higher education guidance,
            custom software development, citizen service facilitation, and
            precision hardware&mdash;engineered by Infobees.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#contact"
              className="w-full rounded-full bg-gold-gradient px-7 py-3.5 text-center text-sm font-semibold text-navy shadow-lg shadow-gold/20 transition-transform hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Book Academic Advisory
            </a>
            <a
              href="#technology"
              className="w-full rounded-full border border-white/30 px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold sm:w-auto"
            >
              Explore IT &amp; Software Solutions
            </a>
          </div>

          <dl className="mx-auto mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:mx-0">
            {trustIndicators.map((item) => (
              <div key={item} className="text-center lg:text-left">
                <dt className="sr-only">Trust indicator</dt>
                <dd className="border-t border-gold/30 pt-3 text-xs font-medium uppercase tracking-wide text-slate-300">
                  {item}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="animate-fade-in relative flex justify-center"
          style={{ animationDelay: "150ms" }}
        >
          <div className="absolute h-72 w-72 rounded-full border border-gold/20 sm:h-96 sm:w-96" />
          <img
            src={heroGraphic}
            alt="Abstract network illustration representing Infobees' academic and technology expertise"
            className="w-full max-w-md animate-float-slow drop-shadow-2xl"
          />

          <div className="absolute -left-2 bottom-6 hidden rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left backdrop-blur sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Advisory</p>
            <p className="text-sm font-semibold text-white">Academic &amp; Research</p>
          </div>
          <div className="absolute -right-2 top-8 hidden rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left backdrop-blur sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Engineering</p>
            <p className="text-sm font-semibold text-white">Software &amp; Hardware</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
