import { ICON_NAMES, iconLabel } from "../../lib/icons";
import DynamicIcon from "../DynamicIcon";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-text-dark placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:bg-slate-50 disabled:text-slate-400";

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}

/** Checkbox styled as a switch. Pass `register={register("field")}`. */
export function Toggle({ id, label, description, register }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" className="peer sr-only" {...register} />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-navy peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold" />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {description && <span className="block text-xs text-text-muted">{description}</span>}
      </span>
    </label>
  );
}

/** Icon dropdown with a live preview. `value`/`onChange` hold the icon name. */
export function IconSelect({ id, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
        <DynamicIcon icon={value} size={18} aria-hidden="true" />
      </span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Default (star)</option>
        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {iconLabel(name)}
          </option>
        ))}
      </select>
    </div>
  );
}
