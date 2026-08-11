
# Task Tracker Lite

Minimal Task Tracker application used to demonstrate an AI-driven SDLC workflow (analysis -> plan -> design -> dev -> test -> deploy -> docs) with human-in-the-loop gates.

## Prerequisites
- Node.js 18+ (recommended)

## Run locally

### 1) Backend
```bash
cd task-tracker-lite/backend
npm install
npm run migrate
npm run dev
```

Backend runs at: http://localhost:3000

### 2) Frontend
```bash
cd task-tracker-lite/frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Notes
- SQLite database file created at: `task-tracker-lite/backend/data/task_tracker.sqlite`
- API endpoints are under `/api/*`
