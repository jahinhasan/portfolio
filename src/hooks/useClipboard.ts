import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

/**
 * Clipboard write with fallback for non-secure contexts and denied
 * permissions. Returns a status plus a timed reset so callers can show
 * success/failure feedback.
 */
export function useCopyToClipboard(resetAfterMs = 2200): {
  status: CopyStatus;
  copy: (text: string) => Promise<boolean>;
} {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }
      if (!ok) {
        // Legacy fallback (execCommand) for non-secure contexts.
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          ok = document.execCommand("copy");
          textarea.remove();
        } catch {
          ok = false;
        }
      }
      setStatus(ok ? "copied" : "failed");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), resetAfterMs);
      return ok;
    },
    [resetAfterMs],
  );

  return { status, copy };
}
