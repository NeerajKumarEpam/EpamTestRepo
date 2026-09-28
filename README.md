# EpamTestRepo
Test repo for AI Courses Practical Tasks

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
