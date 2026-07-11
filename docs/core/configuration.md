# Configuration

The Neucron SDK accepts an optional configuration object when instantiated.

## Config Interface

```typescript
interface Config {
  authToken?: string;
  businessId?: string;
}
```

## Options

### `authToken`

Pre-set an authentication token so you can skip the login step. Useful when:

- Restoring a session from secure storage
- Running server-side jobs with a service account token
- Testing with a known token

```typescript
const sdk = new NeucronSDK({
  authToken: 'eyJhbGciOiJIUzI1NiIs...',
});

// Protected calls work immediately
await sdk.wallet.walletList();
```

You can also set or read the token at runtime:

```typescript
sdk.auth.setToken('new-token');
const current = sdk.auth.getToken();
```

### `businessId`

{% hint style="warning" %}
`businessId` in the constructor `Config` is declared in the type but **not applied globally**. Always pass `businessId` on individual method calls for business-scoped operations.
{% endhint %}

```typescript
await sdk.invoice.getInvoices({
  businessId: 'biz_abc123',
});
```

## Environment Variables (recommended pattern)

Store credentials outside your codebase:

```bash
# .env
NEUCRON_EMAIL=user@example.com
NEUCRON_PASSWORD=your-password
NEUCRON_BUSINESS_ID=biz_abc123
```

```typescript
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK({
  authToken: process.env.NEUCRON_AUTH_TOKEN,
});

await sdk.auth.login({
  email: process.env.NEUCRON_EMAIL!,
  password: process.env.NEUCRON_PASSWORD!,
});
```

{% hint style="danger" %}
Never commit `.env` files or hardcode credentials in source code.
{% endhint %}

## Singleton vs. Per-Request Instances

**Recommended:** Use one `NeucronSDK` instance per application lifecycle. All services share the same `Authentication` instance and token.

```typescript
// services/neucron.ts
import NeucronSDK from '@neucron/ts-sdk';

export const sdk = new NeucronSDK();
```

For multi-tenant server apps, create one SDK instance per user session, or share the instance and call `setToken()` when the active user changes.
