import React from 'react';
import TaskManagerAgent from './agents/TaskManagerAgent';
import ScheduleAgent from './agents/ScheduleAgent';

export default function App() {
  const taskAgent = React.useMemo(() => new TaskManagerAgent(), []);
  const scheduleAgent = React.useMemo(() => new ScheduleAgent(taskAgent), [taskAgent]);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Planner</h1>
      <div>
        <button onClick={() => taskAgent.addTask('New Task')}>Add Task</button>
      </div>
      <ul>
        {scheduleAgent.getTasks().map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
