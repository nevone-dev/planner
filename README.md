# Planner

This is a minimal prototype of a modular planner. The UI is built with React and the app is wrapped in an Electron shell. Tasks are persisted in a `db.json` file stored in the project root.

## Development

```
npm install
npm run dev
```

In another terminal, start Electron and point it at the dev server:

```
npm run electron-dev
```

If you prefer to launch without the dev server, first build the project:

```
npm run build
npm start
```

The project uses a simple in-memory agent system inspired by `agents.md`.

## Features

- Add, edit and delete tasks
- Tasks are stored locally so they persist across restarts
- Tasks support fuzzy priority buckets and altitude levels
- Board view groups tasks by priority with inline editing
