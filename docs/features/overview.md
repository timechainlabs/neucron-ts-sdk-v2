# Features Overview

This section documents every public **SDK feature** on `NeucronSDK`. Each page covers one service module (`sdk.auth`, `sdk.wallet`, and so on) with:

- A **feature overview** explaining the domain in Neucron (concepts, types, and when to use it)
- Every **SDK function** with **Parameters**, **Query**, **Headers**, **Request**, and **Response**
- Typed usage examples

{% hint style="info" %}
These docs describe **SDK functions only**. You call typed methods such as `sdk.wallet.createWallet(...)`.
{% endhint %}

## How to read function docs

Most functions return `Promise<HttpResponse<T>>`. Local helpers such as `getToken()` return plain values.

```typescript
const result = await sdk.wallet.createWallet({ walletName: 'Main' });

result.data; // typed payload
result.status; // status code
result.headers; // response headers
```

| Section        | Meaning                                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| **Parameters** | Arguments you pass into the SDK function                                                |
| **Query**      | Fields the SDK sends as query options (when applicable)                                 |
| **Headers**    | Auth and context headers the SDK attaches (`Authorization`, business ID, app secret, …) |
| **Request**    | Body / payload shape the function accepts                                               |
| **Response**   | Shape of `result.data` after validation                                                 |

## Feature index

| Feature                                 | Accessor            | Description                              |
| --------------------------------------- | ------------------- | ---------------------------------------- |
| [Authentication](authentication.md)     | `sdk.auth`          | Sign up, login, profile, password        |
| [Wallet](wallet.md)                     | `sdk.wallet`        | Wallets, addresses, assets, transactions |
| [Paymail](paymail.md)                   | `sdk.paymail`       | Human-readable payment aliases           |
| [Pay](pay.md)                           | `sdk.pay`           | Send assets by address, email, or Paymail |
| [Assets](assets.md)                     | `sdk.assets`        | Asset ledger, balances, transfers        |
| [Asset21](asset21.md)                   | `sdk.asset21`       | Security / regulated token lifecycle     |
| [Utility Tokens](utility.md)            | `sdk.utility`       | Register, mint, and redeem utilities     |
| [Data Integrity](data-integrity.md)     | `sdk.dataIntegrity` | On-chain file and text inscriptions      |
| [Asset Swap](asset-swap.md)             | `sdk.assetSwap`     | Cross-asset swaps and rates              |
| [Business](business.md)                 | `sdk.business`      | Business profile and listing             |
| [Members](members.md)                   | `sdk.members`       | Business members and invites             |
| [RBAC](rbac.md)                         | `sdk.rbac`          | Roles and permissions                    |
| [Apps](apps.md)                         | `sdk.apps`          | Developer apps and secrets               |
| [Blob Storage](blob.md)                 | `sdk.blob`          | Document and image uploads               |
| [Customers](customers.md)               | `sdk.customer`      | Invoicing customers                      |
| [Invoicing & Collections](invoicing.md) | `sdk.invoice`       | Invoices and payment collections         |
| [Vendors](vendors.md)                   | `sdk.vendor`        | Vendors, expenses, payments              |
| [Bills](bills.md)                       | `sdk.bill`          | Vendor bill lifecycle                    |
| [Payouts](payouts.md)                   | `sdk.payout`        | Outbound payouts                         |
| [Billing & Subscriptions](billing.md)   | `sdk.billing`       | Platform subscriptions and credits       |

## Shared conventions

### Authentication

Unless a function is marked **Auth required: No**, call `sdk.auth.login()` (or construct the client with `authToken`) first.

### Business context

Pass `businessId` in function options to scope the call to a business. The SDK sets the `X-Neucron-Business-ID` header. The business ID is the main scoping identifier across the API.

### Network

Many wallet and asset functions accept:

```typescript
network?: 'MAIN' | 'TEST'
```

### Types

Request and response types are exported from `@timechainlabs/neucron-ts-sdk`:

```typescript
import type { CreateWalletBody, CreateWalletReponse, LoginBody, LoginResponse } from '@timechainlabs/neucron-ts-sdk';
```
