# Authentication & Headers

## Authentication Flow

The SDK uses a **shared authentication model**. The `Authentication` service owns the bearer token; every other service receives a reference to it and calls `auth.validate()` before protected methods.

```
┌─────────────┐     login()      ┌──────────────────┐
│   Your App  │ ───────────────► │  sdk.auth        │
└─────────────┘                  │  (stores token)  │
       │                         └────────┬─────────┘
       │                                  │ getToken()
       ▼                                  ▼
┌─────────────┐                  ┌──────────────────┐
│ sdk.wallet  │ ◄── auth ref ─── │ sdk.invoice      │
│ sdk.assets  │                  │ sdk.vendor       │
│ ...         │                  │ ...              │
└─────────────┘                  └──────────────────┘
```

## Auth Helpers

| Method            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `getToken()`      | Read the current token                           |
| `setToken(token)` | Manually set a token                             |
| `validate()`      | Throws if no token (used internally by services) |
| `logout()`        | Clears the stored token locally                  |

## Request Headers

Most services build headers via `buildAuthHeaders()`:

| Header                  | Value                        | When                                       |
| ----------------------- | ---------------------------- | ------------------------------------------ |
| `Authorization`         | Token from `auth.getToken()` | All authenticated calls                    |
| `X-Identifier`          | `NEUCRON` (default)          | Most authenticated calls                   |
| `X-Neucron-Business-ID` | Business ID string           | When `businessId` is passed                |
| `X-App-Secret`          | App secret string            | Data integrity / app-authenticated payouts |
| `Content-Type`          | `application/json`           | JSON bodies (automatic)                    |

### Example: business-scoped call

```typescript
await sdk.customer.createCustomer({
    businessId: 'biz_abc123',
    customerData: {
        // ...
    },
});
```

Internally this sends:

```
Authorization: <token>
X-Identifier: NEUCRON
X-Neucron-Business-ID: biz_abc123
Content-Type: application/json
```

### File uploads

For `sdk.blob.uploadDocument()` and similar methods, `Content-Type` is omitted so the runtime can set the multipart boundary automatically.

## Platform Identifier

Sign-up requires a `platform` value:

```typescript
type Platform = 'NEUCRON' | 'ASSETYZER' | 'CERTIFICATE' | 'TICKETING';
```

Forgot-password requires `X-Identifier`:

```typescript
type Identifier = 'NEUCRON' | 'ASSETYZER';
```

## Token Lifecycle

1. **Login** — `login()` validates credentials and stores `response.data.token`
2. **Use** — All services read the token via `auth.getToken()`
3. **Expiry** — Catch `NeucronError` with status `401` and re-authenticate
4. **Logout** — `logout()` clears the token locally

### Re-authentication pattern

```typescript
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        if (err instanceof NeucronError && err.status === 401) {
            await sdk.auth.login({ email, password });
            return await fn();
        }
        throw err;
    }
}

await withRetry(() => sdk.wallet.walletList());
```

## Unauthenticated Methods

These methods work without calling `login()` first:

- `auth.signUp()`
- `auth.login()`
- `auth.emailExists()`
- `auth.phoneExists()`
- `auth.forgotPassword()`

All other SDK methods require a valid token.

## Personal vs Business Context

| Context      | How to use                                       |
| ------------ | ------------------------------------------------ |
| **Personal** | Omit `businessId` on method options              |
| **Business** | Pass `businessId` → sets `X-Neucron-Business-ID` |

```typescript
// Personal
await sdk.wallet.walletList();

// Business
await sdk.wallet.walletList({ businessId: 'biz_123' });
```
