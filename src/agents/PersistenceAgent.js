export default class PersistenceAgent {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  load(key) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  }
}
