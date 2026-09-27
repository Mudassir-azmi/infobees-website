import { useEffect, useRef, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { useConfirm } from "./useConfirm";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Image picker for admin forms.
 *
 * - `file` / `onFileChange`: the newly picked (unsaved) file, owned by the parent.
 * - `savedUrl`: the image currently stored on Cloudinary.
 * - `onDeleteSaved`: async; deletes the saved image immediately (after confirm).
 *
 * Replacing a saved image asks first, since the old one is deleted from
 * Cloudinary when the form is saved.
 */
function ImageField({ label = "Image", hint, savedUrl, file, onFileChange, onDeleteSaved, disabled }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirm, confirmDialog] = useConfirm();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = () => inputRef.current?.click();

  const onChange = (event) => {
    const picked = event.target.files?.[0];
    event.target.value = "";
    setError("");
    if (!picked) return;
    if (!ACCEPTED_TYPES.includes(picked.type)) {
      setError("Only JPEG, PNG, WEBP or GIF images are allowed.");
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    onFileChange(picked);
  };

  const replace = async () => {
    if (savedUrl && !file) {
      const ok = await confirm({
        title: "Replace image?",
        message:
          "The current image will be permanently deleted from Cloudinary and replaced with the new one when you save.",
        confirmLabel: "Choose new image",
        danger: false,
      });
      if (!ok) return;
    }
    pick();
  };

  const deleteSaved = async () => {
    const ok = await confirm({
      title: "Delete image?",
      message: "This image will be permanently deleted from Cloudinary. This cannot be undone.",
      confirmLabel: "Delete image",
    });
    if (!ok) return;
    setDeleting(true);
    setError("");
    try {
      await onDeleteSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const shown = preview || savedUrl;
  const busy = disabled || deleting;

  return (
    <div>
      {confirmDialog}
      <p className="mb-2 text-sm font-medium text-navy">{label}</p>

      {shown ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <img
            src={shown}
            alt=""
            className={`h-44 w-full object-cover ${deleting ? "opacity-40" : ""}`}
          />
          {preview && (
            <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-navy">
              {savedUrl ? "New image, not saved yet" : "Not saved yet"}
            </span>
          )}
          <button
            type="button"
            onClick={preview ? () => onFileChange(null) : deleteSaved}
            disabled={busy}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:text-red-600 disabled:opacity-50"
            aria-label={preview ? "Discard new image" : "Delete image"}
            title={preview ? "Discard new image" : "Delete image from Cloudinary"}
          >
            <FaTimes size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-sm text-text-muted transition-colors hover:border-gold hover:text-navy"
        >
          <FaImage size={24} aria-hidden="true" />
          Click to upload
          <span className="text-xs">JPEG, PNG, WEBP, GIF · max 5 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={onChange}
        className="sr-only"
        tabIndex={-1}
      />

      {shown && (
        <button
          type="button"
          onClick={replace}
          disabled={busy}
          className="mt-2 text-sm font-semibold text-navy hover:text-gold-dark disabled:opacity-50"
        >
          {deleting ? "Deleting image..." : "Replace image"}
        </button>
      )}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}

export default ImageField;
