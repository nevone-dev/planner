# Agents - Modular Planner

This file documents the logical agents (modules/components) in the self-hosted modular planner system. Each agent can function independently, but integrates through a shared state and message bus architecture.

## 🧠 TaskManagerAgent

**Role**: Handles creation, update, and querying of tasks. Supports metadata, statuses, and recurring rules.

**Responsibilities**:
- Create/update/delete single and recurring tasks
- Apply fuzzy recurrence (e.g., "every 3 weeks")
- Resolve missed or upcoming occurrences dynamically

## 📅 ScheduleAgent

**Role**: Maintains computed "due soon", "overdue", and "due today" task buckets.

**Responsibilities**:
- Recompute status buckets periodically or on task update
- Detect when recurring tasks should be surfaced
- Provide time-bounded task queries

## 💾 PersistenceAgent

**Role**: Local-first state storage and recovery, with eventual sync strategies (optional for MVP).

**Responsibilities**:
- Save/load state from local filesystem (e.g., JSON, SQLite)
- Snapshot backups for versioning or undo support
- Sync adapter interface (future)

## 🧩 ModuleLoaderAgent

**Role**: Handles registration and lifecycle of optional modules.

**Responsibilities**:
- Enable/disable modules via configuration
- Isolate module state where applicable
- Expose shared module interface contracts

## 📊 UIAgent

**Role**: Manages rendering of terminal or web interface (depending on frontend choice).

**Responsibilities**:
- Route commands or UI events to the appropriate agent
- Render tasks, schedules, and dashboards
- Handle config-driven theming/layouts

## 📓 NotesAgent (Optional)

**Role**: Manage simple markdown or plaintext notes, with optional task references.

**Responsibilities**:
- CRUD operations for note documents
- Tag and link notes to tasks or schedules


== Method

The planner system is built using a modular, agent-oriented architecture deployed as a self-hosted desktop app via Electron. The UI is developed in React with TailwindCSS, and local storage is handled using SQLite and JSON files. Inter-agent communication is managed via a shared event bus and central state context.

=== Architecture Overview

[plantuml, architecture, png]
----
@startuml
package "Electron Shell" {
  [Electron Main Process] --> [React UI]
}

package "Frontend (React)" {
  [React UI] --> [UIAgent]
  [UIAgent] --> [TaskManagerAgent]
  [UIAgent] --> [ScheduleAgent]
  [UIAgent] --> [ModuleLoaderAgent]
}

package "Backend Logic" {
  [TaskManagerAgent] --> [PersistenceAgent]
  [ScheduleAgent] --> [TaskManagerAgent]
  [ModuleLoaderAgent] --> [NotesAgent]
}

package "Storage" {
  [PersistenceAgent] --> [SQLite/JSON Store]
}
@enduml
----

=== Key Components

- **Electron Shell**: Wraps the web-based React app and gives file system access.
- **React UI + UIAgent**: Handles rendering views, routing, and delegating actions to backend agents.
- **TaskManagerAgent**: Core logic for task creation, editing, fuzzy recurring scheduling.
- **ScheduleAgent**: Computes derived views like “due soon” or “missed” tasks.
- **PersistenceAgent**: Uses SQLite or local JSON file to persist state.
- **ModuleLoaderAgent**: Dynamically loads feature modules based on config.
- **NotesAgent** *(optional)*: Handles note-taking and linking to tasks.

=== Data Model

.Task Schema (SQLite)
|===
| Field | Type | Description
| id | UUID | Unique task ID
| title | TEXT | Task title
| notes | TEXT | Rich text or markdown
| tags | TEXT[] | Array of tags
| status | TEXT | open, done, skipped
| created_at | DATETIME | Creation timestamp
| recurrence_rule | TEXT | e.g., "every 3 weeks"
| last_completed_at | DATETIME | Last time it was done
| next_due_date | DATETIME | Computed field
|===

The fuzzy recurrence engine derives the next occurrence based on `last_completed_at + recurrence_rule`. Tasks are only “due” when within a defined attention window.

=== Modularity Model

Modules are registered via a config file (`modules.json`) and loaded into the runtime dynamically. Each module follows a lifecycle interface:

```ts
interface PlannerModule {
  id: string;
  init(ctx: AppContext): void;
  onEvent?(event: PlannerEvent): void;
  render?(): JSX.Element;
}



== Implementation

The implementation proceeds in focused layers: storage foundation, core logic, UI, and finally modular extensions. All components are organized into feature-based folders for clarity and separation.

=== Step 1: Project Bootstrap

- Initialize project with `create-react-app` or Vite + React + Tailwind
- Add Electron main process with custom `main.js`
- Set up SQLite via `better-sqlite3` or `sql.js` for fast, local persistence
- Add global state management (e.g., Zustand or Redux Toolkit)

=== Step 2: Define Core Agents

- Implement `TaskManagerAgent` for task CRUD and recurrence rules
- Implement `ScheduleAgent` to maintain daily/weekly views
- Set up `PersistenceAgent` using SQLite for local disk writes
- Build central `EventBus` and context to connect agents

=== Step 3: Build UI Views

- Dashboard view with “Today”, “Upcoming”, “Overdue”
- Task editor form with support for recurrence rules
- Settings panel for enabling/disabling modules
- Include development-only debug panel to inspect app state

=== Step 4: Module Loader System

- Create `ModuleLoaderAgent` to register and init optional modules
- Define `PlannerModule` interface
- Add sample module: `NotesAgent` (Markdown editor with task linking)

=== Step 5: Packaging

- Bundle app using Electron Builder or Forge
- Package SQLite DB and JSON config as part of app data
- Test across Windows, macOS, and Linux

=== Development Notes

- Use `preload.js` for secure Electron <-> React bridging
- Store all user data under `$APPDATA/planner/` or platform equivalent
- Use a mock API layer initially to isolate UI development from agent logic
