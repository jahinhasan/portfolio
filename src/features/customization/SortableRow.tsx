import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SortableRowProps {
  id: string;
  label: string;
  hint?: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  trailing?: ReactNode;
}

/**
 * One draggable row in an ordering list. Dragging uses the grip handle;
 * explicit up/down buttons provide the keyboard-accessible alternative
 * required for visitors who can't or don't want to drag.
 */
export function SortableRow({
  id,
  label,
  hint,
  index,
  total,
  onMoveUp,
  onMoveDown,
  trailing,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-surface px-2 py-2",
        isDragging ? "z-10 border-accent shadow-pop opacity-90" : "border-line",
      )}
      aria-label={`${label}. Position ${index + 1} of ${total}.`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label}`}
        className="cursor-grab touch-none rounded p-1 text-faint hover:text-ink active:cursor-grabbing"
        onKeyDown={(e) => {
          // dnd-kit handles Space/Enter pickup; prevent page scroll on Space.
          if (e.key === " " || e.key === "Spacebar") e.preventDefault();
        }}
      >
        <GripVertical size={15} aria-hidden="true" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm text-ink">
        {label}
        {hint ? <span className="ml-2 font-mono text-[10px] text-faint">{hint}</span> : null}
      </span>

      {trailing}

      <span className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label={`Move ${label} up`}
          className="rounded p-0.5 text-faint hover:text-ink disabled:opacity-30 disabled:hover:text-faint"
        >
          <ChevronUp size={13} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label={`Move ${label} down`}
          className="rounded p-0.5 text-faint hover:text-ink disabled:opacity-30 disabled:hover:text-faint"
        >
          <ChevronDown size={13} aria-hidden="true" />
        </button>
      </span>
    </li>
  );
}
