---
name: asset21
description: "Skill for the Asset21 area of neucron-ts-sdk-v2. 21 symbols across 7 files."
---

# Asset21

21 symbols | 7 files | Cohesion: 38%

## When to Use

- Working with code in `src/`
- Understanding how fetchBalance, deploy, register work
- Modifying asset21-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/asset21/index.ts` | fetchBalance, deploy, register, createRequest, triggerSyncForAddresses (+2) |
| `src/services/authentication/index.ts` | getToken, updatePassword, userInfo, updateUser |
| `src/services/utility/index.ts` | createUtility, mint, redeem |
| `src/services/data-integrity/index.ts` | fileUpload, textUpload |
| `src/services/team/index.ts` | acceptInvite, createInvite |
| `src/utils/http/types.ts` | get, put |
| `src/services/paymail/index.ts` | createPaymail |

## Entry Points

Start here when exploring this area:

- **`fetchBalance`** (Method) — `src/services/asset21/index.ts:65`
- **`deploy`** (Method) — `src/services/asset21/index.ts:122`
- **`register`** (Method) — `src/services/asset21/index.ts:142`
- **`createRequest`** (Method) — `src/services/asset21/index.ts:163`
- **`triggerSyncForAddresses`** (Method) — `src/services/asset21/index.ts:239`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchBalance` | Method | `src/services/asset21/index.ts` | 65 |
| `deploy` | Method | `src/services/asset21/index.ts` | 122 |
| `register` | Method | `src/services/asset21/index.ts` | 142 |
| `createRequest` | Method | `src/services/asset21/index.ts` | 163 |
| `triggerSyncForAddresses` | Method | `src/services/asset21/index.ts` | 239 |
| `transfer` | Method | `src/services/asset21/index.ts` | 268 |
| `getUnspentUTXOs` | Method | `src/services/asset21/index.ts` | 287 |
| `getToken` | Method | `src/services/authentication/index.ts` | 34 |
| `updatePassword` | Method | `src/services/authentication/index.ts` | 137 |
| `userInfo` | Method | `src/services/authentication/index.ts` | 153 |
| `updateUser` | Method | `src/services/authentication/index.ts` | 168 |
| `fileUpload` | Method | `src/services/data-integrity/index.ts` | 16 |
| `textUpload` | Method | `src/services/data-integrity/index.ts` | 36 |
| `createPaymail` | Method | `src/services/paymail/index.ts` | 25 |
| `acceptInvite` | Method | `src/services/team/index.ts` | 32 |
| `createInvite` | Method | `src/services/team/index.ts` | 64 |
| `createUtility` | Method | `src/services/utility/index.ts` | 24 |
| `mint` | Method | `src/services/utility/index.ts` | 56 |
| `redeem` | Method | `src/services/utility/index.ts` | 75 |
| `get` | Method | `src/utils/http/types.ts` | 4 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Transfer → NeucronError` | cross_community | 3 |
| `UpdatePassword → NeucronError` | cross_community | 3 |
| `UserInfo → NeucronError` | cross_community | 3 |
| `UpdateUser → NeucronError` | cross_community | 3 |
| `TriggerSyncForAddresses → NeucronError` | cross_community | 3 |
| `TriggerPayout → GetToken` | cross_community | 3 |
| `CreateApp → GetToken` | cross_community | 3 |
| `SwapAssets → GetToken` | cross_community | 3 |
| `DeleteAsset → GetToken` | cross_community | 3 |
| `Transfer → GetToken` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 36 calls |
| Invoice | 15 calls |

## How to Explore

1. `context({name: "fetchBalance"})` — see callers and callees
2. `query({query: "asset21"})` — find related execution flows
3. Read key files listed above for implementation details
