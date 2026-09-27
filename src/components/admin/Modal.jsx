import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Admin modal shell: overlay, title bar, Escape to close, body scroll lock.
 * Put the form (body + footer) in `children`.
 */
function Modal({ title, onClose, closeDisabled = false, size = "max-w-2xl", children }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && !closeDisabled && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [closeDisabled, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-deep/60 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`my-8 w-full ${size} animate-fade-in rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-navy first-letter:uppercase">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 hover:bg-bg-light hover:text-navy"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Scrollable body + sticky footer with Cancel / Save buttons. */
export function ModalForm({ onSubmit, onCancel, submitting, submitLabel, children }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">{children}</div>
      <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-text-dark hover:bg-bg-light"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default Modal;
