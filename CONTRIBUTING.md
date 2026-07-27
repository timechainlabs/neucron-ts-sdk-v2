# Contributing

## Prerequisites

- Node.js >= 20.19 (Node 22 recommended; the build tooling requires
  `Promise.withResolvers`)
- npm (the repo ships `package-lock.json` and CI runs `npm ci`)

## Setup

```bash
git clone https://github.com/timechainlabs/neucron-ts-sdk-v2.git
cd neucron-ts-sdk-v2
npm ci
```

## Development loop

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run test:unit    # fast, no network
npm run build        # tsdown -> dist/
```

All four must pass before a PR is mergeable; CI enforces them on every push
and pull request to `develop`.

Integration tests (`npm run test:integration`) hit the live API and need the
environment variables listed in `tests/README.md`. They run in CI with
repository secrets and are currently non-blocking.

## Project layout

```
src/
  config.ts               # Config type, base URLs
  neucron-sdk.ts          # NeucronSDK class wiring all services
  services/<name>/        # one directory per API domain
    index.ts              #   service class (methods)
    schema.ts             #   zod schemas (request + response)
    types.ts              #   z.infer type exports
    validator.ts          #   thin class calling schemas
  utils/
    http/                 # HttpClient (timeouts, retries), header builder
    errors/               # NeucronError + handleError normalization
    routes/               # single Routes map of API paths
```

When adding a service method:

1. Add the route to `src/utils/routes/index.ts`.
2. Define request/response schemas in `schema.ts`, infer types in `types.ts`,
   expose them through `validator.ts`.
3. Implement the method in `index.ts` following the existing pattern
   (`auth.validate()` → validate input → build headers → HTTP call → validate
   response → return).
4. Add unit tests mirroring an existing `tests/unit/<service>.test.ts`.
5. Update the matching page in `docs/`.

## Conventions

- Conventional commits (`feat:`, `fix:`, `refactor!:` etc.). Breaking changes
  need a `BREAKING CHANGE:` footer and a CHANGELOG entry.
- `businessId` is the scoping identifier across the API; it maps to the
  `X-Neucron-Business-ID` header via `buildAuthHeaders`.
- Never retry mutating requests in transport code.
- Public API changes require an entry in `CHANGELOG.md`.

## Releasing

1. Bump `version` in `package.json` and `SDK_VERSION` in
   `src/utils/version.ts` (a unit test enforces they match).
2. Move `Unreleased` CHANGELOG entries under the new version heading.
3. Create a GitHub release with tag `v<version>`. The publish workflow
   verifies the tag matches `package.json`, runs checks, builds, and publishes
   to npm with provenance.
