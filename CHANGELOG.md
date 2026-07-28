# Changelog
## [2.1.0] - 2026-07-28

### Changed

- **Fintech rebrand**: Updated package description, keywords, README, and
  documentation to position Neucron as wallet infrastructure for fintechs.
- Package description now emphasizes MPC wallets, stablecoins, mass payouts,
  invoicing, subscriptions, KYC/KYB, and policy controls.
- README rewritten with clear value proposition, use cases, and getting started flow.
- Documentation updated with fintech-focused positioning.
- GitHub repo description and topics updated.

### Improved

- Consolidated branches (deleted stale feature/dependabot branches).
- Cleaned up tooling configs (.gitignore, .prettierignore, eslint.config.mjs).
- Moved internal API docs to `docs/internal/`.
- GitHub Actions updated to v7.


All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-27

### Breaking

- Removed team functionality. The API deleted `/v1/team/*` endpoints; businesses
  are the scoping unit. `sdk.team`, team types, and `teamSchemas` exports are
  gone. `teamId` options and the `X-Neucron-Team-ID` header were removed from
  asset21, payout, members, and MCP flows. Use `businessId` instead.

### Added

- Request timeouts (default 30s, configurable with `timeoutMs`).
- Automatic retries with exponential backoff for idempotent (GET) requests on
  408/429/5xx and network errors, honoring `Retry-After`. Configurable with
  `maxRetries`. Mutating requests are never retried.
- `isNeucronError()` type guard and `NeucronError.isAuthError` /
  `.isRateLimit` / `.isRetryable` helpers.
- `NeucronError.request` carries the method and URL of the failed call.
- Timeouts and connection failures now surface as `NeucronError` with
  `type: 'network'` instead of raw Axios errors.
- Named `NeucronSDK` export alongside the default export.
- `X-Neucron-SDK` identification header on every request.
- `engines.node >= 20.19.0` declared in package.json.

### Fixed

- CI: TypeScript 6 + `@types/node` 26 resolution of `node:` imports
  (`types: ["node"]` in tsconfig).
- Unit tests: Vitest 4-compatible constructible mocks (202 tests were failing).
- Build: tsdown output filenames now match the package `exports` map; `npm
publish` builds `dist/` via `prepublishOnly` (previous releases shipped from
  a stale or empty `dist`).
- Members list schema: `permissions` is optional, matching the live API.
- Internal file rename: `nuecron-sdk.ts` → `neucron-sdk.ts`.

## [1.1.2] - 2026-07-24

Last release before this changelog was introduced.
