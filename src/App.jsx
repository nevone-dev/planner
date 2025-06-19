import React from 'react';
import TaskManagerAgent from './agents/TaskManagerAgent';
import ScheduleAgent from './agents/ScheduleAgent';

const BUCKETS = {
  now: '🔥 Now',
  next: '🌓 Next',
  later: '🌱 Later',
  someday: '💤 Someday',
  incubator: '🧪 Incubator',
};

const ALTITUDES = {
  vision: '40k – Vision',
  domain: '20k – Domain',
  objective: '10k – Objective',
  project: '5k – Project',
  task: 'Runway',
};

const DOMAINS = ['Health', 'Career', 'Finance', 'Learning', 'Life Admin', 'General'];

export default function App() {
  const taskAgent = React.useMemo(() => new TaskManagerAgent(), []);
  const scheduleAgent = React.useMemo(
    () => new ScheduleAgent(taskAgent),
    [taskAgent]
  );

  const [tasks, setTasks] = React.useState(scheduleAgent.getTasks());
  const [newTitle, setNewTitle] = React.useState('');
  const [newDue, setNewDue] = React.useState('');
  const [newBucket, setNewBucket] = React.useState('now');
  const [newAltitude, setNewAltitude] = React.useState('task');
  const [newDomain, setNewDomain] = React.useState('General');
  const [editingId, setEditingId] = React.useState(null);
  const [editingText, setEditingText] = React.useState('');
  const [editingDue, setEditingDue] = React.useState('');
  const [editingBucket, setEditingBucket] = React.useState('now');
  const [editingAltitude, setEditingAltitude] = React.useState('task');
  const [editingDomain, setEditingDomain] = React.useState('General');

  React.useEffect(() => {
    taskAgent.addChangeListener(() => setTasks([...scheduleAgent.getTasks()]));
    // initialize state from persistence
    setTasks(scheduleAgent.getTasks());
  }, [taskAgent, scheduleAgent]);

  const handleAdd = () => {
    if (newTitle.trim()) {
      taskAgent.addTask(
        newTitle.trim(),
        newDue || null,
        newBucket,
        newAltitude,
        newDomain,
      );
      setNewTitle('');
      setNewDue('');
      setNewBucket('now');
      setNewAltitude('task');
      setNewDomain('General');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
    setEditingDue(task.dueDate || '');
    setEditingBucket(task.bucket || 'now');
    setEditingAltitude(task.altitude || 'task');
    setEditingDomain(task.domain || 'General');
  };

  const saveEdit = () => {
    taskAgent.updateTask(editingId, {
      title: editingText,
      dueDate: editingDue || null,
      bucket: editingBucket,
      altitude: editingAltitude,
      domain: editingDomain,
    });
    setEditingId(null);
    setEditingText('');
    setEditingDue('');
    setEditingBucket('now');
    setEditingAltitude('task');
    setEditingDomain('General');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingBucket('now');
    setEditingAltitude('task');
    setEditingDomain('General');
  };

  const deleteTask = (id) => {
    taskAgent.deleteTask(id);
  };

  const toggleComplete = (id) => {
    taskAgent.toggleComplete(id);
  };

  return (
    <div className="p-4 font-sans max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Planner</h1>
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <input
          className="border rounded px-2 py-1 flex-grow"
          placeholder="New task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={newDue}
          onChange={(e) => setNewDue(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={newBucket}
          onChange={(e) => setNewBucket(e.target.value)}
        >
          {Object.entries(BUCKETS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={newAltitude}
          onChange={(e) => setNewAltitude(e.target.value)}
        >
          {Object.entries(ALTITUDES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
        >
          {DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {Object.entries(BUCKETS).map(([bKey, bLabel]) => (
          <div key={bKey} className="bg-gray-100 p-2 rounded">
            <h2 className="font-semibold mb-2 text-center">{bLabel}</h2>
            <ul className="space-y-2">
              {tasks
                .filter((t) => t.bucket === bKey && !t.completed)
                .map((t) => (
                  <li key={t.id} className="border rounded p-2 text-sm">
                    {editingId === t.id ? (
                      <>
                        <input
                          className="border rounded px-1 py-0.5 mb-1 w-full"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <input
                          type="date"
                          className="border rounded px-1 py-0.5 mb-1 w-full"
                          value={editingDue}
                          onChange={(e) => setEditingDue(e.target.value)}
                        />
                        <select
                          className="border rounded px-1 py-0.5 mb-1 w-full"
                          value={editingBucket}
                          onChange={(e) => setEditingBucket(e.target.value)}
                        >
                          {Object.entries(BUCKETS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <select
                          className="border rounded px-1 py-0.5 mb-1 w-full"
                          value={editingAltitude}
                          onChange={(e) => setEditingAltitude(e.target.value)}
                        >
                          {Object.entries(ALTITUDES).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <select
                          className="border rounded px-1 py-0.5 mb-1 w-full"
                          value={editingDomain}
                          onChange={(e) => setEditingDomain(e.target.value)}
                        >
                          {DOMAINS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-green-600 text-xs"
                            onClick={saveEdit}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-600 text-xs"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            className="mr-1"
                            checked={t.completed}
                            onChange={() => toggleComplete(t.id)}
                          />
                          <span className="flex-grow">{t.title}</span>
                        </div>
                        {t.dueDate && (
                          <div className="text-gray-600 text-xs mb-1">
                            {new Date(t.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="text-xs mb-1">
                          {ALTITUDES[t.altitude]} – {t.domain}
                        </div>
                        <div className="flex justify-end gap-1">
                          <button
                            className="text-blue-600 text-xs"
                            onClick={() => startEdit(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 text-xs"
                            onClick={() => deleteTask(t.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Completed</h2>
      <ul className="space-y-2">
        {tasks
          .filter((t) => t.completed)
          .map((t) => (
            <li key={t.id} className="border rounded p-2 flex justify-between">
              <span>{t.title}</span>
              {t.dueDate && (
                <span className="text-sm text-gray-600">
                  {new Date(t.dueDate).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
