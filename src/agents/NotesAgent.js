export default class NotesAgent {
  constructor() {
    this.notes = [];
    this.counter = 1;
  }

  addNote(text) {
    const note = { id: this.counter++, text };
    this.notes.push(note);
    return note;
  }

  getNotes() {
    return this.notes;
  }
}
