---
name: authentication
description: "Skill for the Authentication area of neucron-ts-sdk-v2. 9 symbols across 3 files."
---

# Authentication

9 symbols | 3 files | Cohesion: 64%

## When to Use

- Working with code in `src/`
- Understanding how setupAuthenticatedAuth, Authentication, signUp work
- Modifying authentication-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/services/authentication/index.ts` | signUp, emailExists, phoneExists, forgotPassword, Authentication (+2) |
| `src/utils/http/types.ts` | post |
| `tests/unit/helpers/service-test-setup.ts` | setupAuthenticatedAuth |

## Entry Points

Start here when exploring this area:

- **`setupAuthenticatedAuth`** (Function) — `tests/unit/helpers/service-test-setup.ts:19`
- **`Authentication`** (Class) — `src/services/authentication/index.ts:25`
- **`signUp`** (Method) — `src/services/authentication/index.ts:52`
- **`emailExists`** (Method) — `src/services/authentication/index.ts:88`
- **`phoneExists`** (Method) — `src/services/authentication/index.ts:103`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Authentication` | Class | `src/services/authentication/index.ts` | 25 |
| `setupAuthenticatedAuth` | Function | `tests/unit/helpers/service-test-setup.ts` | 19 |
| `signUp` | Method | `src/services/authentication/index.ts` | 52 |
| `emailExists` | Method | `src/services/authentication/index.ts` | 88 |
| `phoneExists` | Method | `src/services/authentication/index.ts` | 103 |
| `forgotPassword` | Method | `src/services/authentication/index.ts` | 119 |
| `post` | Method | `src/utils/http/types.ts` | 5 |
| `setToken` | Method | `src/services/authentication/index.ts` | 37 |
| `login` | Method | `src/services/authentication/index.ts` | 64 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `EmailExists → NeucronError` | cross_community | 3 |
| `PhoneExists → NeucronError` | cross_community | 3 |
| `ForgotPassword → NeucronError` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Billing | 5 calls |

## How to Explore

1. `context({name: "setupAuthenticatedAuth"})` — see callers and callees
2. `query({query: "authentication"})` — find related execution flows
3. Read key files listed above for implementation details
