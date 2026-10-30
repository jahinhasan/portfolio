import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  title: string;
  /** Optional longer description announced with the dialog. */
  description?: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}

/**
 * Modal dialog: focus-trapped, Escape-to-close, focus restored on close,
 * background scroll locked, backdrop click closes. Rendered conditionally
 * by the parent.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeLabel = "Close dialog",
}: DialogProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onEscape: onClose });
  const titleId = useStableId("dialog-title");
  const descriptionId = useStableId("dialog-description");

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 motion-safe:animate-[fade-in_180ms_ease-out]"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-hidden border border-line-strong bg-surface shadow-pop",
          "sm:max-w-2xl motion-safe:animate-[dialog-in_200ms_ease-out]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-0.5 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="p-1.5 text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

/** Stable DOM id; deduped across dialog instances by React's useId. */
function useStableId(prefix: string): string {
  const id = useId();
  return `${prefix}-${id.replace(/[:]/g, "")}`;
}

