---
name: assets
description: "Skill for the Assets area of neucron-ts-sdk-v2. 9 symbols across 9 files."
---

# Assets

9 symbols | 9 files | Cohesion: 40%

## When to Use

- Working with code in `src/`
- Understanding how deleteAsset, deleteCustomer, deleteInvoice work
- Modifying assets-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/assets/index.ts` | deleteAsset |
| `src/services/customer/index.ts` | deleteCustomer |
| `src/services/invoice/index.ts` | deleteInvoice |
| `src/services/members/index.ts` | removeMember |
| `src/services/paymail/index.ts` | deletePaymail |
| `src/services/rbac/index.ts` | deleteRole |
| `src/services/team/index.ts` | removeMember |
| `src/services/wallet/index.ts` | removeAssetFromWallet |
| `src/utils/http/http-client.ts` | delete |

## Entry Points

Start here when exploring this area:

- **`deleteAsset`** (Method) — `src/services/assets/index.ts:54`
- **`deleteCustomer`** (Method) — `src/services/customer/index.ts:91`
- **`deleteInvoice`** (Method) — `src/services/invoice/index.ts:102`
- **`removeMember`** (Method) — `src/services/members/index.ts:125`
- **`deletePaymail`** (Method) — `src/services/paymail/index.ts:84`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `deleteAsset` | Method | `src/services/assets/index.ts` | 54 |
| `deleteCustomer` | Method | `src/services/customer/index.ts` | 91 |
| `deleteInvoice` | Method | `src/services/invoice/index.ts` | 102 |
| `removeMember` | Method | `src/services/members/index.ts` | 125 |
| `deletePaymail` | Method | `src/services/paymail/index.ts` | 84 |
| `deleteRole` | Method | `src/services/rbac/index.ts` | 88 |
| `removeMember` | Method | `src/services/team/index.ts` | 160 |
| `removeAssetFromWallet` | Method | `src/services/wallet/index.ts` | 202 |
| `delete` | Method | `src/utils/http/http-client.ts` | 75 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DeleteAsset → NeucronError` | cross_community | 3 |
| `DeleteAsset → GetToken` | cross_community | 3 |
| `DeleteCustomer → NeucronError` | cross_community | 3 |
| `DeleteCustomer → GetToken` | cross_community | 3 |
| `DeleteInvoice → NeucronError` | cross_community | 3 |
| `DeleteInvoice → GetToken` | cross_community | 3 |
| `DeletePaymail → NeucronError` | cross_community | 3 |
| `DeleteRole → NeucronError` | cross_community | 3 |
| `DeleteRole → GetToken` | cross_community | 3 |
| `RemoveMember → NeucronError` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 16 calls |
| Invoice | 6 calls |
| Asset21 | 2 calls |

## How to Explore

1. `context({name: "deleteAsset"})` — see callers and callees
2. `query({query: "assets"})` — find related execution flows
3. Read key files listed above for implementation details
