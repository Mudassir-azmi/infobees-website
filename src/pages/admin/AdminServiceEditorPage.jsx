import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowUp,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { Field, IconSelect, inputClass, Toggle } from "../../components/admin/FormControls";
import ImageField from "../../components/admin/ImageField";
import { useConfirm } from "../../components/admin/useConfirm";
import Spinner from "../../components/Spinner";
import { optimizeImage } from "../../lib/cloudinary";
import {
  createSectionItem,
  deleteSectionItem,
  fetchAdminSection,
  updateSectionItem,
} from "../../lib/sections";
import { slugify } from "../../lib/slugify";

const BACK = "/admin/sections/services";
const LINK_PATTERN = /^(#[\w-]+|\/[\w\-/?=&#.]*|https?:\/\/\S+)$/i;

const lines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const EMPTY_OFFERING = { title: "", icon: "", description: "", points: "", note: "" };

function toFormValues(item) {
  const data = item?.data ?? {};
  return {
    title: item?.title ?? "",
    slug: item?.slug ?? "",
    icon: item?.icon ?? "",
    description: item?.description ?? "",
    is_visible: item?.is_visible ?? true,
    overview: data.overview ?? "",
    points: (item?.points ?? []).join("\n"),
    note: item?.note ?? "",
    link: item?.link ?? "",
    link_label: data.link_label ?? "",
    offerings: (data.offerings ?? []).map((o) => ({
      title: o.title ?? "",
      icon: o.icon ?? "",
      description: o.description ?? "",
      points: (o.points ?? []).join("\n"),
      note: o.note ?? "",
    })),
  };
}

function Panel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="font-semibold text-navy">{title}</h2>
        {description && <p className="text-xs text-text-muted">{description}</p>}
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

function AdminServiceEditorPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const navigate = useNavigate();
  const [confirm, confirmDialog] = useConfirm();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(null) });
  const { fields: offerings, append, remove, move } = useFieldArray({ control, name: "offerings" });
  const title = useWatch({ control, name: "title" });
  const slug = useWatch({ control, name: "slug" });
  const previewSlug = slugify(slug || title || "") || "your-service";

  useEffect(() => {
    if (!isEdit) return;
    fetchAdminSection("services")
      .then(({ data }) => {
        const found = data.items.find((i) => i.id === id);
        if (!found) throw new Error("Service not found.");
        setItem(found);
        setSavedImage(found.image_url);
        reset(toFormValues(found));
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    setServerError("");
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("icon", values.icon);
    formData.append("description", values.description);
    formData.append("is_visible", String(values.is_visible));
    formData.append("points", JSON.stringify(lines(values.points)));
    formData.append("note", values.note);
    formData.append("link", values.link);
    formData.append(
      "data",
      JSON.stringify({
        ...item?.data,
        overview: values.overview.trim() || null,
        link_label: values.link_label.trim() || null,
        offerings: values.offerings.map((o) => ({
          title: o.title.trim(),
          icon: o.icon || null,
          description: o.description.trim() || null,
          points: lines(o.points),
          note: o.note.trim() || null,
        })),
      })
    );
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEdit) await updateSectionItem(id, formData);
      else await createSectionItem("services", formData);
      navigate(BACK, { state: { message: isEdit ? "Service saved." : "Service created." } });
    } catch (err) {
      setServerError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const deleteSavedImage = async () => {
    const { data } = await updateSectionItem(id, { remove_image: true });
    setItem(data);
    setSavedImage(null);
  };

  const deleteService = async () => {
    const ok = await confirm({
      title: "Delete this service?",
      message:
        "The service card, its page and all its offerings will be permanently deleted, including its image on Cloudinary. This cannot be undone.",
      confirmLabel: "Delete service",
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteSectionItem(id);
      navigate(BACK, { state: { message: "Service deleted." } });
    } catch (err) {
      setServerError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <Spinner />;

  if (loadError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-red-700">{loadError}</p>
        <Link to={BACK} className="mt-4 inline-block text-sm font-semibold text-navy">
          &larr; Back to services
        </Link>
      </div>
    );
  }

  const busy = isSubmitting || deleting;

  return (
    <div className="space-y-6">
      {confirmDialog}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to={BACK}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-navy"
          >
            <FaArrowLeft size={11} aria-hidden="true" /> Back to services
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-navy">
            {isEdit ? item.title : "New service"}
          </h1>
        </div>
        {isEdit && item.is_visible && (
          <a
            href={`/services/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-gold"
          >
            View page <FaExternalLinkAlt size={10} aria-hidden="true" />
          </a>
        )}
      </div>

      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* ---------- Card ---------- */}
        <Panel title="Service card" description="Shown in the Services grid, navbar menu and footer.">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              <Field label="Service name *" htmlFor="title" error={errors.title?.message}>
                <input
                  id="title"
                  className={inputClass}
                  placeholder="e.g. Academic & Research"
                  aria-invalid={errors.title ? "true" : "false"}
                  {...register("title", {
                    validate: (value) => value.trim() !== "" || "Service name is required",
                  })}
                />
              </Field>

              <Field
                label="Page URL"
                htmlFor="slug"
                hint={`Page address: /services/${previewSlug}. Leave empty to use the name.`}
              >
                <input id="slug" className={inputClass} placeholder={previewSlug} {...register("slug")} />
              </Field>

              <Field label="Icon" htmlFor="icon">
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => <IconSelect id="icon" value={field.value} onChange={field.onChange} />}
                />
              </Field>

              <Field
                label="Short description"
                htmlFor="description"
                hint="Shown on the card and as the intro at the top of the page."
              >
                <textarea
                  id="description"
                  rows={3}
                  className={inputClass}
                  placeholder="e.g. Research mentorship, university guidance and academic writing."
                  {...register("description")}
                />
              </Field>

              <Toggle
                id="is_visible"
                label="Visible on website"
                description="Hidden services disappear from the grid, menu, footer and their page."
                register={register("is_visible")}
              />
            </div>

            <ImageField
              label="Image (card + page header)"
              hint="Wide images work best."
              savedUrl={savedImage ? optimizeImage(savedImage, 600) : null}
              file={imageFile}
              onFileChange={setImageFile}
              onDeleteSaved={deleteSavedImage}
              disabled={busy}
            />
          </div>
        </Panel>

        {/* ---------- Page content ---------- */}
        <Panel title="Service page" description={`Content of /services/${previewSlug}. Every field is optional.`}>
          <Field label="Overview" htmlFor="overview" hint="A paragraph or two about this service.">
            <textarea
              id="overview"
              rows={5}
              className={inputClass}
              placeholder="Describe the service, who it's for and how you work."
              {...register("overview")}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="What's included" htmlFor="points" hint="One per line. Shown as a checklist.">
              <textarea
                id="points"
                rows={5}
                className={inputClass}
                placeholder={"e.g. Free first consultation\nDedicated mentor\nProgress updates"}
                {...register("points")}
              />
            </Field>
            <Field label="Note / disclaimer" htmlFor="note" hint="Small highlighted text on the page.">
              <textarea
                id="note"
                rows={5}
                className={inputClass}
                placeholder="e.g. Guidance only — results are not guaranteed."
                {...register("note")}
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Extra link"
              htmlFor="link"
              error={errors.link?.message}
              hint='Optional link on the page: "/notices" or a full URL.'
            >
              <input
                id="link"
                className={inputClass}
                placeholder="https://..."
                {...register("link", {
                  validate: (value) =>
                    !value.trim() || LINK_PATTERN.test(value.trim()) || "Enter /page or https://...",
                })}
              />
            </Field>
            <Field label="Link text" htmlFor="link_label">
              <input id="link_label" className={inputClass} placeholder="e.g. Official CUET website" {...register("link_label")} />
            </Field>
          </div>
        </Panel>

        {/* ---------- Offerings ---------- */}
        <Panel
          title={`Offerings (${offerings.length})`}
          description='The detailed blocks under "What We Offer" on the page.'
        >
          {offerings.length === 0 && (
            <p className="rounded-lg bg-bg-light p-4 text-center text-sm text-text-muted">
              No offerings yet. Add blocks like &quot;Admission Guidance&quot; or &quot;Website Development&quot;.
            </p>
          )}

          {offerings.map((offering, index) => (
            <div key={offering.id} className="rounded-xl border border-slate-200 bg-bg-light/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-navy">Offering {index + 1}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-navy disabled:opacity-30"
                  >
                    <FaArrowUp size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === offerings.length - 1}
                    aria-label="Move down"
                    className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-navy disabled:opacity-30"
                  >
                    <FaArrowDown size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove offering"
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Title *"
                  htmlFor={`off-title-${index}`}
                  error={errors.offerings?.[index]?.title?.message}
                >
                  <input
                    id={`off-title-${index}`}
                    className={inputClass}
                    placeholder="e.g. Research & Manuscript Support"
                    {...register(`offerings.${index}.title`, {
                      validate: (value) => value.trim() !== "" || "Title is required",
                    })}
                  />
                </Field>
                <Field label="Icon" htmlFor={`off-icon-${index}`}>
                  <Controller
                    name={`offerings.${index}.icon`}
                    control={control}
                    render={({ field }) => (
                      <IconSelect id={`off-icon-${index}`} value={field.value} onChange={field.onChange} />
                    )}
                  />
                </Field>
                <Field label="Description" htmlFor={`off-desc-${index}`}>
                  <textarea
                    id={`off-desc-${index}`}
                    rows={3}
                    className={inputClass}
                    placeholder="Optional short description"
                    {...register(`offerings.${index}.description`)}
                  />
                </Field>
                <Field label="Bullet points" htmlFor={`off-points-${index}`} hint="One per line.">
                  <textarea
                    id={`off-points-${index}`}
                    rows={3}
                    className={inputClass}
                    placeholder={"e.g. Thesis formatting\nAcademic writing support"}
                    {...register(`offerings.${index}.points`)}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Note" htmlFor={`off-note-${index}`}>
                    <input
                      id={`off-note-${index}`}
                      className={inputClass}
                      placeholder="e.g. Guidance only — selection is not guaranteed."
                      {...register(`offerings.${index}.note`)}
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ ...EMPTY_OFFERING })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm font-medium text-text-muted transition-colors hover:border-gold hover:bg-gold/5 hover:text-navy"
          >
            <FaPlus size={11} aria-hidden="true" /> Add offering
          </button>
        </Panel>

        {/* ---------- Actions ---------- */}
        <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          {isEdit ? (
            <button
              type="button"
              onClick={deleteService}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <FaTrash size={11} aria-hidden="true" />
              {deleting ? "Deleting..." : "Delete service"}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Link
              to={BACK}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-text-dark hover:bg-bg-light"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save service" : "Create service"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminServiceEditorPage;
