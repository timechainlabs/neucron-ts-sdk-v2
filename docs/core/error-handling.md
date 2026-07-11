# Error Handling

The SDK normalizes all errors into a single `NeucronError` class.

## NeucronError

```typescript
import { NeucronError } from '@neucron/ts-sdk';

class NeucronError extends Error {
  type: 'network' | 'validation' | 'internal';
  status?: number;       // Status code (network errors)
  data?: unknown;        // Error body (network errors)
  headers?: Record<string, string>;
  issues?: Array<{ path: string; message: string }>; // validation errors
}
```

## Error Types

### `validation`

Thrown when request or response data fails Zod schema validation **before** or **after** a call.

```typescript
try {
  await sdk.auth.login({ email: 'not-an-email', password: 'x' });
} catch (err) {
  if (err instanceof NeucronError && err.type === 'validation') {
    console.log(err.issues);
    // [{ path: 'email', message: 'Invalid email' }]
  }
}
```

Validation errors on requests prevent the network call from being made.

### `network`

Thrown for remote errors (4xx, 5xx) and connectivity failures.

```typescript
try {
  await sdk.auth.login({ email: 'wrong@example.com', password: 'bad' });
} catch (err) {
  if (err instanceof NeucronError && err.type === 'network') {
    console.log(err.status);   // 401
    console.log(err.message);  // message from the platform
    console.log(err.data);     // raw error body
  }
}
```

| Status range | Message behavior |
|--------------|------------------|
| 500+ or 0 | Message: `"Network error"` |
| 4xx | Message from `data.message` or `data.error` |

### `internal`

Thrown for SDK-internal conditions, such as calling a protected method without logging in.

```typescript
try {
  await sdk.wallet.walletList(); // no token set
} catch (err) {
  if (err instanceof NeucronError && err.type === 'internal') {
    console.log(err.message);
    // "Unauthorized to access this method, login before proceeding"
  }
}
```

## Recommended Error Handler

```typescript
import { NeucronError } from '@neucron/ts-sdk';

function handleNeucronError(err: unknown): void {
  if (!(err instanceof NeucronError)) {
    console.error('Unexpected error:', err);
    return;
  }

  switch (err.type) {
    case 'validation':
      console.error('Invalid input:', err.issues);
      break;
    case 'network':
      if (err.status === 401) {
        console.error('Session expired — please log in again');
      } else if (err.status && err.status >= 500) {
        console.error('Server error — retry later');
      } else {
        console.error(`Request failed (${err.status}):`, err.message);
      }
      break;
    case 'internal':
      console.error('SDK error:', err.message);
      break;
  }
}
```

## Typical Error Bodies

Neucron typically returns:

```json
{ "error": "Description of the error" }
```

or

```json
{ "message": "Description of the error" }
```

The SDK extracts whichever field is present and sets it as `NeucronError.message`.
