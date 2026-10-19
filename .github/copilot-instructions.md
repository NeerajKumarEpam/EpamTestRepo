# GitHub Copilot Instructions

- Follow the existing Task Tracker Lite patterns and keep changes limited to
  the approved user story and implementation plan.
- Use `output/` for SDLC deliverables. Keep Copilot customization files in
  their supported `.github/` locations.
- Begin requirements work from an explicitly identified Jira issue, Confluence
  page, or local document. Cite the source and ask the user about material
  gaps; do not invent acceptance criteria or imply that an assumption is
  approved.
- Preserve traceability from source story through requirements, design,
  implementation, tests, and PR description.
- Stop for explicit human approval before architecture/design is treated as
  approved, before implementation begins, and before creating or merging a PR.
- Never claim tests, builds, external updates, approvals, or deployments
  succeeded unless they actually did. Include the exact command and observed
  result in `output/verification.md`.
- Do not publish to Jira or Confluence, create external resources, commit, push,
  or merge unless the user explicitly requests that action.
- Never expose credentials, tokens, authorization headers, or private
  environment values in generated files or tool output.
- Keep lifecycle documents factual and concise. Record open questions,
  limitations, risks, and rejected alternatives where applicable.
