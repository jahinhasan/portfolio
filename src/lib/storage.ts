/**
 * Safe localStorage access.
 *
 * localStorage can be absent (SSR, file://, hardened browsers) or throw
 * (Safari private mode quota). Every read/write is guarded so preference
 * failures degrade to in-memory defaults instead of crashing the site.
 */

export function isStorageAvailable(): boolean {
  try {
    const probeKey = "__portfolio_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function readJson<T>(key: string, validate: (value: unknown) => T | null): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed);
  } catch {
    // Corrupted JSON or blocked storage — treat as absent.
    return null;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore — nothing sensible to do.
  }
}
