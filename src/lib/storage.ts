export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** In-memory fallback keeps the app usable in private/restricted browser contexts. */
export function createSafeStorage(storage?: KeyValueStorage): KeyValueStorage {
  const memory = new Map<string, string>();
  return {
    getItem(key) {
      if (memory.has(key)) return memory.get(key) ?? null;
      try {
        return storage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      memory.set(key, value);
      try {
        storage?.setItem(key, value);
      } catch {
        /* Keep the session in memory. */
      }
    },
    removeItem(key) {
      memory.delete(key);
      try {
        storage?.removeItem(key);
      } catch {
        /* Storage is optional. */
      }
    },
  };
}
export function createBrowserStorage(): KeyValueStorage {
  try {
    return createSafeStorage(window.localStorage);
  } catch {
    return createSafeStorage();
  }
}
