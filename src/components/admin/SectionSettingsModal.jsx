import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import { optimizeImage } from "../../lib/cloudinary";
import { updateSection } from "../../lib/sections";
import { Field, IconSelect, inputClass } from "./FormControls";
import ImageField from "./ImageField";
import Modal, { ModalForm } from "./Modal";

function toFormValues(section, config) {
  const values = {
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    subtitle: section.subtitle ?? "",
  };
  for (const field of config.contentFields) {
    const value = section.content?.[field.name];
    values[`content_${field.name}`] =
      field.type === "list" ? (Array.isArray(value) ? value.join("\n") : "") : (value ?? "");
  }
  return values;
}

/**
 * Edits a section's heading (eyebrow / title / subtitle), its image and any
 * section-specific fields. Calls `onSaved(section)` with the updated row.
 */
function SectionSettingsModal({ sectionKey, config, section, onClose, onSaved }) {
  const [imageFile, setImageFile] = useState(null);
  const [savedImage, setSavedImage] = useState(section.image_url);
  const [serverError, setServerError] = useState("");
  const placeholders = config.placeholders ?? {};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(section, config) });

  const onSubmit = async (values) => {
    setServerError("");
    const content = { ...section.content };
    for (const field of config.contentFields) {
      const raw = values[`content_${field.name}`] ?? "";
      content[field.name] =
        field.type === "list"
          ? raw
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : raw.trim() || null;
    }

    const formData = new FormData();
    formData.append("eyebrow", values.eyebrow);
    formData.append("title", values.title);
    formData.append("subtitle", values.subtitle);
    formData.append("content", JSON.stringify(content));
    if (imageFile) formData.append("image", imageFile);

    try {
      const { data } = await updateSection(sectionKey, formData);
      onSaved(data, "Section details saved.");
      onClose();
    } catch (err) {
      setServerError(err.message);
    }
  };

  const deleteSavedImage = async () => {
    const { data } = await updateSection(sectionKey, { remove_image: true });
    setSavedImage(null);
    onSaved(data, "Image deleted.");
  };

  return (
    <Modal title={`Edit ${config.label} section`} onClose={onClose} closeDisabled={isSubmitting}>
      <ModalForm
        onSubmit={handleSubmit(onSubmit)}
        onCancel={onClose}
        submitting={isSubmitting}
        submitLabel="Save section"
      >
        {serverError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{serverError}</p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow" htmlFor="eyebrow" hint="Small label above the title.">
            <input
              id="eyebrow"
              className={inputClass}
              placeholder={placeholders.eyebrow ?? "e.g. What We Do"}
              {...register("eyebrow")}
            />
          </Field>
          <Field label="Title *" htmlFor="title" error={errors.title?.message}>
            <input
              id="title"
              className={inputClass}
              placeholder={placeholders.title ?? "e.g. Our Expertise"}
              aria-invalid={errors.title ? "true" : "false"}
              {...register("title", {
                validate: (value) => value.trim() !== "" || "Title is required",
              })}
            />
          </Field>
        </div>

        <Field label="Subtitle" htmlFor="subtitle">
          <textarea
            id="subtitle"
            rows={2}
            className={inputClass}
            placeholder={placeholders.subtitle ?? "One sentence shown under the title (optional)"}
            {...register("subtitle")}
          />
        </Field>

        {config.contentFields.map((field) => {
          const name = `content_${field.name}`;
          const id = `field-${field.name}`;
          return (
            <Field key={field.name} label={field.label} htmlFor={id} hint={field.hint}>
              {field.type === "icon" ? (
                <Controller
                  name={name}
                  control={control}
                  render={({ field: f }) => <IconSelect id={id} value={f.value} onChange={f.onChange} />}
                />
              ) : field.type === "textarea" || field.type === "list" ? (
                <textarea
                  id={id}
                  rows={field.type === "list" ? 5 : 3}
                  className={inputClass}
                  placeholder={field.placeholder}
                  {...register(name)}
                />
              ) : (
                <input id={id} className={inputClass} placeholder={field.placeholder} {...register(name)} />
              )}
            </Field>
          );
        })}

        {config.image && (
          <ImageField
            label={config.image.label}
            hint={config.image.hint}
            savedUrl={savedImage ? optimizeImage(savedImage, 600) : null}
            file={imageFile}
            onFileChange={setImageFile}
            onDeleteSaved={deleteSavedImage}
            disabled={isSubmitting}
          />
        )}
      </ModalForm>
    </Modal>
  );
}

export default SectionSettingsModal;
