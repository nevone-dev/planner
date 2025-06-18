# Planner

This is a minimal prototype of a modular planner. The UI is built with React and the app is wrapped in an Electron shell. Tasks are persisted locally using `localStorage`.

## Development

```
npm install
npm run dev
```

In another terminal, run:

```
npm start
```

The project uses a simple in-memory agent system inspired by `agents.md`.

## Features

- Add, edit and delete tasks
- Tasks are stored locally so they persist across restarts
