---
name: sdlc-build-deploy
description: SDLC gate G7 (Build_And_Deploy) — verifies the local build/deploy steps and appends a "Deployment Verified" section to the Confluence Build page. Use when running the Build/Deploy phase of the Task Tracker Lite SDLC workflow directly against this repo.
---

# SDLC Gate G7 — Build_And_Deploy

This replaces the CodeMie "Confluence Space Administrator" step that used to run this
gate inside the CodeMie SDLC Workflow. It now runs directly in this repo/CI and
publishes straight to Confluence over the Atlassian REST API using these environment
variables (already set as GitHub Actions secrets when run in CI):

- `ATLASSIAN_SITE_URL` — e.g. `https://neerajkumarepam.atlassian.net`
- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`

Never print these values or the `Authorization` header.

## Reference

Build page (Confluence page id `2555906`):
https://neerajkumarepam.atlassian.net/wiki/spaces/Epam/pages/2555906/Task+Tracker+Lite+Build+Local+Deployment

## Task

1. **Verify the build/deploy commands succeed**, from `task-tracker-lite/`:
   - `npm run install:all`
   - `npm run migrate`
   - `npm run build:frontend` — confirm it produces `task-tracker-lite/frontend/dist/`.
   - Do **not** actually start `dev:backend`/`dev:frontend` as long-running
     processes in CI; instead confirm the scripts exist and briefly start/stop them
     (or just confirm `node src/server.js` / `vite` entrypoints resolve) to verify
     they are runnable.

2. **Build a verification checklist**: install:all ✅/❌, migrate ✅/❌,
   backend dev entrypoint runnable ✅/❌, frontend dev entrypoint runnable ✅/❌,
   `frontend/dist` artifact present ✅/❌ (list files/size).

3. **Update Confluence** — append a "Deployment Verified" section to the Build page
   (do not overwrite existing content):
   - `GET {ATLASSIAN_SITE_URL}/wiki/rest/api/content/2555906?expand=body.storage,version`
   - Append a new subsection with the checklist above, the commands run, and a note
     that the artifact is `task-tracker-lite/frontend/dist`.
   - `PUT {ATLASSIAN_SITE_URL}/wiki/rest/api/content/2555906` with
     `"version": {"number": <old + 1>}` and the merged storage-format body.
   - Auth header: `Authorization: Basic $(printf '%s:%s' "$ATLASSIAN_EMAIL" "$ATLASSIAN_API_TOKEN" | base64)`.

## Output

Always finish by printing this JSON block, and also write the same JSON to
`gate-result.json` in the current working directory:

```json
{
  "gate": "G7",
  "approved": true,
  "summary": "...",
  "links": { "build": "..." }
}
```

Set `approved: false` if any build/deploy command failed or the Confluence update
failed — explain which step failed.
