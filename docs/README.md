# Neucron TypeScript SDK Documentation

Welcome to the official documentation for **@timechainlabs/neucron-ts-sdk** — the wallet infrastructure SDK that fintechs use to build on blockchain rails.

## What is Neucron?

Neucron is the complete blockchain wallet infrastructure platform. Instead of integrating multiple providers for wallets, payments, compliance, and blockchain access, you get one API that handles everything.

**Built for fintechs. Ready for production.**

- **MPC Wallets** — Non-custodial or custodial with threshold signing
- **Stablecoin Payments** — USDC, USDT, and 450+ assets on 50+ chains
- **Mass Payouts** — Batch transfers with approval workflows
- **Invoicing & Billing** — Native blockchain commerce and subscriptions
- **Compliance** — KYC/KYB, sanctions screening, RBAC, audit trails
- **Security Tokens** — Issue and govern regulated tokenized assets

## Who uses Neucron?

| Industry | Use case |
| --- | --- |
| **Neobanks** | Stablecoin accounts, cross-border payments |
| **Payroll platforms** | Crypto payroll, global contractor payments |
| **Marketplaces** | Escrow, instant settlements, seller payouts |
| **Creator platforms** | Subscriptions, tipping, royalty splits |
| **SaaS** | Usage-based billing on stablecoins |
| **Trading desks** | Custody, settlements, OTC operations |
| **AI applications** | Agentic wallets with policy controls |

## Getting Started

### 1. Sign up

Create your business account at **[console.neucron.io](https://console.neucron.io)** and get your API credentials.

### 2. Install the SDK

```bash
npm install @timechainlabs/neucron-ts-sdk
```

### 3. Initialize

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK({ authToken: process.env.NEUCRON_TOKEN });
```

### 4. Start building

```typescript
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

## SDK Modules

| Module | Purpose |
| --- | --- |
| `sdk.auth` | Authentication, signup, profile management |
| `sdk.oauth` | Sign in with Neucron (OAuth 2.0 + PKCE) |
| `sdk.wallet` | MPC wallets, addresses, transactions, asset sync |
| `sdk.pay` | Stablecoin payments by address, email, or paymail |
| `sdk.paymail` | Human-readable payment addresses |
| `sdk.assets` | Asset balances, transfers, ledger views |
| `sdk.asset21` | Security token lifecycle (register, deploy, govern) |
| `sdk.utility` | Utility token minting and redemption |
| `sdk.assetSwap` | Cross-asset swaps and rate quotes |
| `sdk.invoice` | Invoices, payment collections, billing |
| `sdk.payout` | Mass payouts with approval workflows |
| `sdk.billing` | Usage-based billing, subscriptions, credits |
| `sdk.business` | Business profiles and settings |
| `sdk.members` | Team management, invites, roles |
| `sdk.rbac` | Permissions and policy controls |
| `sdk.customer` | Customer records |
| `sdk.vendor` | Vendor management |
| `sdk.apps` | Developer app credentials |
| `sdk.dataIntegrity` | On-chain attestations |
| `sdk.flows` | High-level orchestration helpers |

## Documentation Structure

### Getting Started
- **[Quick Start](getting-started/quick-start.md)** — Install, authenticate, first API call
- **[Overview](getting-started/overview.md)** — Configuration, environments, headers

### Core Concepts
- **[Configuration](core/configuration.md)** — SDK options, environments, business context
- **[Error Handling](core/error-handling.md)** — Error types, retries, debugging

### Features
Each feature page documents every SDK method with parameters, request/response shapes, and TypeScript examples:

- **[Authentication](features/authentication.md)** — Signup, login, profile, password
- **[OAuth](features/oauth.md)** — Sign in with Neucron
- **[Wallet](features/wallet.md)** — Create wallets, addresses, transactions
- **[Pay](features/pay.md)** — Send stablecoins and assets
- **[Paymail](features/paymail.md)** — Payment address aliases
- **[Assets](features/assets.md)** — Balances, transfers, ledgers
- **[Asset21](features/asset21.md)** — Security tokens
- **[Utility Tokens](features/utility.md)** — Mint and redeem
- **[Asset Swap](features/asset-swap.md)** — Cross-asset swaps
- **[Invoicing](features/invoicing.md)** — Invoices and collections
- **[Business](features/business.md)** — Business profiles
- **[Members](features/members.md)** — Team management
- **[RBAC](features/rbac.md)** — Roles and permissions
- **[Apps](features/apps.md)** — Developer apps
- **[Blob](features/blob.md)** — File uploads
- **[Data Integrity](features/data-integrity.md)** — On-chain attestations
- **[Billing](features/billing.md)** — Subscriptions and credits
- **[Customer](features/customer.md)** — Customer records
- **[Vendor](features/vendor.md)** — Vendor management
- **[Bill](features/bill.md)** — Vendor bills
- **[Payout](features/payout.md)** — Mass payouts

## Environments

| Environment | Base URL | Use case |
| --- | --- | --- |
| **Sandbox** | `https://dev.neucron.io/v1` | Development, testing |
| **Production** | `https://api.neucron.io/v1` | Live transactions |

```typescript
// Sandbox
const sdk = new NeucronSDK({ sandbox: true });

// Production (default)
const sdk = new NeucronSDK();
```

## Requirements

- Node.js 20.19+ (or modern browser / React Native)
- TypeScript 5+ recommended
- Neucron business account ([sign up](https://console.neucron.io))

## Support

- **Documentation**: You're here
- **Console**: [console.neucron.io](https://console.neucron.io)
- **Issues**: [GitHub Issues](https://github.com/timechainlabs/neucron-ts-sdk-v2/issues)
