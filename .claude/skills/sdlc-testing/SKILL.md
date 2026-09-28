---
name: sdlc-testing
description: SDLC gate G6 (Testing) — runs the Playwright e2e suite and publishes results to the Confluence Testing page and a Jira comment on COD-1. Use when running the Testing phase of the Task Tracker Lite SDLC workflow directly against this repo.
---

# SDLC Gate G6 — Testing

This replaces the CodeMie "QA/Test Runner Assistant" step that used to run this gate
inside the CodeMie SDLC Workflow. It now runs directly in this repo/CI and publishes
straight to Confluence and Jira over the Atlassian REST API using these environment
variables (already set as GitHub Actions secrets when run in CI):

- `ATLASSIAN_SITE_URL` — e.g. `https://neerajkumarepam.atlassian.net`
- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`

Never print these values or the `Authorization` header.

## References

- Testing page (Confluence page id `2621443`):
  https://neerajkumarepam.atlassian.net/wiki/spaces/Epam/pages/2621443/Task+Tracker+Lite+Testing+Gherkin+Playwright+Evidence
- Jira epic: `COD-1` — https://neerajkumarepam.atlassian.net/browse/COD-1

## Task

1. **Run the suite** from `task-tracker-lite/`:
   ```
   npm run test:e2e:report
   ```
   Capture the real pass/fail/skip counts from Playwright's output (do not
   fabricate results). Note the environment quirk: use `http://127.0.0.1:5173`
   instead of `localhost` (IPv6 `::1` resolution issue).

2. **Update Confluence** — append a "Latest Test Run" section to the Testing page
   (do not overwrite existing content):
   - `GET {ATLASSIAN_SITE_URL}/wiki/rest/api/content/2621443?expand=body.storage,version`
     to fetch current storage-format body and version number.
   - Append a new subsection with: date, command run, pass/fail counts, and a note
     that the HTML report lives at `task-tracker-lite/e2e/playwright-report/`.
   - `PUT {ATLASSIAN_SITE_URL}/wiki/rest/api/content/2621443` with
     `"version": {"number": <old + 1>}` and the merged storage-format body.
   - Auth header: `Authorization: Basic $(printf '%s:%s' "$ATLASSIAN_EMAIL" "$ATLASSIAN_API_TOKEN" | base64)`.

3. **Update Jira** — add a comment to `COD-1` linking the testing page and stating
   PASS/FAIL:
   - `POST {ATLASSIAN_SITE_URL}/rest/api/3/issue/COD-1/comment` with an ADF or
     plain-text body per the API (`{"body": "..."}` for the simple text form is not
     valid for API v3 — use the Atlassian Document Format `body.content` structure,
     or fall back to `POST /rest/api/2/issue/COD-1/comment` with `{"body": "..."}`
     if v3/ADF is unavailable).

## Output

Always finish by printing this JSON block:

```json
{
  "gate": "G6",
  "approved": true,
  "summary": "...",
  "links": { "testing": "...", "jira": "..." }
}
```

Set `approved: false` (and do not mark the gate green) if the test run itself
failed, or if publishing to Confluence/Jira failed — explain which step failed.
