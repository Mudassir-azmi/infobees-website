import { personDetails } from "../lib/contact";

/**
 * One contact person: name, role and their phone / WhatsApp / email / address.
 * `variant`: "light" (on white) or "dark" (footer, compact).
 */
function ContactPerson({ person, variant = "light" }) {
  const dark = variant === "dark";
  const details = personDetails(person);

  return (
    <div>
      <p className={`font-semibold ${dark ? "text-sm text-white" : "text-base text-navy"}`}>
        {person.title}
      </p>
      {person.subtitle && (
        <p
          className={`text-xs ${dark ? "text-slate-400" : "font-semibold uppercase tracking-wide text-gold"}`}
        >
          {person.subtitle}
        </p>
      )}

      {details.length > 0 && (
        <ul className={`${dark ? "mt-2 space-y-1.5" : "mt-4 space-y-3"} text-sm`}>
          {details.map((detail) => {
            const Icon = detail.icon;
            return (
              <li key={detail.key} className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={detail.href(detail.value)}
                  {...(detail.external && { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={`${detail.label}: ${detail.value}`}
                  className={`break-words ${dark ? "hover:text-gold" : "text-text-dark hover:text-navy"}`}
                >
                  {detail.value}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ContactPerson;
