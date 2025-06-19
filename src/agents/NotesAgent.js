export default class NotesAgent {
  constructor() {
    this.notes = [];
    this.counter = 1;
  }

  addNote(text, taskId = null) {
    const note = { id: this.counter++, text, taskId };
    this.notes.push(note);
    return note;
  }

  getNotes(taskId = null) {
    if (taskId === null) return this.notes;
    return this.notes.filter((n) => n.taskId === taskId);
  }
}
