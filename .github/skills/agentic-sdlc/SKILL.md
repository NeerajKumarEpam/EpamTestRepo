---
name: agentic-sdlc
description: "Run the repository's end-to-end Agentic SDLC for Automated Documentation Sync. Use when turning a Jira, Confluence, or local user story into approved requirements, architecture, design review, implementation plan, code, verification evidence, changelog, and PR description."
argument-hint: "Jira issue key, Confluence page URL/title, or local story document path"
user-invocable: true
---

# Agentic SDLC

Use this workflow to carry a user story from source discovery through a
review-ready pull request. Invoke the `agentic-sdlc` agent to coordinate the
specialist agents.

## Inputs and artifacts

- Required input: an explicit Jira issue, Confluence page, or readable local
  story/document. The capstone seed is Jira `COD-15`, under epic `COD-1`.
- Store lifecycle documents in `output/`; use the artifact index in
  `output/README.md`.
- Custom agents live in `.github/agents/`; instructions and hooks live in their
  supported `.github/` folders.

## Procedure

1. **Requirements:** retrieve the source story; ask about material gaps. Record
   confirmed functional/non-functional requirements, source links, assumptions,
   out-of-scope items, open questions, and traceability IDs in
   `output/requirements.md`. Wait for user approval.
2. **Architecture:** inspect the repository and document components,
   responsibilities, technology rationale, data/control flow, and diagrams in
   `output/architecture.md`. Wait for user approval.
3. **Design review:** assess the architecture for coverage, security, failure
   handling, testability, and operational risks. Record findings and decisions
   in `output/design-review.md`; obtain human agreement on material decisions.
4. **Implementation planning:** break approved design into prioritized,
   dependency-ordered tasks with blocked prerequisites in
   `output/impl-plan.md`. Wait for user approval before coding.
5. **Implementation:** implement only approved plan items; preserve existing
   behavior and add targeted tests. Report actual checks.
6. **Review:** run the read-only structured code review and document results
   in `output/code-review.md`.
7. **Verification:** run appropriate tests and document actual outputs plus
   artifact-content checks in `output/verification.md`. For this workflow's
   configuration and document checks, run
   `node .github/scripts/validate-sdlc-customizations.js`.
8. **PR preparation:** update `output/changelog.md` and prepare
   `output/pr-description.md` with Summary, Changes Made, Test Evidence,
   Known Limitations, and Reviewer Checklist. Create or merge a PR only when
   the user explicitly requests it.

## Safety and quality

- A specialist agent's output is a proposal, not human approval.
- Do not guess story content or acceptance criteria. If a source is inaccessible,
  ask for its content or a local copy.
- Do not write to Jira or Confluence, deploy, commit, push, or merge unless
  explicitly requested.
- Keep traceability from story to requirements, design, plan, code, tests, and
  PR description.
- Report failed commands and external-tool errors clearly; never imply success
  when evidence is missing.
