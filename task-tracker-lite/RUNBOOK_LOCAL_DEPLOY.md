
# Local Deployment Runbook – Task Tracker Lite

## Prerequisites
- Node.js 18+ installed
- Git installed

## Ports
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## One-time setup
From repo root:

```bash
cd task-tracker-lite
npm run install:all
npm run migrate
```

## Start application (two terminals)

### Terminal 1 – Backend
```bash
cd task-tracker-lite
npm run dev:backend
```
Expected log:
- `Backend listening on http://localhost:3000`

### Terminal 2 – Frontend
```bash
cd task-tracker-lite
npm run dev:frontend
```
Expected:
- Vite shows URL `http://localhost:5173`

## Verification checklist
1. Open http://localhost:5173
2. Create task with Title = `Smoke Task`
3. Confirm task appears in list
4. Edit task title and save
5. Delete task and confirm removal

## Run automated tests (Playwright)
Ensure FE and BE are running, then:

```bash
cd task-tracker-lite
npm run test:e2e:report
```
Outputs:
- `task-tracker-lite/e2e/playwright-report/`
- `task-tracker-lite/e2e/test-results/junit.xml`

## Troubleshooting
- If FE cannot reach BE: confirm backend running on :3000 and Vite proxy is configured.
- If sqlite errors: rerun `npm run migrate` from `task-tracker-lite`.
