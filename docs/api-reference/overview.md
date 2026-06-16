# API Reference Overview

All methods are accessed through the `NeucronSDK` instance. Unless noted, **authentication is required** (call `sdk.auth.login()` first).

## Service Index

| Service | Property | Domain |
|---------|----------|--------|
| [Authentication](authentication.md) | `sdk.auth` | User registration, login, profile |
| [Wallet](wallet.md) | `sdk.wallet` | Wallet and address management |
| [Assets](assets.md) | `sdk.assets` | Asset ledger, transfers, balances |
| [Asset21](asset21.md) | `sdk.asset21` | STAS token protocol operations |
| [Asset Swap](asset-swap.md) | `sdk.assetSwap` | Cross-asset swapping |
| [Pay & Paymail](pay-and-paymail.md) | `sdk.pay`, `sdk.paymail` | Payments and Paymail aliases |
| [Utility & Data Integrity](utility-and-data-integrity.md) | `sdk.utility`, `sdk.dataIntegrity` | Utility tokens and integrity proofs |
| [Team & Business](team-and-business.md) | `sdk.team`, `sdk.business` | Teams and business profiles |
| [Members & RBAC](members-and-rbac.md) | `sdk.members`, `sdk.rbac` | Business members and roles |
| [Apps & Blob](apps-and-blob.md) | `sdk.apps`, `sdk.blob` | API apps and file uploads |
| [Invoicing](invoicing.md) | `sdk.invoice` | Invoices and payment collections |
| [Customers, Vendors & Bills](customers-vendors-bills.md) | `sdk.customer`, `sdk.vendor`, `sdk.bill` | CRM and AP workflows |
| [Payouts & Billing](payouts-and-billing.md) | `sdk.payout`, `sdk.billing` | Payouts and subscriptions |

## Common Parameters

Many business-scoped methods accept:

| Parameter | Type | Description |
|-----------|------|-------------|
| `businessId` | `string` | Sets `X-Neucron-Business-ID` header |
| `teamId` | `string` | Sets `X-Neucron-Team-ID` header (team/member endpoints) |
| `pageNumber` | `number` | Pagination page (1-based) |
| `pageSize` | `number` | Items per page |

## Method Naming Conventions

| Prefix | Meaning |
|--------|---------|
| `get*` / `*List` | Fetch one or many resources |
| `create*` | Create a new resource |
| `update*` | Modify an existing resource |
| `delete*` | Remove a resource |

## Return Type

All methods return `Promise<HttpResponse<T>>`. See [Response Format](../core/response-format.md).

## Route Map

Internal API paths are centralized in the SDK. Key route prefixes:

| Prefix | Domain |
|--------|--------|
| `/auth/*` | Authentication |
| `/wallet/*` | Wallets |
| `/asset/*` | Assets |
| `/asset21/*` | STAS tokens |
| `/asset-swap/*` | Swaps |
| `/paymail/*` | Paymail |
| `/team/*` | Teams |
| `/business/*` | Business & RBAC |
| `/app/*` | API applications |
| `/blob/*` | File storage |
| `/invoice/*` | Invoicing |
| `/payment-collection/*` | Payment sessions |
| `/vendor/*` | Vendors |
| `/payout/*` | Payouts |
| `/billing/*` | Billing & subscriptions |
