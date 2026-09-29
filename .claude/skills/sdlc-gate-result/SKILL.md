---
name: sdlc-gate-result
description: Shared output contract for the SDLC gate agents (sdlc-development, sdlc-testing, sdlc-build-deploy) — writes gate-result.json and prints the JSON block CI reads to decide whether to chain into the next gate. Use whenever one of those agents finishes its task.
---

# SDLC gate result contract

Every SDLC gate agent (`sdlc-development` = G4, `sdlc-testing` = G6,
`sdlc-build-deploy` = G7) must finish by:

1. Writing this JSON to `gate-result.json` in the current working directory —
   CI's "Enforce gate result" step reads this file to decide whether to chain
   into the next gate.
2. Printing the exact same JSON block as the last thing in the response.

```json
{
  "gate": "<G4|G6|G7>",
  "approved": <true|false>,
  "summary": "...",
  "links": { }
}
```

- `gate` — the id the calling agent owns (G4/G6/G7). Never change it.
- `approved` — `true` only if every step in the calling agent's task actually
  succeeded. `false` otherwise — never fabricate a pass.
- `summary` — one or two plain-text sentences.
- `links` — only the keys relevant to that gate (e.g. `pr`, `testing`, `jira`,
  `build`), as specified by the calling agent.

If `gate-result.json` is missing, CI treats the gate as failed and blocks
downstream gates — so always write the file, even on failure, with
`approved: false` and the reason in `summary`.
