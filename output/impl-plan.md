# Implementation Plan: Agentic SDLC Documentation Workflow

## Status

Plan proposed. Human approval is required before development begins.

## Prioritized tasks

| ID | Priority | Task | Dependencies | Evidence / completion criteria | Status |
| --- | --- | --- | --- | --- | --- |
| IP-1 | P0 | Capture COD-15 requirements and approval gates. | None | User story source and acceptance criteria recorded; product approval status explicit. | Done; human approval pending |
| IP-2 | P0 | Define proposed component architecture and design-review decisions. | IP-1 | Architecture and review artifacts exist; material decisions and approval status are explicit. | Done; human approval pending |
| IP-3 | P1 | Add project Copilot instructions, output-specific instructions, stage agents, and orchestrator. | IP-2 | All agents are discoverable under `.github/agents/`; roles and permissions are clear. | Done |
| IP-4 | P1 | Add the `agentic-sdlc` skill and session-start context hook. | IP-2 | Skill and hook are in supported paths; hook emits valid JSON without side effects. | Done |
| IP-5 | P1 | Create and maintain lifecycle Markdown deliverables under `output/`. | IP-1, IP-2 | Artifact index and required phase documents are present and traceable. | Done |
| IP-6 | P1 | Validate customization frontmatter, hook JSON/output, links, and required PR sections. | IP-3, IP-4, IP-5 | Focused validation completes; observed output is captured in verification. | Done |
| IP-7 | P2 | Review final diff and record code/config review findings. | IP-6 | `output/code-review.md` contains checklist and findings. | Done; no blocking findings |
| IP-8 | P2 | Prepare changelog and PR description with test evidence. | IP-6, IP-7 | Both artifacts have required sections; no claim is unsupported. | Done |
| IP-9 | P2 | Create PR as requested in the capstone workflow. | IP-8 | PR URL and CI evidence recorded. | Blocked: GitHub CLI is unauthenticated and the configured PR token lacks permission (403) |

## Dependency outline

```text
IP-1 -> IP-2 -> (IP-3, IP-4, IP-5) -> IP-6 -> IP-7 -> IP-8 -> IP-9
```

IP-3, IP-4, and IP-5 are independent after IP-2. The user requested completion
of the capstone PR step, but it is blocked until GitHub write authorization is
available.

## Scope boundaries

- No Task Tracker Lite runtime changes are planned by COD-15.
- Do not publish to Jira/Confluence or merge automatically.
- If the user requests additional application behavior, refine the story and
  obtain approval before extending this plan.
