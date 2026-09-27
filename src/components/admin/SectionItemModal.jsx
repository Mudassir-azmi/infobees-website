import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import { optimizeImage } from "../../lib/cloudinary";
import { createSectionItem, updateSectionItem } from "../../lib/sections";
import { Field, IconSelect, inputClass, Toggle } from "./FormControls";
import ImageField from "./ImageField";
import Modal, { ModalForm } from "./Modal";

const LINK_PATTERN = /^(#[\w-]+|\/[\w\-/?=&#.]*|https?:\/\/\S+)$/i;

const TEXT_FIELDS = ["subtitle", "description", "note", "icon", "link"];

// Default wording; a section can override it via items.fieldLabels / fieldHints / fieldPlaceholders.
const DEFAULT_LABELS = {
  title: "Title",
  subtitle: "Subtitle",
  icon: "Icon",
  image: "Image (optional)",
  description: "Description",
  points: "Bullet points",
  note: "Note",
  link: "Link",
};

const DEFAULT_HINTS = {
  points: "One point per line.",
  note: "Small italic text under the card, e.g. a disclaimer.",
  link: 'Adds an "Explore Services" link. Use "#academic" for a section, "/notices" for a page, or a full URL.',
};

const DEFAULT_PLACEHOLDERS = {
  title: "e.g. Website Development",
  subtitle: "Short line under the title",
  description: "A sentence or two describing this item",
  points: "First point\nSecond point\nThird point",
  note: "e.g. Guidance only — results are not guaranteed.",
  link: "#academic",
};

function toFormValues(item, dataFields = []) {
  const values = {
    title: item?.title ?? "",
    subtitle: item?.subtitle ?? "",
    description: item?.description ?? "",
    points: (item?.points ?? []).join("\n"),
    note: item?.note ?? "",
    icon: item?.icon ?? "",
    link: item?.link ?? "",
    is_visible: item?.is_visible ?? true,
  };
  for (const field of dataFields) {
    values[`data_${field.name}`] = item?.data?.[field.name] ?? field.defaultValue ?? "";
  }
  return values;
}

/**
 * Create / edit one item of a section. Fields, their order and wording come
 * from the section config. New items start empty (placeholders only); editing
 * loads the saved values. Calls `onSaved(item)` whenever the server copy changes.
 */
function SectionItemModal({ sectionKey, config, item, onClose, onSaved }) {
  const isEdit = Boolean(item);
  const {
    fields,
    dataFields = [],
    required = [],
    iconFromData,
    defaultTitle,
    fieldLabels = {},
    fieldHints = {},
    fieldPlaceholders = {},
    label: itemLabel,
  } = config.items;
  const labelFor = (name) => fieldLabels[name] ?? DEFAULT_LABELS[name];
  const hintFor = (name) => fieldHints[name] ?? DEFAULT_HINTS[name];
  const placeholderFor = (name) => fieldPlaceholders[name] ?? DEFAULT_PLACEHOLDERS[name];

  const [savedImage, setSavedImage] = useState(item?.image_url ?? null);
  const [imageFile, setImageFile] = useState(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(item, dataFields) });

  const onSubmit = async (values) => {
    setServerError("");
    const data = { ...item?.data };
    for (const field of dataFields) data[field.name] = values[`data_${field.name}`]?.trim() || null;

    const formData = new FormData();
    formData.append("title", values.title.trim() || defaultTitle?.(data) || "");
    formData.append("is_visible", String(values.is_visible));
    for (const name of TEXT_FIELDS) {
      if (fields.includes(name)) formData.append(name, values[name] ?? "");
    }
    if (fields.includes("points")) {
      const points = values.points
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
      formData.append("points", JSON.stringify(points));
    }
    if (dataFields.length) formData.append("data", JSON.stringify(data));
    const derivedIcon = iconFromData?.(data);
    if (derivedIcon) formData.set("icon", derivedIcon);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = isEdit
        ? await updateSectionItem(item.id, formData)
        : await createSectionItem(sectionKey, formData);
      onSaved(res.data, isEdit ? "Changes saved." : `New ${itemLabel} added.`);
      onClose();
    } catch (err) {
      setServerError(err.message);
    }
  };

  const deleteSavedImage = async () => {
    const res = await updateSectionItem(item.id, { remove_image: true });
    setSavedImage(null);
    onSaved(res.data, "Image deleted.");
  };

  const renderField = (name) => {
    const id = `item-${name}`;
    const label = labelFor(name);
    const hint = hintFor(name);
    const placeholder = placeholderFor(name);

    switch (name) {
      case "icon":
        return (
          <Field key={name} label={label} htmlFor={id} hint={hint}>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <IconSelect id={id} value={field.value} onChange={field.onChange} />
              )}
            />
          </Field>
        );
      case "image":
        return (
          <ImageField
            key={name}
            label={label}
            hint={hint}
            savedUrl={savedImage ? optimizeImage(savedImage, 800) : null}
            file={imageFile}
            onFileChange={setImageFile}
            onDeleteSaved={deleteSavedImage}
            disabled={isSubmitting}
          />
        );
      case "description":
      case "points":
        return (
          <Field key={name} label={label} htmlFor={id} hint={hint}>
            <textarea
              id={id}
              rows={name === "points" ? 6 : 3}
              className={inputClass}
              placeholder={placeholder}
              {...register(name)}
            />
          </Field>
        );
      case "link":
        return (
          <Field key={name} label={label} htmlFor={id} hint={hint} error={errors.link?.message}>
            <input
              id={id}
              className={inputClass}
              placeholder={placeholder}
              aria-invalid={errors.link ? "true" : "false"}
              {...register("link", {
                validate: (value) => {
                  if (!value.trim()) return !required.includes("link") || "This field is required";
                  return LINK_PATTERN.test(value.trim()) || "Enter #section, /page or https://...";
                },
              })}
            />
          </Field>
        );
      default: // subtitle, note
        return (
          <Field key={name} label={label} htmlFor={id} hint={hint} error={errors[name]?.message}>
            <input
              id={id}
              className={inputClass}
              placeholder={placeholder}
              aria-invalid={errors[name] ? "true" : "false"}
              {...register(name, {
                validate: (value) =>
                  !required.includes(name) || value.trim() !== "" || "This field is required",
              })}
            />
          </Field>
        );
    }
  };

  const renderDataField = (field) => {
    const id = `item-data-${field.name}`;
    const name = `data_${field.name}`;
    return (
      <Field key={name} label={field.label} htmlFor={id} hint={field.hint}>
        {field.type === "select" ? (
          <select id={id} className={inputClass} {...register(name)}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={id}
            rows={2}
            className={inputClass}
            placeholder={field.placeholder}
            {...register(name)}
          />
        ) : (
          <input
            id={id}
            type={field.type ?? "text"}
            className={inputClass}
            placeholder={field.placeholder}
            {...register(name)}
          />
        )}
      </Field>
    );
  };

  return (
    <Modal
      title={isEdit ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
      onClose={onClose}
      closeDisabled={isSubmitting}
    >
      <ModalForm
        onSubmit={handleSubmit(onSubmit)}
        onCancel={onClose}
        submitting={isSubmitting}
        submitLabel={isEdit ? "Save changes" : `Add ${itemLabel}`}
      >
        {serverError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{serverError}</p>
          </div>
        )}

        {/* With defaultTitle the title is optional (filled in from the data on save). */}
        <Field
          label={defaultTitle ? labelFor("title") : `${labelFor("title")} *`}
          htmlFor="item-title"
          hint={hintFor("title")}
          error={errors.title?.message}
        >
          <input
            id="item-title"
            className={inputClass}
            placeholder={placeholderFor("title")}
            aria-invalid={errors.title ? "true" : "false"}
            {...register("title", {
              validate: (value) =>
                Boolean(defaultTitle) || value.trim() !== "" || `${labelFor("title")} is required`,
            })}
          />
        </Field>

        {dataFields.map(renderDataField)}
        {fields.map(renderField)}

        <Toggle
          id="item-visible"
          label="Visible on website"
          description="Hidden items stay here but aren't shown to visitors."
          register={register("is_visible")}
        />
      </ModalForm>
    </Modal>
  );
}

export default SectionItemModal;
