import PersistenceAgent from './PersistenceAgent';

export default class TaskManagerAgent {
  constructor(persistence = new PersistenceAgent()) {
    this.persistence = persistence;
    const saved = this.persistence.load('tasks') || [];
    // ensure legacy tasks have new fields
    this.tasks = saved.map((t) => ({
      completed: false,
      dueDate: null,
      bucket: 'now',
      altitude: 'task',
      domain: 'General',
      ...t,
    }));
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

  addTask(title, dueDate = null, bucket = 'now', altitude = 'task', domain = 'General') {
    const task = {
      id: this.counter++,
      title,
      dueDate,
      completed: false,
      bucket,
      altitude,
      domain,
    };
    this.tasks.push(task);
    this._emit();
    return task;
  }

  updateTask(id, { title, dueDate = null, bucket, altitude, domain }) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      if (title !== undefined) task.title = title;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (bucket !== undefined) task.bucket = bucket;
      if (altitude !== undefined) task.altitude = altitude;
      if (domain !== undefined) task.domain = domain;
      this._emit();
    }
  }

  toggleComplete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this._emit();
    }
  }

  setBucket(id, bucket) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.bucket = bucket;
      this._emit();
    }
  }

  setAltitude(id, altitude) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.altitude = altitude;
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
