import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { Check, Palette, RotateCcw, X } from "lucide-react";
import type { SectionId } from "@/types";
import { getSectionMeta } from "@/data/navigation";
import { accentPresets } from "@/data/theme";
import { getProjectById, projects as allProjects } from "@/data/projects";
import { isProjectFeatured, useProjects } from "@/features/projects/useProjects";
import { usePreferences } from "./usePreferences";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { normalizeHex } from "@/lib/color";
import { SortableRow } from "./SortableRow";
import { cn } from "@/lib/cn";

interface CustomizationPanelProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Visitor customization studio: theme, accent color, section order, and
 * project order/featured state. Everything applies instantly and persists
 * to localStorage — never to the site's source data.
 */
export function CustomizationPanel({ open, onClose }: CustomizationPanelProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onEscape: onClose });
  const {
    preferences,
    persisted,
    storageAvailable,
    setTheme,
    setAccent,
    resetAccent,
    moveSection,
    resetSectionOrder,
    moveProject,
    resetProjectOrder,
    setProjectFeatured,
    setProjectLayout,
    resetAll,
  } = usePreferences();

  const [hexDraft, setHexDraft] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { featured } = useProjects();

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = preferences.sectionOrder.indexOf(active.id as SectionId);
    const to = preferences.sectionOrder.indexOf(over.id as SectionId);
    if (from === -1 || to === -1) return;
    moveSection(from, to);
  };

  const handleFeaturedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = preferences.projectOrder.indexOf(String(active.id));
    const to = preferences.projectOrder.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    moveProject(from, to);
  };

  const commitHex = (raw: string) => {
    const normalized = normalizeHex(raw);
    if (normalized) setAccent(normalized);
    setHexDraft(null);
  };

  const customActive = useMemo(
    () => !accentPresets.some((p) => p.hex.toLowerCase() === preferences.accent.toLowerCase()),
    [preferences.accent],
  );

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Customize this portfolio"
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-line bg-surface shadow-pop transition-transform duration-300 motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-accent/12 text-accent-ink">
              <Palette size={16} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-ink">Customize</h2>
              <p className="text-[11px] leading-4 text-faint">Your view only — saved in this browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customization panel"
            className=" p-1.5 text-muted hover:bg-raised hover:text-ink"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
          {/* Storage notice */}
          <p className=" border border-line bg-raised/60 px-3.5 py-3 text-xs leading-relaxed text-muted">
            Changes are stored locally in <strong className="text-ink">your browser</strong> and apply
            to your view only. They never modify the published site, its source code, or anyone
            else's experience.
            {!storageAvailable ? (
              <span className="mt-1.5 block text-amber-500">
                Browser storage is unavailable — changes apply for this visit only.
              </span>
            ) : null}
          </p>

          {/* Appearance */}
          <Group title="Appearance" hint="Theme & accent">
            <div>
              <p className="mb-2 text-xs font-medium text-muted">Interface</p>
              <div
                role="radiogroup"
                aria-label="Interface theme"
                className="grid grid-cols-2 gap-1 border border-line bg-raised/60 p-1"
              >
                {(["dark", "light"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={preferences.theme === mode}
                    onClick={() => setTheme(mode)}
                    className={cn(
                      "h-8 text-xs font-medium capitalize transition-colors",
                      preferences.theme === mode
                        ? "bg-accent text-accent-fg"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted">Accent color</p>
              <div role="radiogroup" aria-label="Accent color presets" className="grid grid-cols-6 gap-2">
                {accentPresets.map((preset) => {
                  const active = preferences.accent.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      title={preset.name}
                      onClick={() => setAccent(preset.hex)}
                      className={cn(
                        "flex h-9 items-center justify-center border-2 transition-transform hover:scale-105",
                        active ? "border-ink" : "border-transparent",
                      )}
                      style={{ backgroundColor: preset.hex }}
                    >
                      {active ? (
                        <Check size={14} style={{ color: "var(--accent-fg)" }} aria-hidden="true" />
                      ) : null}
                      <span className="sr-only">{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <label className="relative inline-flex h-9 cursor-pointer items-center gap-2 overflow-hidden border border-line px-3 text-xs text-muted hover:border-accent hover:text-accent-ink">
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 border border-white/20"
                    style={{ backgroundColor: preferences.accent }}
                  />
                  Custom
                  <input
                    type="color"
                    value={preferences.accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Pick a custom accent color"
                  />
                </label>
                <input
                  type="text"
                  value={hexDraft ?? preferences.accent}
                  onChange={(e) => setHexDraft(e.target.value)}
                  onBlur={(e) => commitHex(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitHex((e.target as HTMLInputElement).value);
                  }}
                  placeholder="#7c5cff"
                  aria-label="Accent color as hex value"
                  spellCheck={false}
                  className="h-9 w-24 border border-line bg-raised/60 px-2.5 font-mono text-xs text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    resetAccent();
                    setHexDraft(null);
                  }}
                  className="ml-auto inline-flex items-center gap-1.5 px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-faint hover:text-ink"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  Reset
                </button>
              </div>
              {customActive ? (
                <p className="mt-1.5 font-mono text-[10px] text-faint">Custom color active</p>
              ) : null}
            </div>
          </Group>

          {/* Section order */}
          <Group
            title="Section order"
            hint="Drag or use arrows"
            action={
              <ResetButton onClick={resetSectionOrder} label="Reset section order" />
            }
          >
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={preferences.sectionOrder} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1.5">
                  {preferences.sectionOrder.map((id, index) => {
                    const meta = getSectionMeta(id);
                    return (
                      <SortableRow
                        key={id}
                        id={id}
                        label={meta.label}
                        hint={meta.index}
                        index={index}
                        total={preferences.sectionOrder.length}
                        onMoveUp={() => moveSection(index, index - 1)}
                        onMoveDown={() => moveSection(index, index + 1)}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
            </DndContext>
            <p className="mt-2 text-[11px] leading-4 text-faint">
              Navigation links follow this order automatically.
            </p>
          </Group>

          {/* Projects */}
          <Group
            title="Projects"
            hint="Order & featured"
            action={<ResetButton onClick={resetProjectOrder} label="Reset project order" />}
          >
            <div>
              <p className="mb-2 text-xs font-medium text-muted">Featured ordering</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFeaturedDragEnd}>
                <SortableContext items={featured.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-1.5">
                    {featured.map((p, index) => (
                      <SortableRow
                        key={p.id}
                        id={p.id}
                        label={p.name}
                        index={index}
                        total={featured.length}
                        onMoveUp={() => moveProject(preferences.projectOrder.indexOf(p.id), preferences.projectOrder.indexOf(p.id) - 1)}
                        onMoveDown={() => moveProject(preferences.projectOrder.indexOf(p.id), preferences.projectOrder.indexOf(p.id) + 1)}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setProjectFeatured(p.id, false)}
                            aria-label={`Remove ${p.name} from featured`}
                            className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase text-faint hover:text-accent-ink"
                          >
                            Unfeature
                          </button>
                        }
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted">Featured selection</p>
              <ul className="space-y-1">
                {allProjects
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => {
                    const isFeatured = isProjectFeatured(p, preferences.featuredOverrides);
                    return (
                      <li key={p.id}>
                        <label className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm text-muted hover:bg-raised/60 hover:text-ink">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setProjectFeatured(p.id, e.target.checked)}
                            className="h-3.5 w-3.5 accent-[var(--accent)]"
                          />
                          <span className="truncate">{p.name}</span>
                          <span className="ml-auto font-mono text-[10px] text-faint">
                            {getProjectById(p.id)?.year}
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted">Archive layout</p>
              <div
                role="radiogroup"
                aria-label="Archive layout"
                className="grid grid-cols-2 gap-1 border border-line bg-raised/60 p-1"
              >
                {(["grid", "list"] as const).map((layout) => (
                  <button
                    key={layout}
                    type="button"
                    role="radio"
                    aria-checked={preferences.projectLayout === layout}
                    onClick={() => setProjectLayout(layout)}
                    className={cn(
                      "h-8 text-xs font-medium capitalize transition-colors",
                      preferences.projectLayout === layout
                        ? "bg-accent text-accent-fg"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            </div>
          </Group>
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex h-9 w-full items-center justify-center gap-2 border border-line text-sm text-muted transition-colors hover:border-accent hover:text-accent-ink"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset everything to default
          </button>
          <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-wider text-faint">
            {persisted && storageAvailable ? "Saved locally ✓" : "Not saved — session only"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Group({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink">
          {title}
        </h3>
        {hint ? <span className="font-mono text-[10px] text-faint">{hint}</span> : null}
        {action}
      </div>
      {children}
    </section>
  );
}

function ResetButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded p-1 text-faint hover:text-accent-ink"
    >
      <RotateCcw size={13} aria-hidden="true" />
    </button>
  );
}
