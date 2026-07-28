# Internal reference documents

These documents are **internal engineering references**, not user-facing SDK
documentation. They are derived from the Neucron Console codebase and the
platform API, and they are not published to the docs site.

| Document | What it is |
| --- | --- |
| [`apibusiness-api-reference.md`](apibusiness-api-reference.md) | HTTP-level reference for the business API surface, generated from the Console codebase. |
| [`asset21-api.md`](asset21-api.md) | Deep reference for the Asset21 security-token protocol. |
| [`mcp-flows-sop.md`](mcp-flows-sop.md) | Maps Console UI flows to SDK methods and MCP tool names. `src/services/mcp-flows` implements this. |

## Caveat

These files are **point-in-time snapshots** and are not verified by CI. They can
drift from the live API. When they disagree with `src/`, the source is correct.

User-facing documentation lives in [`docs/`](../) and is mirrored to
<https://timechain.gitbook.io/neucron-javascript-sdk/>.
