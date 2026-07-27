# Neucron TypeScript SDK

Welcome to the official documentation for **@timechainlabs/neucron-ts-sdk** — a type-safe TypeScript SDK for building applications on the Neucron platform.

Neucron provides wallets, digital assets, payments, invoicing, security tokens, and business tooling on Bitcoin SV. This SDK exposes those capabilities as typed methods so you can build products without wiring low-level requests yourself.

## What you can build

| Domain | Capabilities |
| --- | --- |
| **Identity** | Sign up, login, profile management, password recovery |
| **Wallets** | Create wallets, addresses, balances, transaction history |
| **Payments** | Pay by address, email, or paymail; manage paymail aliases |
| **Assets** | Certificates, utility tokens, tickets, transfers, ledgers |
| **Security tokens (Asset21)** | Register, deploy, mint, redeem, freeze, blacklist, governance |
| **Business** | Business profiles, members, RBAC roles |
| **Commerce** | Customers, invoices, payment collections, vendors, bills, payouts |
| **Developer apps** | Create apps, secrets, publish to the app store, blob uploads |
| **Data integrity** | Inscribe files and text on-chain for tamper-evident records |
| **Billing** | Plans, credits, subscriptions, platform invoices |

## Package

```bash
npm install @timechainlabs/neucron-ts-sdk
```

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK();
```

## SDK surface

Every feature is exposed as a property on the main client:

```typescript
sdk.auth          // Authentication
sdk.wallet        // Wallets & transactions
sdk.paymail       // Paymail aliases
sdk.pay           // BSV payments
sdk.assets        // Digital assets
sdk.asset21       // Security / regulated tokens
sdk.utility       // Utility tokens
sdk.dataIntegrity // On-chain inscriptions
sdk.assetSwap     // Asset swaps
sdk.business      // Business profiles
sdk.members       // Business members
sdk.rbac          // Roles & permissions
sdk.apps          // Developer apps
sdk.blob          // File / image uploads
sdk.customer      // Customers
sdk.invoice       // Invoices & payment collections
sdk.vendor        // Vendors & expenses
sdk.bill          // Vendor bills
sdk.payout        // Payouts
sdk.billing       // Platform billing & subscriptions
```

## How this documentation is organized

1. **[Quick Start](getting-started/quick-start.md)** — install, authenticate, and make your first calls.
2. **[Overview](getting-started/overview.md)** — configuration, auth, headers, responses, and errors.
3. **Features** — one page per domain with feature background, then every SDK function documented with parameters, headers, query fields, request body, and response.

{% hint style="info" %}
This documentation describes **SDK functions only**. Interact with Neucron through typed methods such as `sdk.wallet.createWallet(...)`.
{% endhint %}

## Requirements

- Node.js 18+ (or a modern bundler / React Native environment)
- TypeScript 5+ recommended (JavaScript works; types are included)
- A Neucron account (email + password) or an existing auth token

## Next step

Start with the [Quick Start](getting-started/quick-start.md) guide.
