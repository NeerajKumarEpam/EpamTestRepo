---
description: "Use when creating or updating SDLC lifecycle artifacts in output/, including requirements, architecture, review, planning, verification, changelog, and pull request documentation."
name: "SDLC Artifact Guidelines"
applyTo: "output/**/*.md"
---

# SDLC Artifact Guidelines

- Keep lifecycle deliverables in `output/` and use the existing artifact names
  referenced by `output/README.md`.
- Identify the source Jira issue, Confluence page, or local document with a
  link or repository-relative path.
- Distinguish confirmed requirements from assumptions, decisions, and open
  questions. Do not turn an assumption into an acceptance criterion.
- Keep phase status and approval status explicit. Agent analysis is not human
  approval.
- Carry requirement identifiers into design, implementation tasks, and test
  evidence where practical.
- Report only observed test results; include command, counts, and failures.
- PR descriptions must include Summary, Changes Made, Test Evidence, Known
  Limitations, and Reviewer Checklist.
