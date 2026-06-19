# Authentication & Headers

## Authentication Flow

The SDK uses a **shared authentication model**. The `Authentication` service owns the bearer token; every other service receives a reference to it and calls `auth.validate()` before protected endpoints.

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

## Auth Service Methods

| Method | Auth Required | Description |
|--------|---------------|-------------|
| `signUp(options)` | No | Register a new user |
| `login(options)` | No | Authenticate and store token |
| `logout()` | Yes | Clear stored token |
| `emailExists(options)` | No | Check if email is registered |
| `phoneExists(options)` | No | Check if phone is registered |
| `forgotPassword(options)` | No | Initiate password reset |
| `updatePassword(options)` | Yes | Change password |
| `userInfo()` | Yes | Get current user profile |
| `updateUser(options)` | Yes | Update user profile |
| `getToken()` | — | Read current token |
| `setToken(token)` | — | Manually set token |
| `validate()` | — | Throws if no token (used internally) |

## Request Headers

### Standard authenticated requests

Most services build headers via `buildAuthHeaders()`:

| Header | Value | When |
|--------|-------|------|
| `Authorization` | Bearer token from `auth.getToken()` | All authenticated calls |
| `X-Identifier` | `NEUCRON` (default) | Most non-auth endpoints |
| `X-Neucron-Business-ID` | Business ID string | When `businessId` is passed |
| `X-Neucron-Team-ID` | Team ID string | When `teamId` is passed |
| `Content-Type` | `application/json` | JSON bodies (auto) |

### Example: business-scoped call

```typescript
await sdk.customer.createCustomer({
  businessId: 'biz_abc123',
  customerData: {
    name: 'Acme Corp',
    email: 'billing@acme.com',
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

For `sdk.blob.uploadDocument()`, `Content-Type` is omitted so the browser/axios can set the multipart boundary automatically.

## Platform Identifier

Sign-up and some auth flows require a `platform` value:

```typescript
type Platform = 'NEUCRON' | 'ASSETYZER' | 'CERTIFICATE' | 'TICKETING';
```

Forgot-password requires `X-Identifier`:

```typescript
type Identifier = 'NEUCRON' | 'ASSETYZER';
```

## Token Lifecycle

1. **Login** — `login()` validates credentials, stores `response.data.token`
2. **Use** — All services read token via `auth.getToken()`
3. **Expiry** — API returns 401/403; catch `NeucronError` and re-authenticate
4. **Logout** — `logout()` clears token locally (no server-side session invalidation)

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

## Unauthenticated Endpoints

These methods work without calling `login()` first:

- `auth.signUp()`
- `auth.login()`
- `auth.emailExists()`
- `auth.phoneExists()`
- `auth.forgotPassword()`

All other SDK methods require a valid token.
