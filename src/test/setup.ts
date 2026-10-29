import { JSDOM } from "jsdom";
import "@testing-library/jest-dom/vitest";

// jsdom lacks matchers for some APIs used indirectly by components.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

/*
 * Node ≥26 exposes an experimental `localStorage` global that is undefined
 * unless `--localstorage-file` is passed, and it shadows jsdom's working
 * implementation inside the vitest sandbox. Install jsdom's storage
 * explicitly on both the window and the sandbox global.
 */
function installStorage(): void {
  const source = new JSDOM("", { url: window.location.href });
  const storage = source.window.localStorage;
  for (const target of [window, globalThis] as Array<typeof globalThis>) {
    Object.defineProperty(target, "localStorage", {
      value: storage,
      configurable: true,
      writable: true,
    });
  }
}

if (typeof window.localStorage === "undefined") {
  installStorage();
}
