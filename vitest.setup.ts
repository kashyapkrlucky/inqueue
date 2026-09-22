import "@testing-library/jest-dom";

// Node 22+ defines its own global `localStorage`/`sessionStorage` accessors
// that throw/warn unless run with --localstorage-file, and they shadow
// jsdom's real implementation (same global object backs both `window.` and
// the bare reference in this environment). Replace them with a plain
// in-memory Storage implementation so localStorage-backed code under test
// behaves the way it does in a real browser.
class MemoryStorage implements Storage {
  #store = new Map<string, string>();

  get length() {
    return this.#store.size;
  }

  clear(): void {
    this.#store.clear();
  }

  getItem(key: string): string | null {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.#store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.#store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, String(value));
  }
}

for (const key of ["localStorage", "sessionStorage"] as const) {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, key, {
    value: storage,
    configurable: true,
    writable: true,
  });
}
