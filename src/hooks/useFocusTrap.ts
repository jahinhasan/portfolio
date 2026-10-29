import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function isFocusable(el: Element): boolean {
  return (
    el instanceof HTMLElement &&
    !el.hasAttribute("disabled") &&
    el.getAttribute("aria-hidden") !== "true" &&
    // Offset-parent check hides display:none subtrees without layout reads cost.
    (el.offsetParent !== null || el === document.activeElement)
  );
}

interface FocusTrapOptions {
  /** When false the trap is inert (element stays mounted but hidden). */
  active: boolean;
  /** Called on Escape. The component owns what closing means. */
  onEscape: () => void;
}

/**
 * Traps Tab focus inside the referenced container while active, closes on
 * Escape, moves focus in on open, and restores it on deactivate.
 */
export function useFocusTrap<T extends HTMLElement>(
  options: FocusTrapOptions,
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const { active, onEscape } = options;
  // Keep latest onClose without re-subscribing listeners.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable);

    // Move focus in on open.
    const first = focusables()[0];
    first?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscapeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const firstEl = items[0]!;
      const lastEl = items[items.length - 1]!;
      const current = document.activeElement;
      if (event.shiftKey) {
        if (current === firstEl || !container.contains(current)) {
          event.preventDefault();
          lastEl.focus();
        }
      } else if (current === lastEl || !container.contains(current)) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener("keydown", handleKeydown);
    return () => {
      container.removeEventListener("keydown", handleKeydown);
      previouslyFocused?.focus();
    };
  }, [active]);

  return containerRef;
}
