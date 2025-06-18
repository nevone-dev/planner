export default class UIAgent {
  constructor() {
    this.listeners = [];
  }

  onEvent(listener) {
    this.listeners.push(listener);
  }

  emit(event) {
    this.listeners.forEach((l) => l(event));
  }
}
