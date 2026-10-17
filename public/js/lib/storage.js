/**
 * Safe wrapper around `localStorage` and `sessionStorage`.
 *
 * - Serializes/deserializes JSON automatically.
 * - Catches errors (private mode, quota exceeded) and falls back to memory.
 * - Exposes ready-made instances: `local` and `session`.
 *
 * Usage:
 *   import { local, session } from "../lib/storage.js";
 *   local.set("theme", "dark");
 *   const theme = local.get("theme", "light");
 */
export class StorageManager {
  #backend = null;
  #memory = null;
  #available = true;

  constructor(type = "local") {
    try {
      const backend = type === "session" ? sessionStorage : localStorage;
      const probe = "__qtech_probe__";
      backend.setItem(probe, "1");
      backend.removeItem(probe);
      this.#backend = backend;
    } catch {
      this.#available = false;
      this.#memory = new Map();
    }
  }

  get available() {
    return this.#available;
  }

  get(key, fallback = null) {
    try {
      const raw = this.#available
        ? this.#backend.getItem(key)
        : this.#memory.has(key)
          ? this.#memory.get(key)
          : null;
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (this.#available) this.#backend.setItem(key, raw);
      else this.#memory.set(key, raw);
      return true;
    } catch {
      return false;
    }
  }

  remove(key) {
    if (this.#available) this.#backend.removeItem(key);
    else this.#memory.delete(key);
  }

  has(key) {
    if (this.#available) return this.#backend.getItem(key) !== null;
    return this.#memory.has(key);
  }

  clear() {
    if (this.#available) this.#backend.clear();
    else this.#memory.clear();
  }
}

export const local = new StorageManager("local");
export const session = new StorageManager("session");
