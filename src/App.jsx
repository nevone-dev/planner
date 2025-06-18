import React from 'react';
import TaskManagerAgent from './agents/TaskManagerAgent';
import ScheduleAgent from './agents/ScheduleAgent';

export default function App() {
  const taskAgent = React.useMemo(() => new TaskManagerAgent(), []);
  const scheduleAgent = React.useMemo(
    () => new ScheduleAgent(taskAgent),
    [taskAgent]
  );

  const [tasks, setTasks] = React.useState(scheduleAgent.getTasks());
  const [newTitle, setNewTitle] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);
  const [editingText, setEditingText] = React.useState('');

  React.useEffect(() => {
    taskAgent.addChangeListener(() => setTasks([...scheduleAgent.getTasks()]));
    // initialize state from persistence
    setTasks(scheduleAgent.getTasks());
  }, [taskAgent, scheduleAgent]);

  const handleAdd = () => {
    if (newTitle.trim()) {
      taskAgent.addTask(newTitle.trim());
      setNewTitle('');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = () => {
    taskAgent.updateTask(editingId, editingText);
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const deleteTask = (id) => {
    taskAgent.deleteTask(id);
  };

  return (
    <div className="p-4 font-sans max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Planner</h1>
      <div className="flex mb-4 gap-2">
        <input
          className="border rounded px-2 py-1 flex-grow"
          placeholder="New task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="border rounded p-2 flex items-center justify-between"
          >
            {editingId === t.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 flex-grow mr-2"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button className="text-green-600 mr-2" onClick={saveEdit}>
                  Save
                </button>
                <button className="text-gray-600" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-grow">{t.title}</span>
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => startEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteTask(t.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
