import { useSection } from "../context/siteContent";
import DynamicIcon from "./DynamicIcon";

/**
 * Social profile icons from Admin → Social Links (Hero and footer).
 * Renders nothing until at least one link is added.
 */
function SocialLinks({ showTitle = false, className = "" }) {
  const social = useSection("social");
  if (!social.items.length) return null;

  return (
    <div className={className}>
      {showTitle && social.title && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white">{social.title}</p>
      )}
      <ul className="flex flex-wrap gap-2">
        {social.items.map((handle) => (
          <li key={handle.id}>
            <a
              href={handle.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={handle.title}
              title={handle.title}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:border-gold hover:bg-gold hover:text-navy"
            >
              <DynamicIcon icon={handle.icon} size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SocialLinks;
