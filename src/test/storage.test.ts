import { describe, expect, it, vi } from "vitest";
import { isStorageAvailable, readJson, removeKey, writeJson } from "@/lib/storage";

/** A Storage double whose every method throws — simulates private mode. */
function blockedStorage(): Storage {
  const boom = () => {
    throw new DOMException("QuotaExceededError");
  };
  return {
    length: 0,
    clear: boom,
    getItem: boom,
    key: () => null,
    removeItem: boom,
    setItem: boom,
  } as Storage;
}

/** In-memory storage double that never throws. */
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  } as Storage;
}

describe("storage", () => {
  it("reports availability when the backend works", () => {
    expect(isStorageAvailable(memoryStorage())).toBe(true);
  });

  it("reports unavailability when setItem throws (private mode)", () => {
    expect(isStorageAvailable(blockedStorage())).toBe(false);
  });

  it("writeJson then readJson round-trips", () => {
    const backend = memoryStorage();
    expect(writeJson("k", { a: 1 }, backend)).toBe(true);
    expect(
      readJson("k", (v) => (typeof v === "object" && v !== null ? (v as { a: number }) : null), backend),
    ).toEqual({ a: 1 });
  });

  it("readJson returns null for corrupted JSON", () => {
    const backend = memoryStorage();
    backend.setItem("k", "{not json");
    expect(readJson("k", () => "x", backend)).toBeNull();
  });

  it("readJson returns null when the validator rejects", () => {
    const backend = memoryStorage();
    writeJson("k", { broken: true }, backend);
    expect(readJson("k", () => null, backend)).toBeNull();
  });

  it("readJson returns null for absent keys", () => {
    expect(readJson("missing", () => "x", memoryStorage())).toBeNull();
  });

  it("writeJson returns false when writes throw", () => {
    expect(writeJson("k", {}, blockedStorage())).toBe(false);
  });

  it("removeKey does not throw when storage is blocked", () => {
    const backend = blockedStorage();
    const spy = vi.spyOn(backend, "removeItem");
    expect(() => removeKey("k", backend)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});
