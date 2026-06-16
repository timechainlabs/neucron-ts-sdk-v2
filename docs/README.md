# Neucron TypeScript SDK

The **Neucron TypeScript SDK** (`@neucron/ts-sdk`) is the official client library for integrating with the [Neucron](https://neucron.io) platform APIs. It provides type-safe, validated access to wallet management, digital assets, payments, invoicing, vendor management, team collaboration, and business operations — all from Node.js, browsers, or any TypeScript/JavaScript runtime.

## What is Neucron?

Neucron is a blockchain-powered financial and asset management platform built on Bitcoin SV (BSV). It enables:

- **Wallet management** — Create and manage BSV wallets with Paymail support
- **Digital assets** — Mint, transfer, and track tokens, tickets, certificates, and utilities
- **Business operations** — Invoicing, vendor bills, payouts, and subscription billing
- **Team collaboration** — Multi-user businesses with role-based access control (RBAC)
- **Payments** — Pay via address, email, or Paymail; payment collections and sessions

## Why use this SDK?

| Feature | Benefit |
|---------|---------|
| **Full TypeScript support** | Autocomplete, compile-time checks, and exported types for every API |
| **Zod validation** | Request and response payloads are validated before and after each call |
| **Unified error model** | `NeucronError` with typed categories: `network`, `validation`, `internal` |
| **Shared authentication** | Log in once; all services share the same auth token automatically |
| **Business context headers** | Pass `businessId` and `teamId` per request for multi-tenant apps |
| **ESM + CJS** | Works with both `import` and `require` |

## SDK Architecture

```
NeucronSDK
├── auth              Authentication (login, signup, user profile)
├── wallet            Wallet CRUD, addresses, sync, transactions
├── assets            Asset ledger, transfers, balances, public listings
├── asset21             STAS token operations (deploy, transfer, UTXOs)
├── assetSwap           Cross-asset swap rates and execution
├── pay                 Pay by address, email, or Paymail
├── paymail             Paymail alias management
├── utility             Utility token register, mint, redeem
├── dataIntegrity       File and text integrity proofs
├── team                Team invites, members, roles
├── business            Business profile and listing
├── members             Business member invites and role assignment
├── rbac                Roles and permissions management
├── apps                API app registration and secrets
├── blob                Document upload
├── invoice             Invoices and payment collections
├── customer            Customer CRUD
├── vendor              Vendor management and expenses
├── bill                Vendor bill lifecycle
├── payout              Payout creation and confirmation
└── billing             Subscriptions, credits, and payment methods
```

## Base API URL

All requests are sent to:

```
https://api.neucron.io/v1
```

## Requirements

- **Node.js** 18+ (recommended)
- **TypeScript** 5.x (optional but recommended)
- A Neucron account with API access

## Package Information

| Property | Value |
|----------|-------|
| Package name | `@neucron/ts-sdk` |
| Version | 1.0.0 |
| License | MIT |
| Repository | [github.com/rustybuddha/neucron-ts-sdk-v2](https://github.com/rustybuddha/neucron-ts-sdk-v2) |

## Next Steps

1. [Install the SDK](getting-started/installation.md)
2. [Run your first API call](getting-started/quick-start.md)
3. Browse the [API Reference](api-reference/overview.md)
