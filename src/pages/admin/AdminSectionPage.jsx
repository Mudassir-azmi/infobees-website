import { useCallback, useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import SectionItemModal from "../../components/admin/SectionItemModal";
import SectionSettingsModal from "../../components/admin/SectionSettingsModal";
import { useConfirm } from "../../components/admin/useConfirm";
import DynamicIcon from "../../components/DynamicIcon";
import Spinner from "../../components/Spinner";
import { getAdminSectionConfig } from "../../lib/adminSections";
import { optimizeImage } from "../../lib/cloudinary";
import { formatDate } from "../../lib/format";
import {
  deleteSectionItem,
  fetchAdminSection,
  reorderSectionItems,
  updateSectionItem,
} from "../../lib/sections";

function Card({ title, description, actions, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="font-semibold text-navy">{title}</h2>
          {description && <p className="text-xs text-text-muted">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Empty({ children = "Not set" }) {
  return <span className="italic text-slate-400">{children}</span>;
}

/** Read-only preview of the section heading and its extra fields. */
function SectionSummary({ section, config }) {
  return (
    <div className={`grid gap-6 ${config.image ? "md:grid-cols-[1fr_220px]" : ""}`}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {section.eyebrow || <Empty>No eyebrow</Empty>}
          </p>
          <p className="mt-1 text-xl font-bold text-navy">{section.title}</p>
          <p className="mt-1 text-sm text-text-muted">
            {section.subtitle || <Empty>No subtitle</Empty>}
          </p>
        </div>

        {config.contentFields.length > 0 && (
          <dl className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            {config.contentFields.map((field) => {
              const value = section.content?.[field.name];
              return (
                <div key={field.name} className={field.type === "list" ? "sm:col-span-2" : ""}>
                  <dt className="text-xs font-medium text-text-muted">{field.label}</dt>
                  <dd className="mt-1 text-sm text-text-dark">
                    {field.type === "icon" ? (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold">
                        <DynamicIcon icon={value} size={14} aria-hidden="true" />
                      </span>
                    ) : field.type === "list" ? (
                      value?.length ? (
                        <span className="flex flex-wrap gap-1.5">
                          {value.map((entry) => (
                            <span key={entry} className="rounded-full bg-bg-light px-2.5 py-1 text-xs">
                              {entry}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <Empty>None</Empty>
                      )
                    ) : (
                      value || <Empty />
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>

      {config.image && (
        <div>
          <p className="mb-2 text-xs font-medium text-text-muted">{config.image.label}</p>
          {section.image_url ? (
            <img
              src={optimizeImage(section.image_url, 500)}
              alt=""
              className="h-36 w-full rounded-lg border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-36 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-xs text-slate-400">
              No image
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, index, total, busy, locked, onMove, onToggle, onEdit, onDelete }) {
  const meta =
    item.subtitle || item.description || (item.points?.length ? item.points.join(" · ") : "");

  return (
    <div
      className={`flex flex-col rounded-xl border bg-white transition-shadow hover:shadow-md ${
        item.is_visible ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50"
      } ${busy ? "opacity-50" : ""}`}
    >
      <button type="button" onClick={onEdit} className="flex flex-1 gap-4 p-4 text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy text-gold">
          {item.image_url ? (
            <img src={optimizeImage(item.image_url, 200)} alt="" className="h-full w-full object-cover" />
          ) : item.icon ? (
            <DynamicIcon icon={item.icon} size={20} aria-hidden="true" />
          ) : (
            <span className="text-lg font-bold">{item.title.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug text-navy">{item.title}</p>
          {meta && <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{meta}</p>}
          {!item.is_visible && (
            <span className="mt-2 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
              Hidden
            </span>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-slate-100 px-2 py-1.5">
        <div className="flex">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0 || locked}
            title="Move earlier"
            aria-label="Move earlier"
            className="rounded-lg p-2 text-slate-400 hover:bg-bg-light hover:text-navy disabled:opacity-30"
          >
            <FaChevronLeft size={11} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1 || locked}
            title="Move later"
            aria-label="Move later"
            className="rounded-lg p-2 text-slate-400 hover:bg-bg-light hover:text-navy disabled:opacity-30"
          >
            <FaChevronRight size={11} />
          </button>
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={onToggle}
            disabled={busy}
            title={item.is_visible ? "Hide from website" : "Show on website"}
            className="rounded-lg p-2 text-slate-400 hover:bg-bg-light hover:text-navy"
          >
            {item.is_visible ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </button>
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            title="Edit"
            className="rounded-lg p-2 text-slate-400 hover:bg-bg-light hover:text-navy"
          >
            <FaEdit size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            title="Delete"
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionEditor({ sectionKey, config }) {
  const [section, setSection] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "", notFound: false });
  const location = useLocation();
  const navigate = useNavigate();
  // Pages like the service editor come back here with a message.
  const [flash, setFlash] = useState(location.state?.message ?? "");
  const [actionError, setActionError] = useState("");
  const [editingSection, setEditingSection] = useState(false);
  const [modalItem, setModalItem] = useState(undefined); // undefined = closed, null = new item
  const [busyItemId, setBusyItemId] = useState(null);
  const [confirm, confirmDialog] = useConfirm();

  const load = useCallback(() => {
    fetchAdminSection(sectionKey)
      .then(({ data }) => {
        const { items: loadedItems, ...rest } = data;
        setSection(rest);
        setItems(loadedItems);
        setStatus({ loading: false, error: "", notFound: false });
      })
      .catch((err) =>
        setStatus({ loading: false, error: err.message, notFound: err.status === 404 })
      );
  }, [sectionKey]);

  useEffect(() => {
    load();
  }, [load]);

  const showFlash = (message) => {
    setFlash(message);
    setTimeout(() => setFlash((current) => (current === message ? "" : current)), 3000);
  };

  const upsertItem = (saved) => {
    setItems((prev) =>
      prev.some((i) => i.id === saved.id)
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [...prev, saved]
    );
  };

  const runItemAction = async (id, action, message) => {
    setBusyItemId(id);
    setActionError("");
    try {
      await action();
      if (message) showFlash(message);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyItemId(null);
    }
  };

  const toggleVisible = (item) =>
    runItemAction(
      item.id,
      async () => upsertItem((await updateSectionItem(item.id, { is_visible: !item.is_visible })).data),
      item.is_visible ? "Hidden from the website." : "Now visible on the website."
    );

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const previous = items;
    setItems(reordered); // optimistic
    runItemAction(reordered[target].id, async () => {
      try {
        setItems((await reorderSectionItems(sectionKey, reordered.map((i) => i.id))).data);
      } catch (err) {
        setItems(previous);
        throw err;
      }
    });
  };

  const removeItem = async (item) => {
    const ok = await confirm({
      title: `Delete this ${config.items.label}?`,
      message: `"${item.title}" will be permanently deleted${
        item.image_url ? ", including its image on Cloudinary" : ""
      }. This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    runItemAction(
      item.id,
      async () => {
        await deleteSectionItem(item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      },
      "Deleted."
    );
  };

  // ---------- render ----------

  if (status.loading) return <Spinner />;

  if (status.error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="mt-1 shrink-0 text-amber-500" aria-hidden="true" />
          <div className="text-sm text-text-dark">
            {status.notFound ? (
              <>
                <p className="font-semibold text-navy">This section isn&apos;t in the database yet.</p>
                <p className="mt-2 text-text-muted">
                  Run <code className="rounded bg-slate-100 px-1">Backend/src/db/sections.sql</code> in the
                  Supabase SQL Editor, then run{" "}
                  <code className="rounded bg-slate-100 px-1">npm run seed:sections</code> in the Backend
                  folder. The website shows its built-in content until then.
                </p>
              </>
            ) : (
              <p>{status.error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const SectionIcon = config.icon;
  const { label: itemLabel, plural } = config.items;
  const visibleCount = items.filter((i) => i.is_visible).length;
  const { editorPath } = config.items;
  const openNewItem = () => (editorPath ? navigate(`${editorPath}/new`) : setModalItem(null));
  const openItem = (item) => (editorPath ? navigate(`${editorPath}/${item.id}`) : setModalItem(item));

  return (
    <div className="space-y-6">
      {confirmDialog}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
            <SectionIcon size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Website section</p>
            <h1 className="text-2xl font-bold text-navy">{config.label}</h1>
            <p className="text-sm text-text-muted">{config.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/#${sectionKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-gold"
          >
            View on website <FaExternalLinkAlt size={10} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={openNewItem}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
          >
            <FaPlus size={11} aria-hidden="true" /> Add {itemLabel}
          </button>
        </div>
      </div>

      {flash && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <FaCheckCircle aria-hidden="true" /> {flash}
        </div>
      )}
      {actionError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{actionError}</p>
        </div>
      )}

      <Card
        title="Section heading"
        description={`What visitors see above the ${plural.toLowerCase()} · updated ${formatDate(section.updated_at)}`}
        actions={
          <button
            type="button"
            onClick={() => setEditingSection(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-navy hover:border-gold"
          >
            <FaPen size={11} aria-hidden="true" /> Edit section
          </button>
        }
      >
        <SectionSummary section={section} config={config} />
      </Card>

      <Card
        title={`${plural} (${items.length})`}
        description={
          items.length
            ? `${visibleCount} visible on the website · click a card to edit · arrows change the order`
            : undefined
        }
        actions={
          <button
            type="button"
            onClick={openNewItem}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
          >
            <FaPlus size={11} aria-hidden="true" /> Add {itemLabel}
          </button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              busy={busyItemId === item.id}
              locked={busyItemId !== null}
              onMove={(direction) => move(index, direction)}
              onToggle={() => toggleVisible(item)}
              onEdit={() => openItem(item)}
              onDelete={() => removeItem(item)}
            />
          ))}

          <button
            type="button"
            onClick={openNewItem}
            className="flex min-h-[8.5rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-text-muted transition-colors hover:border-gold hover:bg-gold/5 hover:text-navy"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-light">
              <FaPlus aria-hidden="true" />
            </span>
            {items.length ? `Add another ${itemLabel}` : `Add your first ${itemLabel}`}
          </button>
        </div>
      </Card>

      {editingSection && (
        <SectionSettingsModal
          sectionKey={sectionKey}
          config={config}
          section={section}
          onClose={() => setEditingSection(false)}
          onSaved={(data, message) => {
            setSection(data);
            showFlash(message);
          }}
        />
      )}

      {modalItem !== undefined && (
        <SectionItemModal
          sectionKey={sectionKey}
          config={config}
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSaved={(saved, message) => {
            upsertItem(saved);
            showFlash(message);
          }}
        />
      )}
    </div>
  );
}

function AdminSectionPage() {
  const { key } = useParams();
  const config = getAdminSectionConfig(key);
  if (!config) return <Navigate to="/admin/dashboard" replace />;
  // `key` remounts the editor when switching sections from the sidebar.
  return <SectionEditor key={key} sectionKey={key} config={config} />;
}

export default AdminSectionPage;
