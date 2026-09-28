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
  triggered manually (Actions tab → Run workflow) or by commenting
  `/sdlc-development`, `/sdlc-testing`, or `/sdlc-build-deploy` on a PR.

Required repo secrets: `ANTHROPIC_API_KEY`, and for the Confluence/Jira publishing
steps `ATLASSIAN_SITE_URL`, `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`.

The CodeMie "SDLC Workflow" now goes straight from Design (G3) to Documentation
(G8); those three middle gates were removed from it since they run here instead.
