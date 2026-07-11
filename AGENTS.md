<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **neucron-ts-sdk-v2** (1414 symbols, 4327 relationships, 117 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "develop"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/neucron-ts-sdk-v2/context` | Codebase overview, check index freshness |
| `gitnexus://repo/neucron-ts-sdk-v2/clusters` | All functional areas |
| `gitnexus://repo/neucron-ts-sdk-v2/processes` | All execution flows |
| `gitnexus://repo/neucron-ts-sdk-v2/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Billing area (65 symbols) | `.claude/skills/generated/billing/SKILL.md` |
| Work in the Apps area (62 symbols) | `.claude/skills/generated/apps/SKILL.md` |
| Work in the Invoice area (61 symbols) | `.claude/skills/generated/invoice/SKILL.md` |
| Work in the Asset21 area (21 symbols) | `.claude/skills/generated/asset21/SKILL.md` |
| Work in the Assets area (9 symbols) | `.claude/skills/generated/assets/SKILL.md` |
| Work in the Authentication area (9 symbols) | `.claude/skills/generated/authentication/SKILL.md` |
| Work in the Pay area (4 symbols) | `.claude/skills/generated/pay/SKILL.md` |
| Work in the Business area (3 symbols) | `.claude/skills/generated/business/SKILL.md` |

<!-- gitnexus:end -->
