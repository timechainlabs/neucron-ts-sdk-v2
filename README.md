# Neucron TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@timechainlabs/neucron-ts-sdk.svg)](https://www.npmjs.com/package/@timechainlabs/neucron-ts-sdk)
[![CI](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/timechainlabs/neucron-ts-sdk-v2/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## The wallet infrastructure fintechs need

Neucron is the complete blockchain wallet infrastructure platform. One API gives you everything required to build fintech products on blockchain rails — wallets, stablecoin payments, payouts, invoicing, subscriptions, compliance, and more.

**[Get started at console.neucron.io →](https://console.neucron.io)**

---

## What is Neucron?

Neucron eliminates the complexity of blockchain infrastructure so fintechs can focus on their product. Instead of stitching together wallet providers, node infrastructure, compliance tools, and payment rails, you get one platform that handles it all.

**50+ blockchain rails. 450+ assets. One SDK.**

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK({ authToken: process.env.NEUCRON_TOKEN });

// Create a wallet, send USDC, generate an invoice — all in minutes
const wallet = await sdk.wallet.createWallet({ walletName: 'Treasury' });
await sdk.pay.payWithPaymail({
  assetName: 'USDC',
  transfer_destinations: [{ paymail: 'vendor@neucron.me', amount: 50000 }],
});
```

---

## Why fintechs choose Neucron

### 🔐 MPC Wallets — Enterprise-grade security without the UX tradeoff

Non-custodial or custodial MPC wallets with threshold signing. No single point of failure. Keys are sharded across multiple parties, so even if one is compromised, funds remain secure. Your users get the security of self-custody with the simplicity of a managed solution.

### 💵 Stablecoin Payments — USDC, USDT, and more across every major chain

Accept and send stablecoins on EVM networks, Tron, Polygon, and 50+ other rails. Same API regardless of chain. Neucron handles the complexity of multi-chain operations, gas optimization, and transaction monitoring.

### 📤 Mass Payouts — Pay thousands of recipients in one API call

Batch transfers with configurable approval workflows. Set spending limits, require multi-sig approvals, define time-based policies. Built for payroll, creator payouts, affiliate commissions, and marketplace disbursements.

### 🧾 Invoicing & Billing — Native blockchain commerce

Create invoices that accept stablecoin payments. Build usage-based billing on blockchain rails. Enable stablecoin subscriptions for your customers. Perfect for SaaS, marketplaces, and API businesses.

### 🤖 Agentic Wallets — Programmable wallets for AI agents

Server wallets with fine-grained policy controls. Define exactly what an AI agent can do: spending limits, allowed recipients, time windows, asset restrictions. Built for the agentic economy.

### ✅ Compliance Built-in — KYC, KYB, sanctions screening out of the box

Tiered KYC/KYB verification flows. Real-time address sanction checks. RBAC with granular permissions. Audit trails for every transaction. Meet regulatory requirements without building compliance infrastructure.

### 🔒 Privacy — One-time addresses for every transaction

Generate unique deposit addresses per transaction. Protect user privacy while maintaining full compliance visibility. Essential for exchanges, payment processors, and privacy-conscious applications.

### 📜 Security Tokens — Issue and govern regulated assets

Full Asset21 lifecycle: register, deploy, mint, transfer, freeze, blacklist. Built-in governance for regulated tokenized assets. Compliant security token issuance without the legal and technical overhead.

---

## Use Cases

| Industry | What you can build |
| --- | --- |
| **Neobanks** | Stablecoin accounts, cross-border payments, yield products |
| **Payroll** | Crypto payroll, contractor payments, global disbursements |
| **Marketplaces** | Escrow, instant settlements, seller payouts |
| **Creator Economy** | Tipping, subscriptions, royalty splits |
| **SaaS** | Usage-based billing, stablecoin subscriptions |
| **Trading** | Custody, settlements, OTC desks |
| **AI/Agents** | Autonomous wallets with policy guardrails |

---

## Quick Start

### 1. Install

```bash
npm install @timechainlabs/neucron-ts-sdk
```

### 2. Initialize

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

// With API token (recommended for server-side)
const sdk = new NeucronSDK({ authToken: process.env.NEUCRON_TOKEN });

// Or authenticate with email/password
const sdk = new NeucronSDK();
await sdk.auth.login({ email: 'you@company.com', password: '...' });
```

### 3. Create a wallet

```typescript
const { data: wallet } = await sdk.wallet.createWallet({
  walletName: 'Operations',
  walletType: 'MPC', // MPC, Encrypted, or standard
});
```

### 4. Send a payment

```typescript
await sdk.pay.payWithPaymail({
  assetName: 'USDC',
  transfer_destinations: [
    { paymail: 'vendor@neucron.me', amount: 10000 }, // $100.00
  ],
});
```

### 5. Create an invoice

```typescript
const { data: invoice } = await sdk.invoice.createInvoice({
  businessId: 'biz_...',
  invoiceData: {
    currency: 'USD',
    customer_id: 'cust_123',
    due_date: '2024-12-31',
    items: [
      { name: 'API Usage - November', quantity: 50000, cost_per_unit: 0.001 },
    ],
    payment_option: [
      { chain: 'POLYGON', network: 'MAIN', asset_option: [{ asset_name: 'USDC' }] },
    ],
  },
});
```

---

## SDK Modules

| Module | What it does |
| --- | --- |
| `sdk.auth` | Authentication, signup, profile management |
| `sdk.oauth` | Sign in with Neucron (OAuth 2.0 + PKCE) |
| `sdk.wallet` | Create wallets, manage addresses, sync assets, view transactions |
| `sdk.pay` | Send stablecoins and assets by address, email, or paymail |
| `sdk.paymail` | Manage human-readable payment addresses |
| `sdk.assets` | Asset balances, transfers, ledger views |
| `sdk.asset21` | Security token lifecycle — register, deploy, govern |
| `sdk.utility` | Utility token minting and redemption |
| `sdk.assetSwap` | Cross-asset swaps and rate quotes |
| `sdk.invoice` | Create invoices, track payments, collections |
| `sdk.payout` | Mass payouts with approval workflows |
| `sdk.billing` | Usage-based billing, subscriptions, credits |
| `sdk.business` | Business profiles and settings |
| `sdk.members` | Team management, invites, roles |
| `sdk.rbac` | Granular permissions and policy controls |
| `sdk.customer` | Customer records for invoicing |
| `sdk.vendor` | Vendor management for payables |
| `sdk.apps` | Developer app credentials and secrets |
| `sdk.dataIntegrity` | On-chain attestations and proof of existence |
| `sdk.flows` | High-level orchestration helpers |

Full API documentation: **[docs/](./docs/README.md)**

---

## Environments

| Environment | Base URL | When to use |
| --- | --- | --- |
| **Sandbox** | `https://dev.neucron.io/v1` | Development and testing |
| **Production** | `https://api.neucron.io/v1` | Live transactions |

```typescript
// Sandbox
const sdk = new NeucronSDK({ sandbox: true });

// Production (default)
const sdk = new NeucronSDK();
```

---

## Configuration

```typescript
const sdk = new NeucronSDK({
  authToken: '...',       // Skip login if you have a token
  sandbox: true,          // Use sandbox environment
  baseUrl: '...',         // Custom API URL (self-hosted)
  timeoutMs: 30_000,      // Request timeout
  maxRetries: 2,          // Auto-retry on transient failures
  oauth: {
    clientId: '...',
    redirectUri: 'https://yourapp.com/callback',
  },
});
```

### Business Context

Most Neucron resources are scoped to a business. Pass `businessId` to operate in that context:

```typescript
const invoices = await sdk.invoice.getInvoices({ businessId: 'biz_...' });
```

---

## Error Handling

Every error is a typed `NeucronError` with machine-readable properties:

```typescript
import { isNeucronError } from '@timechainlabs/neucron-ts-sdk';

try {
  await sdk.pay.payWithPaymail({ ... });
} catch (err) {
  if (isNeucronError(err)) {
    console.log(err.type);       // 'network' | 'validation' | 'internal'
    console.log(err.status);     // HTTP status code
    console.log(err.isAuthError); // true if 401/403
    console.log(err.isRateLimit); // true if 429
    console.log(err.isRetryable); // true if transient
  }
}
```

---

## Reliability

- **Timeouts**: Every request times out (default 30s, configurable)
- **Retries**: GET requests auto-retry on 408/429/5xx with exponential backoff
- **Idempotency**: Mutating requests never auto-retry — payments are never duplicated

---

## TypeScript First

Full type coverage. Zod schemas for runtime validation. Export schemas for your own validation:

```typescript
import { walletSchemas, invoiceSchemas } from '@timechainlabs/neucron-ts-sdk/schemas';
```

---

## Get Started

1. **Sign up** at [console.neucron.io](https://console.neucron.io)
2. **Create a business** and grab your API credentials
3. **Install the SDK** and start building

```bash
npm install @timechainlabs/neucron-ts-sdk
```

**[Read the full documentation →](./docs/README.md)**

---

## Contributing

```bash
npm ci
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

[MIT](./LICENSE)
