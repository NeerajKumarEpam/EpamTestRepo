---
name: confluence-page-update
description: Append a new section to a Confluence page over the REST API without clobbering existing content, using ATLASSIAN_SITE_URL/ATLASSIAN_EMAIL/ATLASSIAN_API_TOKEN. Use whenever an sdlc-* gate agent needs to publish gate evidence (test results, deployment verification, etc.) to Confluence.
---

# Confluence page update (append-only)

Used by the `sdlc-testing` and `sdlc-build-deploy` agents to publish gate
evidence to Confluence without overwriting what's already on the page.

Requires these env vars (already set as GitHub Actions secrets in CI):
`ATLASSIAN_SITE_URL` (e.g. `https://neerajkumarepam.atlassian.net`),
`ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`. Never print their values or the
`Authorization` header.

## Steps

1. Fetch current content and version:
   `GET {ATLASSIAN_SITE_URL}/wiki/rest/api/content/<page_id>?expand=body.storage,version`
2. Append your new section to the storage-format HTML — do not remove or
   rewrite existing content, only add a new subsection at the end.
3. Push it back with the version bumped by exactly the old value + 1:
   `PUT {ATLASSIAN_SITE_URL}/wiki/rest/api/content/<page_id>` with body
   `{"version": {"number": <old + 1>}, "title": "<unchanged>", "type": "page", "body": {"storage": {"value": "<new_body>", "representation": "storage"}}}`
4. Auth header on both calls:
   `Authorization: Basic $(printf '%s:%s' "$ATLASSIAN_EMAIL" "$ATLASSIAN_API_TOKEN" | base64)`

Fail the calling agent's gate (`approved: false` in the sdlc-gate-result
output) if either the GET or PUT call fails — do not silently skip the
Confluence update.
