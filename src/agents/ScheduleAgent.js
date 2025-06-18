export default class ScheduleAgent {
  constructor(taskAgent) {
    this.taskAgent = taskAgent;
  }

  getTasks() {
    return this.taskAgent.getTasks();
  }
}
