import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft, FaExclamationTriangle, FaImage, FaTimes, FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { useConfirm } from "../../components/admin/useConfirm";
import Spinner from "../../components/Spinner";
import {
  createNotice,
  deleteNotice,
  fetchAdminNotice,
  fetchNoticeTopics,
  updateNotice,
} from "../../lib/notices";
import { fetchSiteSections } from "../../lib/sections";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-text-dark placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

// Always offered, before the service names. "Other" lets the admin type a new topic.
const GENERAL_TOPICS = ["General Announcement"];
const OTHER_TOPIC = "__other__";

const EMPTY_FORM = {
  title: "",
  topic: "",
  topic_custom: "",
  summary: "",
  description: "",
  link_url: "",
  link_label: "",
  is_published: true,
  is_pinned: false,
};

function Field({ label, htmlFor, hint, error, children }) {
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

/** Topic dropdown: grouped preset topics plus "Other" to type a new one. */
function TopicSelect({ field, groups }) {
  return (
    <select id="topic" className={inputClass} {...field}>
      <option value="">No topic</option>
      {groups
        .filter(([, topics]) => topics.length > 0)
        .map(([label, topics]) => (
          <optgroup key={label} label={label}>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </optgroup>
        ))}
      <option value={OTHER_TOPIC}>Other (type a new topic)…</option>
    </select>
  );
}

function Toggle({ id, label, description, register }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" className="peer sr-only" {...register} />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-navy peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold" />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        <span className="block text-xs text-text-muted">{description}</span>
      </span>
    </label>
  );
}

function AdminNoticeFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");
  const [usedTopics, setUsedTopics] = useState([]);
  const [serviceTopics, setServiceTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [busy, setBusy] = useState(""); // "" | "removing-image" | "deleting"
  const [confirm, confirmDialog] = useConfirm();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  const summaryLength = watch("summary")?.length ?? 0;
  const linkUrl = watch("link_url");
  const topicChoice = watch("topic");

  // Preset topics: general ones, every service, then any custom topic already used.
  useEffect(() => {
    fetchSiteSections()
      .then((res) => setServiceTopics((res.data.services?.items ?? []).map((s) => s.title)))
      .catch(() => {});
    fetchNoticeTopics()
      .then((res) => setUsedTopics(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetchAdminNotice(id)
      .then(({ data }) => {
        reset({
          title: data.title ?? "",
          topic: data.topic ?? "",
          summary: data.summary ?? "",
          description: data.description ?? "",
          link_url: data.link_url ?? "",
          link_label: data.link_label ?? "",
          is_published: data.is_published,
          is_pinned: data.is_pinned,
        });
        setExistingImage(data.image_url);
        setCurrentTopic(data.topic ?? "");
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  // Free the object URL used for the local preview.
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, WEBP or GIF images are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setImageFile(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  // Replacing a saved image: warn first, since the old one is deleted from
  // Cloudinary once the new one is saved.
  const replaceImage = async () => {
    if (isEdit && existingImage && !imageFile) {
      const ok = await confirm({
        title: "Replace image?",
        message:
          "The current image will be permanently deleted from Cloudinary and replaced with the new one when you save.",
        confirmLabel: "Choose new image",
        danger: false,
      });
      if (!ok) return;
    }
    openFilePicker();
  };

  const discardNewImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageFile(null);
    setImagePreview(null);
  };

  // Deletes the saved image from Cloudinary right away (other edits are kept).
  const removeSavedImage = async () => {
    const ok = await confirm({
      title: "Delete image?",
      message: "This image will be permanently deleted from Cloudinary. This cannot be undone.",
      confirmLabel: "Delete image",
    });
    if (!ok) return;

    setBusy("removing-image");
    setServerError("");
    try {
      await updateNotice(id, { remove_image: true });
      setExistingImage(null);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy("");
    }
  };

  const removeNotice = async () => {
    const ok = await confirm({
      title: "Delete this notice?",
      message:
        "The notice and all its data will be permanently deleted, including its image on Cloudinary. This cannot be undone.",
      confirmLabel: "Delete notice",
    });
    if (!ok) return;

    setBusy("deleting");
    setServerError("");
    try {
      await deleteNotice(id);
      navigate("/admin/notices", { state: { message: "Notice deleted." } });
    } catch (err) {
      setServerError(err.message);
      setBusy("");
    }
  };

  const onSubmit = async (rawValues) => {
    setServerError("");
    const { topic_custom: topicCustom, ...values } = rawValues;
    if (values.topic === OTHER_TOPIC) values.topic = topicCustom.trim();

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEdit) await updateNotice(id, formData);
      else await createNotice(formData);
      navigate("/admin/notices", {
        state: { message: isEdit ? "Notice updated." : "Notice created." },
      });
    } catch (err) {
      setServerError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const presetTopics = new Set([...GENERAL_TOPICS, ...serviceTopics]);
  const customTopics = [...new Set([...usedTopics, currentTopic].filter(Boolean))].filter(
    (topic) => !presetTopics.has(topic)
  );

  if (loading) return <Spinner />;

  if (loadError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-red-700">{loadError}</p>
        <Link to="/admin/notices" className="mt-4 inline-block text-sm font-semibold text-navy">
          &larr; Back to notices
        </Link>
      </div>
    );
  }

  const shownImage = imagePreview || existingImage;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {confirmDialog}
      <div>
        <Link
          to="/admin/notices"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-navy"
        >
          <FaArrowLeft size={11} aria-hidden="true" /> Back to notices
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-navy">{isEdit ? "Edit notice" : "New notice"}</h1>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <Field label="Title *" htmlFor="title" error={errors.title?.message}>
            <input
              id="title"
              className={inputClass}
              aria-invalid={errors.title ? "true" : "false"}
              {...register("title", {
                required: "Title is required",
                maxLength: { value: 200, message: "Title must be 200 characters or less" },
              })}
            />
          </Field>

          <Field
            label="Topic"
            htmlFor="topic"
            hint="Visitors can filter notices by topic on the notices page."
          >
            {/* Controlled, so the saved topic stays selected while options load. */}
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <TopicSelect
                  field={field}
                  groups={[
                    ["General", GENERAL_TOPICS],
                    ["Services", serviceTopics],
                    ["Previously used", customTopics],
                  ]}
                />
              )}
            />
          </Field>

          {topicChoice === OTHER_TOPIC && (
            <Field label="New topic *" htmlFor="topic_custom" error={errors.topic_custom?.message}>
              <input
                id="topic_custom"
                autoFocus
                className={inputClass}
                placeholder="e.g. Workshops"
                aria-invalid={errors.topic_custom ? "true" : "false"}
                {...register("topic_custom", {
                  validate: (value) =>
                    watch("topic") !== OTHER_TOPIC || value.trim() !== "" || "Enter the new topic",
                })}
              />
            </Field>
          )}

          <Field
            label="Summary"
            htmlFor="summary"
            error={errors.summary?.message}
            hint={`Short text shown on cards and the home page. ${summaryLength}/300`}
          >
            <textarea
              id="summary"
              rows={2}
              className={inputClass}
              {...register("summary", {
                maxLength: { value: 300, message: "Summary must be 300 characters or less" },
              })}
            />
          </Field>

          <Field
            label="Description *"
            htmlFor="description"
            error={errors.description?.message}
            hint="Full notice text. Line breaks are kept as written."
          >
            <textarea
              id="description"
              rows={10}
              className={inputClass}
              aria-invalid={errors.description ? "true" : "false"}
              {...register("description", {
                validate: (value) => value.trim() !== "" || "Description is required",
              })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Link URL (optional)" htmlFor="link_url" error={errors.link_url?.message}>
              <input
                id="link_url"
                type="url"
                placeholder="https://..."
                className={inputClass}
                {...register("link_url", {
                  pattern: {
                    value: /^https?:\/\/\S+$/i,
                    message: "Must start with http:// or https://",
                  },
                })}
              />
            </Field>
            <Field label="Link button text" htmlFor="link_label" hint='Defaults to "Open link".'>
              <input
                id="link_label"
                disabled={!linkUrl}
                className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
                {...register("link_label")}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-medium text-navy">Image (optional)</p>
            {shownImage ? (
              <div className="relative overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={shownImage}
                  alt="Notice preview"
                  className={`h-44 w-full object-cover ${busy === "removing-image" ? "opacity-40" : ""}`}
                />
                {imagePreview && (
                  <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-navy">
                    {existingImage ? "New image, not saved yet" : "Not saved yet"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={imagePreview ? discardNewImage : removeSavedImage}
                  disabled={busy !== ""}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:text-red-600 disabled:opacity-50"
                  aria-label={imagePreview ? "Discard new image" : "Delete image"}
                  title={imagePreview ? "Discard new image" : "Delete image from Cloudinary"}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-sm text-text-muted transition-colors hover:border-gold hover:text-navy"
              >
                <FaImage size={24} aria-hidden="true" />
                Click to upload
                <span className="text-xs">JPEG, PNG, WEBP, GIF · max 5 MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={onFileChange}
              className="sr-only"
              tabIndex={-1}
            />
            {shownImage && (
              <button
                type="button"
                onClick={replaceImage}
                disabled={busy !== ""}
                className="mt-3 text-sm font-semibold text-navy hover:text-gold-dark disabled:opacity-50"
              >
                {busy === "removing-image" ? "Deleting image..." : "Replace image"}
              </button>
            )}
            {imageError && <p className="mt-2 text-xs text-red-600">{imageError}</p>}
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Toggle
              id="is_published"
              label="Published"
              description="Visible on the website. Turn off to save as a draft."
              register={register("is_published")}
            />
            <Toggle
              id="is_pinned"
              label="Pin to top"
              description="Shown first on the home page and notice list."
              register={register("is_pinned")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || busy !== ""}
            className="w-full rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create notice"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={removeNotice}
              disabled={isSubmitting || busy !== ""}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaTrash size={12} aria-hidden="true" />
              {busy === "deleting" ? "Deleting..." : "Delete notice"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminNoticeFormPage;
