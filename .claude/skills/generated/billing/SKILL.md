---
name: billing
description: "Skill for the Billing area of neucron-ts-sdk-v2. 65 symbols across 20 files."
---

# Billing

65 symbols | 20 files | Cohesion: 61%

## When to Use

- Working with code in `src/`
- Understanding how handleError, createUnauthorizedError, NeucronError work
- Modifying billing-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/billing/index.ts` | getBillingInfo, getBillingHistory, getPricingPlans, getCreditBalance, getPlanStatus (+5) |
| `src/services/invoice/index.ts` | getInvoiceDetails, getInvoicePaymentCollections, getPaymentSession, getPaymentCollectionList, getPaymentCollection (+4) |
| `src/services/assets/index.ts` | getAssetDetails, getAssetList, getPublicAssetList, getLedgerDetails, getAssetStats (+3) |
| `src/services/asset21/index.ts` | getAddressState, getSystemConfig, getCustomers, getRequest, syncTransaction (+1) |
| `src/services/wallet/index.ts` | walletList, walletAddressList, getAvailableAssets, getTransactions, getTransactionDetails |
| `src/services/team/index.ts` | getInvitesList, getPendingInvites, getTeamList, getMemberList |
| `src/services/rbac/index.ts` | getPermissions, getMemberRole, getRoles |
| `src/services/apps/index.ts` | getApps, getAppSecret |
| `src/services/authentication/index.ts` | validate, logout |
| `src/services/bill/index.ts` | getBill, listBills |

## Entry Points

Start here when exploring this area:

- **`handleError`** (Function) — `src/utils/errors/helper.ts:5`
- **`createUnauthorizedError`** (Function) — `tests/unit/helpers/service-test-setup.ts:27`
- **`NeucronError`** (Class) — `src/utils/errors/sdk-error.ts:0`
- **`getApps`** (Method) — `src/services/apps/index.ts:18`
- **`getAppSecret`** (Method) — `src/services/apps/index.ts:43`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `NeucronError` | Class | `src/utils/errors/sdk-error.ts` | 0 |
| `handleError` | Function | `src/utils/errors/helper.ts` | 5 |
| `createUnauthorizedError` | Function | `tests/unit/helpers/service-test-setup.ts` | 27 |
| `getApps` | Method | `src/services/apps/index.ts` | 18 |
| `getAppSecret` | Method | `src/services/apps/index.ts` | 43 |
| `getSwappableAssets` | Method | `src/services/asset-swap/index.ts` | 18 |
| `getAddressState` | Method | `src/services/asset21/index.ts` | 46 |
| `getSystemConfig` | Method | `src/services/asset21/index.ts` | 89 |
| `getCustomers` | Method | `src/services/asset21/index.ts` | 102 |
| `getRequest` | Method | `src/services/asset21/index.ts` | 195 |
| `syncTransaction` | Method | `src/services/asset21/index.ts` | 218 |
| `getOutputInfo` | Method | `src/services/asset21/index.ts` | 311 |
| `getAssetDetails` | Method | `src/services/assets/index.ts` | 40 |
| `getAssetList` | Method | `src/services/assets/index.ts` | 105 |
| `getPublicAssetList` | Method | `src/services/assets/index.ts` | 126 |
| `getLedgerDetails` | Method | `src/services/assets/index.ts` | 151 |
| `getAssetStats` | Method | `src/services/assets/index.ts` | 169 |
| `getBalances` | Method | `src/services/assets/index.ts` | 181 |
| `getOwnedAssetDetails` | Method | `src/services/assets/index.ts` | 199 |
| `getEventDetails` | Method | `src/services/assets/index.ts` | 220 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PayWithEmail → NeucronError` | cross_community | 4 |
| `PayWithPaymail → NeucronError` | cross_community | 4 |
| `Transfer → NeucronError` | cross_community | 3 |
| `UpdatePassword → NeucronError` | cross_community | 3 |
| `UserInfo → NeucronError` | cross_community | 3 |
| `UpdateUser → NeucronError` | cross_community | 3 |
| `TriggerSyncForAddresses → NeucronError` | cross_community | 3 |
| `TriggerPayout → NeucronError` | cross_community | 3 |
| `CreateApp → NeucronError` | cross_community | 3 |
| `SwapAssets → NeucronError` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Invoice | 48 calls |
| Asset21 | 10 calls |

## How to Explore

1. `context({name: "handleError"})` — see callers and callees
2. `query({query: "billing"})` — find related execution flows
3. Read key files listed above for implementation details
