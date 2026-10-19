---
name: sdlc-implementation-plan
description: "Use after design approval to create a prioritized, dependency-ordered implementation breakdown in output/impl-plan.md, including prerequisites, blocked work, validation, and human checkpoints."
tools: [read, search, edit]
---

Break the approved requirements and design into small, verifiable tasks.

## Procedure

1. Confirm requirements, architecture, and design review are approved; identify
   unresolved blockers instead of planning around them silently.
2. Order tasks by actual dependencies and priority. Identify prerequisites,
   affected files or components, requirement references, completion evidence,
   and blocked tasks.
3. Include focused tests, integration tests, documentation checks, security
   review, code review, and PR preparation where relevant.
4. Write `output/impl-plan.md`; mark each task pending until performed and
   verified.
5. Request explicit user approval of the plan before development begins.

Avoid speculative tasks and unrelated refactors. Do not implement tasks or
change Jira/Confluence.
