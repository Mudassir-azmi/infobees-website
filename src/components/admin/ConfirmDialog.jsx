import { useEffect, useRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onClose,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
    // Capture + stop so Escape closes only this dialog, not a modal underneath.
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      onClose(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 p-4 backdrop-blur-sm"
      onClick={() => onClose(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-red-50 text-red-600" : "bg-gold/15 text-gold-dark"
            }`}
          >
            <FaExclamationTriangle aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-semibold text-navy">
              {title}
            </h2>
            <p id="confirm-message" className="mt-1.5 text-sm leading-relaxed text-text-muted">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-text-dark transition-colors hover:bg-bg-light"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onClose(true)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-navy hover:bg-navy-light"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
