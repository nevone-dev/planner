export default class PersistenceAgent {
  save(key, value) {
    if (window.api && window.api.save) {
      window.api.save(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  load(key) {
    if (window.api && window.api.load) {
      const v = window.api.load(key);
      return v ?? null;
    }
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  }
}
