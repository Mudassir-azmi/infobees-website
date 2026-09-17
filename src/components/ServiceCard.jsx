function ServiceCard({ icon: Icon, image, title, description, points, note, anchor }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl">
      {image && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
        </div>
      )}
      <div className="flex h-full flex-col p-7">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy ${
          image ? "-mt-10 border-4 border-white shadow-md" : ""
        }`}
      >
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-navy">{title}</h3>
      {description && (
        <p className="mb-3 text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      )}
      {points && (
        <ul className="mb-3 space-y-1.5 text-sm text-text-muted">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      {note && (
        <p className="mb-3 text-xs italic leading-relaxed text-slate-400">
          {note}
        </p>
      )}
      {anchor && (
        <a
          href={anchor}
          className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-navy transition-colors group-hover:text-gold"
        >
          Explore Services
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </a>
      )}
      </div>
    </div>
  );
}

export default ServiceCard;
