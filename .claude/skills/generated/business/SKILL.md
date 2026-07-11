---
name: business
description: "Skill for the Business area of neucron-ts-sdk-v2. 3 symbols across 3 files."
---

# Business

3 symbols | 3 files | Cohesion: 40%

## When to Use

- Working with code in `src/`
- Understanding how updateBusinessDetails, updateWalletPaymentCollectionCustomization, patch work
- Modifying business-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/business/index.ts` | updateBusinessDetails |
| `src/services/invoice/index.ts` | updateWalletPaymentCollectionCustomization |
| `src/utils/http/http-client.ts` | patch |

## Entry Points

Start here when exploring this area:

- **`updateBusinessDetails`** (Method) — `src/services/business/index.ts:50`
- **`updateWalletPaymentCollectionCustomization`** (Method) — `src/services/invoice/index.ts:461`
- **`patch`** (Method) — `src/utils/http/http-client.ts:59`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `updateBusinessDetails` | Method | `src/services/business/index.ts` | 50 |
| `updateWalletPaymentCollectionCustomization` | Method | `src/services/invoice/index.ts` | 461 |
| `patch` | Method | `src/utils/http/http-client.ts` | 59 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `UpdateBusinessDetails → NeucronError` | cross_community | 3 |
| `UpdateBusinessDetails → GetToken` | cross_community | 3 |
| `UpdateWalletPaymentCollectionCustomization → NeucronError` | cross_community | 3 |
| `UpdateWalletPaymentCollectionCustomization → GetToken` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 4 calls |
| Invoice | 2 calls |

## How to Explore

1. `context({name: "updateBusinessDetails"})` — see callers and callees
2. `query({query: "business"})` — find related execution flows
3. Read key files listed above for implementation details
