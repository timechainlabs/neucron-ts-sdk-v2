# Neucron TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@timechainlabs/neucron-ts-sdk.svg)](https://www.npmjs.com/package/@timechainlabs/neucron-ts-sdk)
[![CI](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Wallet infrastructure for fintechs.** Build stablecoin payments, payouts, invoicing, and subscriptions on 50+ blockchain rails with one API.

[Sign up at console.neucron.io →](https://console.neucron.io)

## Why Neucron

Neucron is the go-to wallet infrastructure platform for fintechs building on blockchain rails. One SDK gives you:

- **MPC Wallets** — Non-custodial or custodial, with threshold signing and key sharding
- **Smart Accounts** — Paymaster support, gas sponsorship, programmable transaction rules
- **Stablecoin Payments** — USDC, USDT, and 450+ assets across EVM, Tron, Polygon, and more
- **Mass Payouts** — Batch transfers with approval workflows and policy controls
- **Invoicing & Billing** — Create invoices, collect payments, usage-based billing on stablecoins
- **Subscriptions** — Enable stablecoin subscriptions for your customers
- **Privacy** — Unique one-time addresses for each transaction
- **Compliance** — Built-in KYC/KYB tiers, address sanction checks, RBAC
- **Agentic Wallets** — Server wallets with fine-grained policy controls for AI agents
- **Security Tokens** — Issue, deploy, and govern regulated tokenized assets (Asset21)

Works in Node.js (>= 20.19), browsers, and React Native. Ships ESM + CJS with full TypeScript declarations.

## Installation

```bash
npm install @timechainlabs/neucron-ts-sdk
```

## Quickstart

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK();

// Authenticate
await sdk.auth.login({ email: 'you@example.com', password: '...' });

// Create a wallet
const wallet = await sdk.wallet.createWallet({ walletName: 'Treasury' });

// Send USDC
await sdk.pay.payWithPaymail({
  assetName: 'USDC',
  transfer_destinations: [{ paymail: 'vendor@neucron.me', amount: 10000 }],
});

// Create an invoice
await sdk.invoice.createInvoice({
  businessId: 'biz_...',
  invoiceData: {
    currency: 'USD',
    customer_id: 'cust_123',
    items: [{ name: 'API Usage', quantity: 1000, cost_per_unit: 0.01 }],
  },
});
```

Server-side with existing token:

```typescript
const sdk = new NeucronSDK({ authToken: process.env.NEUCRON_TOKEN });
```

## Environments

| Environment | Base URL | Config |
| --- | --- | --- |
| Production | `https://api.neucron.io/v1` | default |
| Sandbox | `https://dev.neucron.io/v1` | `new NeucronSDK({ sandbox: true })` |
| Self-hosted | your URL | `new NeucronSDK({ baseUrl: '...' })` |

## Configuration

```typescript
const sdk = new NeucronSDK({
  authToken: '...',      // skip login when you already hold a token
  sandbox: true,         // use the sandbox API
  baseUrl: '...',        // custom API base URL (overrides sandbox)
  timeoutMs: 15_000,     // per-request timeout (default 30s)
  maxRetries: 2,         // automatic retries for idempotent requests
  oauth: {               // Sign in with Neucron
    clientId: '...',
    redirectUri: 'https://yourapp.com/callback',
  },
});
```

### Business context

Neucron scopes most resources to a business. Pass `businessId` and the SDK sends the `X-Neucron-Business-ID` header:

```typescript
const members = await sdk.members.getMembers({ businessId: 'biz_...' });
```

## SDK Surface

| Module | Capabilities |
| --- | --- |
| `sdk.auth` | Signup, login, profile, password |
| `sdk.oauth` | Sign in with Neucron (PKCE) |
| `sdk.wallet` | MPC wallets, addresses, transactions, asset sync |
| `sdk.pay` | Stablecoin payments by address, email, or paymail |
| `sdk.paymail` | Paymail alias management |
| `sdk.assets` | Asset ledger, balances, transfers |
| `sdk.asset21` | Security token lifecycle (register, deploy, govern) |
| `sdk.utility` | Utility token mint, redeem |
| `sdk.assetSwap` | Cross-asset swaps and rates |
| `sdk.invoice` | Invoices and payment collections |
| `sdk.payout` | Mass payouts with approval workflows |
| `sdk.billing` | Usage-based billing, subscriptions |
| `sdk.business` | Business profiles |
| `sdk.members` | Team members, invites, role assignment |
| `sdk.rbac` | Roles, permissions, policy controls |
| `sdk.customer` / `sdk.vendor` | Counterparty management |
| `sdk.apps` | Developer apps and secrets |
| `sdk.dataIntegrity` | On-chain file and text inscriptions |
| `sdk.flows` | High-level MCP flow orchestrations |

Full API reference: [`docs/`](./docs/README.md)

## Error Handling

```typescript
import { isNeucronError } from '@timechainlabs/neucron-ts-sdk';

try {
  await sdk.pay.payWithPaymail({ ... });
} catch (err) {
  if (isNeucronError(err)) {
    err.type;          // 'network' | 'validation' | 'internal'
    err.status;        // HTTP status
    err.isAuthError;   // 401/403
    err.isRateLimit;   // 429
    err.isRetryable;   // transient failure
  }
}
```

## Reliability

- **Timeouts**: Every request has a timeout (default 30s, configurable)
- **Retries**: GET requests retry automatically on 408/429/5xx with exponential backoff
- **Safety**: Mutating requests never retry automatically — a payment is never sent twice

## Schemas

Zod schemas for all request/response shapes are exported separately:

```typescript
import { walletSchemas, paySchemas } from '@timechainlabs/neucron-ts-sdk/schemas';
```

## Get Started

1. **Sign up** at [console.neucron.io](https://console.neucron.io)
2. **Create a business** and get your API credentials
3. **Install the SDK** and start building

## Development

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test:unit   # vitest
npm run build       # tsdown -> dist/
```

## License

[MIT](./LICENSE)
