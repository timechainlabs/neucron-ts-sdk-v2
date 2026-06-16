# Testing & Development

Guide for developing and testing applications using the Neucron SDK.

## SDK Development (Contributors)

### Prerequisites

```bash
git clone https://github.com/rustybuddha/neucron-ts-sdk-v2.git
cd neucron-ts-sdk-v2
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build ESM, CJS, and `.d.ts` to `dist/` |
| `npm run typecheck` | Run TypeScript compiler without emit |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:unit` | Run unit tests once |
| `npm run test:integration` | Run integration tests against real API |
| `npm run test:run` | Run all tests (unit + integration) |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

### Project Structure

```
src/
├── index.ts              # Public exports
├── nuecron-sdk.ts        # NeucronSDK class
├── config.ts             # BASE_URL and Config
├── services/
│   ├── authentication/   # index.ts, types.ts, schema.ts, validator.ts
│   ├── wallet/
│   └── ...               # One folder per service
└── utils/
    ├── http/             # HttpClient, headers, types
    ├── errors/           # NeucronError, handleError
    └── routes/           # API route constants
```

Each service follows the same pattern:

1. **`schema.ts`** — Zod schemas for request/response validation
2. **`types.ts`** — TypeScript types inferred from schemas
3. **`validator.ts`** — Validates inputs and outputs
4. **`index.ts`** — Service class with public methods

---

## Testing Your Integration

### Unit Testing with Mocks

Mock the HTTP layer when testing your application logic:

```typescript
import { describe, it, expect, vi } from 'vitest';
import NeucronSDK from '@neucron/ts-sdk';

vi.mock('@neucron/ts-sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    auth: {
      login: vi.fn().mockResolvedValue({
        data: { token: 'test-token', platforms: ['NEUCRON'] },
        status: 200,
        headers: {},
      }),
      getToken: vi.fn().mockReturnValue('test-token'),
    },
    wallet: {
      walletList: vi.fn().mockResolvedValue({
        data: [{ wallet_id: 'wal_test', wallet_name: 'Test' }],
        status: 200,
        headers: {},
      }),
    },
  })),
}));
```

### Integration Testing

The SDK includes integration tests that call the real Neucron API. To run them:

1. Create a `.env` file in the project root:

```bash
TEST_USER_EMAIL=your-test-account@example.com
TEST_USER_PASSWORD=your-test-password
TEST_TEAM_ID=your-team-id
TEST_INVITE_EMAIL=invite-test@example.com
```

2. Run integration tests:

```bash
npm run test:integration
```

> Use a dedicated test account. Never use production credentials.

### Environment Variables for CI

Integration tests skip automatically when credentials are not provided. In CI, only unit tests run via `npm run test:unit`.

---

## Error Testing

Verify your app handles all three error types:

```typescript
import { NeucronError } from '@neucron/ts-sdk';

// Validation error — bad input
try {
  await sdk.auth.login({ email: 'bad', password: '' });
} catch (e) {
  expect(e).toBeInstanceOf(NeucronError);
  expect((e as NeucronError).type).toBe('validation');
}

// Network error — wrong credentials
try {
  await sdk.auth.login({ email: 'real@email.com', password: 'wrong' });
} catch (e) {
  expect((e as NeucronError).type).toBe('network');
}

// Internal error — no auth
try {
  await sdk.wallet.walletList();
} catch (e) {
  expect((e as NeucronError).type).toBe('internal');
}
```

---

## Building for Production

```bash
npm run build
```

Output:

```
dist/
├── index.js      # CommonJS
├── index.mjs     # ES Module
└── index.d.ts    # Type declarations
```

Publish or link locally:

```bash
npm link          # In SDK directory
npm link @neucron/ts-sdk  # In your app directory
```

---

## Debugging Tips

1. **Log HTTP responses** — Wrap SDK calls and log `response.status` and `response.data`
2. **Check validation issues** — On `validation` errors, inspect `err.issues` for field-level messages
3. **Verify token** — Call `sdk.auth.getToken()` before protected operations
4. **Confirm businessId** — Most business API failures are missing `businessId`

```typescript
const debug = async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
  console.log(`[SDK] ${label} — token: ${sdk.auth.getToken() ? 'set' : 'missing'}`);
  try {
    const result = await fn();
    console.log(`[SDK] ${label} — success`);
    return result;
  } catch (err) {
    console.error(`[SDK] ${label} — failed`, err);
    throw err;
  }
};

await debug('walletList', () => sdk.wallet.walletList());
```
