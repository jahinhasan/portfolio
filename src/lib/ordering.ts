import type { SectionId } from "@/types";
import { defaultSectionOrder } from "@/data/navigation";
import { defaultProjectOrder } from "@/data/projects";

/**
 * Pure ordering helpers — shared by the customization UI and its tests.
 */

/** Immutable list move (dnd-kit's arrayMove, local for full test control). */
export function arrayMove<T>(list: readonly T[], from: number, to: number): T[] {
  const copy = [...list];
  const boundedFrom = Math.max(0, Math.min(list.length - 1, from));
  const boundedTo = Math.max(0, Math.min(list.length - 1, to));
  if (boundedFrom === boundedTo) return copy;
  const [item] = copy.splice(boundedFrom, 1);
  if (item === undefined) return copy;
  copy.splice(boundedTo, 0, item);
  return copy;
}

/**
 * Resolve a stored order against the canonical set.
 * Missing items are appended in canonical order; unknown items are dropped;
 * duplicates are removed (first occurrence wins). Always returns a complete,
 * duplicate-free permutation.
 */
export function resolveOrder<T extends string>(
  stored: unknown,
  canonical: readonly T[],
): T[] {
  if (!Array.isArray(stored)) return [...canonical];
  const canonicalSet = new Set<T>(canonical);
  const seen = new Set<T>();
  const result: T[] = [];
  for (const entry of stored) {
    if (typeof entry === "string" && canonicalSet.has(entry as T) && !seen.has(entry as T)) {
      seen.add(entry as T);
      result.push(entry as T);
    }
  }
  for (const item of canonical) {
    if (!seen.has(item)) result.push(item);
  }
  return result;
}

export const resolveSectionOrder = (stored: unknown): SectionId[] =>
  resolveOrder(stored, defaultSectionOrder);

/**
 * Resolve a stored project order. Every canonical project must survive —
 * including ones added to the data file after the preference was stored —
 * so this is resolveOrder over the canonical project ids.
 */
export const resolveProjectOrder = (stored: unknown): string[] =>
  resolveOrder(stored, defaultProjectOrder);

/** Count of positional differences from the canonical order. */
export function deviationFromCanonical<T>(order: readonly T[], canonical: readonly T[]): number {
  return order.reduce((acc, item, i) => (item === canonical[i] ? acc : acc + 1), 0);
}
