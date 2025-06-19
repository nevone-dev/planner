export default class ScheduleAgent {
  constructor(taskAgent) {
    this.taskAgent = taskAgent;
    this.lookaheadDays = 3;
  }

  getTasks() {
    return this.taskAgent.getTasks();
  }

  _today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  getOverdueTasks() {
    const today = this._today();
    return this.getTasks().filter(
      (t) =>
        !t.completed &&
        t.dueDate &&
        new Date(t.dueDate) < today
    );
  }

  getDueSoonTasks() {
    const today = this._today();
    const soon = new Date(today);
    soon.setDate(soon.getDate() + this.lookaheadDays);
    return this.getTasks().filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= today && d <= soon;
    });
  }
}
