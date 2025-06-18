export default class TaskManagerAgent {
  constructor() {
    this.tasks = [];
    this.counter = 1;
  }

  addTask(title) {
    const task = { id: this.counter++, title };
    this.tasks.push(task);
    return task;
  }

  getTasks() {
    return this.tasks;
  }
}
