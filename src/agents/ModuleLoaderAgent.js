export default class ModuleLoaderAgent {
  constructor() {
    this.modules = [];
  }

  register(module) {
    this.modules.push(module);
    module.init && module.init();
  }
}
