---
name: sdlc-development
description: SDLC gate G4 (Development) — posts merge/run/test completion notes as a PR comment on GitHub. Use when running the Development phase of the Task Tracker Lite SDLC workflow directly against this repo.
---

# SDLC Gate G4 — Development

This replaces the CodeMie "GitHub Repo Operator" assistant step that used to run this
gate inside the CodeMie SDLC Workflow. It now runs directly against
`NeerajKumarEpam/EpamTestRepo` using the `gh` CLI (already authenticated via
`GH_TOKEN`/`GITHUB_TOKEN` in this environment).

## Inputs

- `pr_number` — the pull request to comment on. If not given, use the PR associated
  with the current branch (`gh pr view --json number -q .number`).

## Task

1. Confirm the target PR exists: `gh pr view <pr_number> --json number,title,url`.
2. Post a comment on that PR titled **"Merged – completion notes"** containing:
   - **How to run** (two terminals):
     - Terminal 1: `npm run dev:backend` (from `task-tracker-lite/`)
     - Terminal 2: `npm run dev:frontend` (from `task-tracker-lite/`)
   - **Test command and result**: `npm run test:e2e:report` — state the actual
     pass/fail count from the most recent run (do not fabricate a number; if no
     recent run is available, say so and instruct the reader to run it).
   - **localhost → IPv6 note**: `localhost` can resolve to `::1` on this machine;
     use `http://127.0.0.1:5173` for the frontend instead.
   - Use `gh pr comment <pr_number> --body-file -` (heredoc) or `--body "..."`.
3. Report back: PR URL, comment URL/id, and a one-line summary.

## Output

Always finish by printing this JSON block:

```json
{
  "gate": "G4",
  "approved": true,
  "summary": "...",
  "links": { "pr": "..." }
}
```

Set `approved: false` and explain why if the comment could not be posted (e.g. PR
not found, `gh` not authenticated).
