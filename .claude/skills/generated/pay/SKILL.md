---
name: pay
description: "Skill for the Pay area of neucron-ts-sdk-v2. 4 symbols across 1 files."
---

# Pay

4 symbols | 1 files | Cohesion: 60%

## When to Use

- Working with code in `src/`
- Understanding how executePayment, payWithAddress, payWithEmail work
- Modifying pay-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/pay/index.ts` | executePayment, payWithAddress, payWithEmail, payWithPaymail |

## Entry Points

Start here when exploring this area:

- **`executePayment`** (Method) — `src/services/pay/index.ts:18`
- **`payWithAddress`** (Method) — `src/services/pay/index.ts:67`
- **`payWithEmail`** (Method) — `src/services/pay/index.ts:71`
- **`payWithPaymail`** (Method) — `src/services/pay/index.ts:75`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `executePayment` | Method | `src/services/pay/index.ts` | 18 |
| `payWithAddress` | Method | `src/services/pay/index.ts` | 67 |
| `payWithEmail` | Method | `src/services/pay/index.ts` | 71 |
| `payWithPaymail` | Method | `src/services/pay/index.ts` | 75 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PayWithEmail → NeucronError` | cross_community | 4 |
| `PayWithPaymail → NeucronError` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 2 calls |
| Asset21 | 1 calls |
| Invoice | 1 calls |

## How to Explore

1. `context({name: "executePayment"})` — see callers and callees
2. `query({query: "pay"})` — find related execution flows
3. Read key files listed above for implementation details
