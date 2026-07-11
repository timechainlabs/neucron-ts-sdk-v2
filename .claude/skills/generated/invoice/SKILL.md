---
name: invoice
description: "Skill for the Invoice area of neucron-ts-sdk-v2. 61 symbols across 18 files."
---

# Invoice

61 symbols | 18 files | Cohesion: 49%

## When to Use

- Working with code in `src/`
- Understanding how buildAuthHeaders, createApp, swapAssets work
- Modifying invoice-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/invoice/index.ts` | createInvoice, getInvoices, finaliseInvoice, markInvoiceAsPaid, shareInvoice (+11) |
| `src/services/wallet/index.ts` | createWallet, createBSVWallet, createAddress, syncAsset, addAssetToWallet (+3) |
| `src/services/bill/index.ts` | createBill, reviewBill, confirmBill, payBill, mapBillToPayout (+2) |
| `src/services/billing/index.ts` | requestPlan, upgradePlan, cancelPlan, creditsTopUp, raisePaymentForInvoice (+1) |
| `src/services/payout/index.ts` | createPayout, triggerPayout, confirmPayout, updatePayout |
| `src/services/members/index.ts` | createInvites, assignRoles, removeRoles |
| `src/services/asset-swap/index.ts` | swapAssets, getSwapRate |
| `src/services/assets/index.ts` | transfer, getLedgerList |
| `src/services/customer/index.ts` | createCustomer, updateCustomer |
| `src/services/rbac/index.ts` | createRole, updateRole |

## Entry Points

Start here when exploring this area:

- **`buildAuthHeaders`** (Function) — `src/utils/http/headers.ts:9`
- **`createApp`** (Method) — `src/services/apps/index.ts:30`
- **`swapAssets`** (Method) — `src/services/asset-swap/index.ts:30`
- **`getSwapRate`** (Method) — `src/services/asset-swap/index.ts:49`
- **`transfer`** (Method) — `src/services/assets/index.ts:68`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `buildAuthHeaders` | Function | `src/utils/http/headers.ts` | 9 |
| `createApp` | Method | `src/services/apps/index.ts` | 30 |
| `swapAssets` | Method | `src/services/asset-swap/index.ts` | 30 |
| `getSwapRate` | Method | `src/services/asset-swap/index.ts` | 49 |
| `transfer` | Method | `src/services/assets/index.ts` | 68 |
| `getLedgerList` | Method | `src/services/assets/index.ts` | 81 |
| `createBill` | Method | `src/services/bill/index.ts` | 32 |
| `reviewBill` | Method | `src/services/bill/index.ts` | 92 |
| `confirmBill` | Method | `src/services/bill/index.ts` | 111 |
| `payBill` | Method | `src/services/bill/index.ts` | 130 |
| `mapBillToPayout` | Method | `src/services/bill/index.ts` | 149 |
| `acceptVendorInvitation` | Method | `src/services/bill/index.ts` | 168 |
| `requestPlan` | Method | `src/services/billing/index.ts` | 84 |
| `upgradePlan` | Method | `src/services/billing/index.ts` | 109 |
| `cancelPlan` | Method | `src/services/billing/index.ts` | 131 |
| `creditsTopUp` | Method | `src/services/billing/index.ts` | 150 |
| `raisePaymentForInvoice` | Method | `src/services/billing/index.ts` | 186 |
| `addPaymentMethod` | Method | `src/services/billing/index.ts` | 249 |
| `uploadDocument` | Method | `src/services/blob/index.ts` | 18 |
| `createCustomer` | Method | `src/services/customer/index.ts` | 55 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `TriggerPayout → NeucronError` | cross_community | 3 |
| `TriggerPayout → GetToken` | cross_community | 3 |
| `CreateApp → NeucronError` | cross_community | 3 |
| `CreateApp → GetToken` | cross_community | 3 |
| `SwapAssets → NeucronError` | cross_community | 3 |
| `SwapAssets → GetToken` | cross_community | 3 |
| `DeleteAsset → GetToken` | cross_community | 3 |
| `Transfer → NeucronError` | cross_community | 3 |
| `Transfer → GetToken` | cross_community | 3 |
| `CreateBill → NeucronError` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 116 calls |
| Asset21 | 5 calls |

## How to Explore

1. `context({name: "buildAuthHeaders"})` — see callers and callees
2. `query({query: "invoice"})` — find related execution flows
3. Read key files listed above for implementation details
