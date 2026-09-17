import Reveal from "./Reveal";

function SectionHeader({ eyebrow, title, subtitle, light = false }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl font-bold sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-slate-300" : "text-text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
      <span className="mx-auto mt-6 block h-0.5 w-16 rounded-full bg-gold" />
    </Reveal>
  );
}

export default SectionHeader;
