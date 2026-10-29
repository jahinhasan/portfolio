/**
 * Safe localStorage access.
 *
 * localStorage can be absent (SSR, file://, hardened browsers) or throw
 * (Safari private mode quota). Every read/write is guarded so preference
 * failures degrade to in-memory defaults instead of crashing the site.
 *
 * The backend is injectable so tests can simulate blocked storage without
 * monkey-patching cross-realm objects.
 */

export function isStorageAvailable(backend: Storage = window.localStorage): boolean {
  try {
    const probeKey = "__portfolio_probe__";
    backend.setItem(probeKey, "1");
    backend.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function readJson<T>(
  key: string,
  validate: (value: unknown) => T | null,
  backend: Storage = window.localStorage,
): T | null {
  try {
    const raw = backend.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed);
  } catch {
    // Corrupted JSON or blocked storage — treat as absent.
    return null;
  }
}

export function writeJson(key: string, value: unknown, backend: Storage = window.localStorage): boolean {
  try {
    backend.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string, backend: Storage = window.localStorage): void {
  try {
    backend.removeItem(key);
  } catch {
    // Ignore — nothing sensible to do.
  }
}
