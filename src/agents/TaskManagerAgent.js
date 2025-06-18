import PersistenceAgent from './PersistenceAgent';

export default class TaskManagerAgent {
  constructor(persistence = new PersistenceAgent()) {
    this.persistence = persistence;
    const saved = this.persistence.load('tasks') || [];
    this.tasks = saved;
    this.counter = this.tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    this.listeners = [];
  }

  _emit() {
    this.persistence.save('tasks', this.tasks);
    this.listeners.forEach((l) => l(this.tasks));
  }

  addChangeListener(listener) {
    this.listeners.push(listener);
  }

  addTask(title) {
    const task = { id: this.counter++, title };
    this.tasks.push(task);
    this._emit();
    return task;
  }

  updateTask(id, title) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.title = title;
      this._emit();
    }
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.tasks.splice(idx, 1);
      this._emit();
    }
  }

  getTasks() {
    return this.tasks;
  }
}
