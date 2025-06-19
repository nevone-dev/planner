export default class ModuleLoaderAgent {
  constructor() {
    this.modules = [];
  }

  register(module) {
    this.modules.push(module);
    module.init && module.init();
  }

  getModule(id) {
    return this.modules.find((m) => m.id === id);
  }
}
