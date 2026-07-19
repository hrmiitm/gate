const PREFIX = 'gateda:';

export const Storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('gateda:storage', { detail: { key, value } }));
    return value;
  },
  toggleIn(key, id) {
    const values = this.get(key, []);
    const next = values.includes(id) ? values.filter((item) => item !== id) : [...values, id];
    return this.set(key, next);
  },
  export() {
    const data = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(PREFIX)) data[key] = localStorage.getItem(key);
    }
    return { version: 1, exportedAt: new Date().toISOString(), data };
  },
  import(payload) {
    if (!payload || payload.version !== 1 || typeof payload.data !== 'object') {
      throw new Error('This is not a valid GATE DA progress file.');
    }
    Object.entries(payload.data).forEach(([key, value]) => {
      if (key.startsWith(PREFIX) && typeof value === 'string') localStorage.setItem(key, value);
    });
  },
};

