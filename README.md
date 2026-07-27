# Neucron TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@timechainlabs/neucron-ts-sdk.svg)](https://www.npmjs.com/package/@timechainlabs/neucron-ts-sdk)
[![CI](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Type-safe TypeScript SDK for the [Neucron](https://neucron.io) platform: wallets, payments, paymail, asset issuance (Asset21 security tokens, utility tokens), invoicing, payouts, business and member management, RBAC, data integrity, and Sign in with Neucron OAuth.

Works in Node.js (>= 20.19), modern browsers, and React Native. Ships ESM and CJS builds with full type declarations.

## Installation

```bash
npm install @timechainlabs/neucron-ts-sdk
# or
pnpm add @timechainlabs/neucron-ts-sdk
# or
bun add @timechainlabs/neucron-ts-sdk
```

## Quickstart

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK();

// Authenticate
await sdk.auth.login({ email: 'you@example.com', password: '...' });

// List wallets
const wallets = await sdk.wallet.walletList();
console.log(wallets.data);

// Pay to a paymail
await sdk.pay.payWithPaymail({
  assetName: 'BSV',
  transfer_destinations: [{ paymail: 'someone@neucron.me', amount: 1000 }],
});
```

Already have a token (e.g. server-side)?

```typescript
const sdk = new NeucronSDK({ authToken: process.env.NEUCRON_TOKEN });
```

## Environments

| Environment | Base URL | Config |
| --- | --- | --- |
| Production | `https://api.neucron.io/v1` | default |
| Sandbox | `https://dev.neucron.io/v1` | `new NeucronSDK({ sandbox: true })` |
| Self-hosted | your URL incl. `/v1` | `new NeucronSDK({ baseUrl: 'https://api.example.com/v1' })` |

## Configuration

```typescript
const sdk = new NeucronSDK({
  authToken: '...',      // skip login when you already hold a token
  sandbox: true,         // use the sandbox API
  baseUrl: '...',        // custom API base URL (overrides sandbox)
  timeoutMs: 15_000,     // per-request timeout (default 30s)
  maxRetries: 2,         // automatic retries for idempotent requests (default 2)
  oauth: {               // defaults for Sign in with Neucron
    clientId: '...',
    redirectUri: 'https://yourapp.com/callback',
  },
});
```

### Business context

Neucron scopes most resources to a business. Pass `businessId` in method options and the SDK sends the `X-Neucron-Business-ID` header:

```typescript
const members = await sdk.members.getMembers({ businessId: 'biz_...' });
```

## Services

| Accessor | Purpose |
| --- | --- |
| `sdk.auth` | Signup, login, profile, password |
| `sdk.oauth` | Sign in with Neucron (authorization code + PKCE) |
| `sdk.wallet` | Wallets, addresses, transactions, asset sync |
| `sdk.pay` | Send BSV by address, email, or paymail |
| `sdk.paymail` | Paymail alias management |
| `sdk.assets` | Asset ledger, balances, transfers |
| `sdk.asset21` | Security token lifecycle (register, deploy, govern) |
| `sdk.utility` | Utility token register, mint, redeem |
| `sdk.assetSwap` | Cross-asset swaps and rates |
| `sdk.business` | Business profiles and listing |
| `sdk.members` | Business members, invites, role assignment |
| `sdk.rbac` | Roles and permissions |
| `sdk.apps` | Developer apps and secrets |
| `sdk.blob` | Document and image upload |
| `sdk.invoice` | Invoices and collections |
| `sdk.customer` / `sdk.vendor` | Counterparty management |
| `sdk.bill` / `sdk.payout` / `sdk.billing` | Bills, payouts, billing |
| `sdk.dataIntegrity` | On-chain file and text inscriptions |
| `sdk.flows` | High-level MCP flow orchestrations |

Full per-method reference lives in [`docs/`](./docs/README.md).

## Error handling

Every SDK error is a `NeucronError` with a machine-readable `type`:

```typescript
import { isNeucronError } from '@timechainlabs/neucron-ts-sdk';

try {
  await sdk.pay.payWithPaymail({ ... });
} catch (err) {
  if (isNeucronError(err)) {
    err.type;        // 'network' | 'validation' | 'internal'
    err.status;      // HTTP status (network errors)
    err.data;        // raw API error body
    err.request;     // { method, url } of the failed call
    err.issues;      // zod issues (validation errors)
    err.isAuthError;   // 401/403
    err.isRateLimit;   // 429
    err.isRetryable;   // transient failure worth retrying
  }
}
```

Request/response payloads are validated with [Zod](https://zod.dev). Validation failures throw before any network call is made.

## Reliability

- Every request has a timeout (default 30s, configurable via `timeoutMs`).
- Idempotent (GET) requests are retried automatically on 408/429/5xx and network errors with exponential backoff, honoring `Retry-After`. Mutating requests are never retried automatically, so a payment is never sent twice.
- The SDK identifies itself with an `X-Neucron-SDK: neucron-ts-sdk/<version>` header.

## Schemas subpath

Zod schemas for all request/response shapes are exported separately so you can reuse them for your own validation:

```typescript
import { walletSchemas, paySchemas } from '@timechainlabs/neucron-ts-sdk/schemas';
```

## Development

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test:unit   # vitest unit suite (no network)
npm run build       # tsdown -> dist/ (ESM + CJS + d.ts)
```

Integration tests hit the live API and need credentials; see [`tests/README.md`](./tests/README.md).

## Versioning

This package follows [semver](https://semver.org). Breaking API changes only land in major versions and are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE)
