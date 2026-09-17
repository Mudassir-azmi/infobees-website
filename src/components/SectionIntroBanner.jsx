import Reveal from "./Reveal";

function SectionIntroBanner({ eyebrow, title, subtitle, image, imageAlt, reverse = false }) {
  return (
    <div
      className={`mb-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
        <div className="absolute -inset-3 rounded-2xl border border-gold/30" aria-hidden="true" />
        <img
          src={image}
          alt={imageAlt}
          className="relative w-full rounded-2xl shadow-lg"
        />
        <span
          className="absolute -bottom-3 -right-3 h-16 w-16 rounded-xl bg-gold-gradient shadow-md"
          aria-hidden="true"
        />
      </Reveal>

      <Reveal delay={120} className="text-center lg:text-left">
        {eyebrow && (
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            {subtitle}
          </p>
        )}
        <span className="mx-auto mt-6 block h-0.5 w-16 rounded-full bg-gold lg:mx-0" />
      </Reveal>
    </div>
  );
}

export default SectionIntroBanner;
