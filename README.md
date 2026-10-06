# EpamTestRepo
Test repo for AI Courses Practical Tasks

## Author
- Author: Neeraj Kumar

## Maintainers
- Maintainers: Neeraj Kumar

## Business Impact
This project demonstrates a lightweight task-tracking application and delivery workflow that helps teams:

- improve visibility into work progress and priorities;
- reduce manual effort in tracking and updating task status;
- accelerate issue resolution through a more transparent workflow;
- provide a practical foundation for automation and SDLC governance in real-world delivery teams.

## Application Overview
Task Tracker Lite is a minimal task management application used as a working example for an AI-assisted SDLC lifecycle. It enables users to create, edit, filter, search, and delete tasks while tracking status and due dates.

Key capabilities:

- create and update tasks with title, description, status, and due date;
- search tasks by keyword and filter by status;
- sort tasks by creation time or title;
- highlight overdue items when the task remains incomplete;
- persist task data in SQLite through a simple Express API.

### Tech stack
- Frontend: React + Vite
- Backend: Express.js + SQLite
- Data persistence: `task-tracker-lite/backend/data/task_tracker.sqlite`
- End-to-end validation: Playwright

### Local run flow
1. Start the backend:
   ```bash
   cd task-tracker-lite/backend
   npm install
   npm run migrate
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd task-tracker-lite/frontend
   npm install
   npm run dev
   ```
3. Open the app in the browser at `http://localhost:5173`.

The API is served from `http://localhost:3000` and exposes endpoints such as:

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Repository Layout
- `task-tracker-lite/backend/` — Express API and SQLite data layer
- `task-tracker-lite/frontend/` — React UI
- `task-tracker-lite/e2e/` — Playwright end-to-end test suite and HTML reports
- `.github/workflows/` — SDLC workflow automation for validation and deployment gates

## E2E Test Coverage
The e2e suite validates the app from a user perspective and ensures the core task flows behave correctly.

### Included scenarios
- `task-tracker-lite/e2e/tests/tasks.spec.js`
  - validation for required title;
  - task creation and search behavior;
  - filtering by task status;
  - visual highlighting for overdue tasks.
- `task-tracker-lite/e2e/tests/curd.spec.js`
  - create task;
  - edit task;
  - delete task.

These tests exercise the real browser UI with Playwright and confirm that the main workflows work across interactions.

### Playwright commands
```bash
cd task-tracker-lite/e2e
npm install
npx playwright test
npx playwright test --reporter=html
```

## Reporting
The project uses Playwright's HTML reporter to capture execution results in a readable format.

- HTML report output is generated under `task-tracker-lite/e2e/playwright-report/`
- Report file: `task-tracker-lite/e2e/playwright-report/index.html`
- The reporter configuration is defined in `playwright.config.ts` and is set to `html` by default

This makes it easy to review pass/fail details, user-flow validation, and troubleshooting artifacts after each run.

## Code Coverage Goal
The project aims to maintain strong confidence in the task management workflows through automated validation, with a target of at least 80% statement coverage for the core backend and UI logic covered by the main task flows.

Coverage focus areas:

- task creation and validation;
- task updates and deletion;
- search and filtering logic;
- overdue state detection and highlighting;
- API error handling for invalid or missing records.

This target is intentionally aligned with the real user journeys validated by Playwright tests so that regressions in task handling are caught early before release.

## Security Scanning
Security scanning should be treated as a standard part of release readiness for this application. The project uses a lightweight task-management stack, but the same principles apply: validate dependencies, review exposed endpoints, and confirm that user input is handled safely.

Recommended checks:

- scan npm dependencies for known vulnerabilities;
- verify no sensitive data is committed to the repository or SQLite data files;
- validate API request payloads before database writes;
- review frontend form handling for unsafe input and improper trust boundaries;
- confirm the backend enforces expected validation for task creation and updates.

This is especially important for any future expansion of the application to authentication, user roles, or external integrations.

## Observation / Logging
Operational visibility is important for both local development and release validation. The application includes a simple health endpoint and basic API-level behavior that can be monitored during testing and troubleshooting.

Key observation points:

- backend health endpoint: `GET /api/health`;
- task API responses for create, update, delete, and list actions;
- validation failures such as missing title or invalid task ID;
- database and runtime issues that surface through Express error responses;
- Playwright execution logs and HTML reports for end-to-end validation outcomes.

Recommended logging practices:

- capture startup and shutdown messages for the backend service;
- log task mutations and validation failures during development;
- keep browser test reports in the Playwright output folder for root-cause analysis;
- review failed E2E runs to confirm whether issues are UI, API, or data-related.

This ensures that defects are easier to diagnose and that quality signals remain visible throughout the SDLC.

## SDLC gates run directly by Claude

The Development (G4), Testing (G6), and Build_And_Deploy (G7) gates of the Task
Tracker Lite SDLC workflow run directly in this repo instead of via CodeMie:

- `.claude/skills/sdlc-development`, `sdlc-testing`, `sdlc-build-deploy` — the gate
  instructions, runnable interactively from Claude Code (`/sdlc-development`, etc.).
- `.github/workflows/sdlc-development.yml`, `sdlc-testing.yml`,
  `sdlc-build-deploy.yml` — run the same skills in CI via
  [`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action),
  triggered manually (Actions tab → Run workflow), by commenting
  `/sdlc-development`, `/sdlc-testing`, or `/sdlc-build-deploy` on a PR, or by the
  CodeMie "SDLC Workflow" dispatching Development directly after Design (G3) is
  approved.

Required repo secrets: `ANTHROPIC_API_KEY`, and for the Confluence/Jira publishing
steps `ATLASSIAN_SITE_URL`, `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`.

The CodeMie "SDLC Workflow" now goes straight from Design (G3) to Documentation
(G8); those three middle gates were removed from it since they run here instead.

### Gate chaining (G4 → G6 → G7)

Each gate's skill writes its `gate-result.json` output to the runner's working
directory. The workflow fails the job if `approved` isn't `true`, so once
Development (G4) is triggered — manually, via PR comment, or dispatched by the
Design gate in CodeMie — Testing (G6) and Build_And_Deploy (G7) run automatically
in sequence via `workflow_run`, each one only firing if the previous gate passed.
The PR number is handed forward between gates as an uploaded `pr-context`
artifact. Documentation (G8) in CodeMie still requires a manual resume once
Build_And_Deploy completes — there is currently no scriptable way to resume a
paused CodeMie workflow run from outside its own UI/session.
