# Installation

## npm

```bash
npm install @neucron/ts-sdk
```

## yarn

```bash
yarn add @neucron/ts-sdk
```

## pnpm

```bash
pnpm add @neucron/ts-sdk
```

## Import Styles

### ES Modules (recommended)

```typescript
import NeucronSDK from '@neucron/ts-sdk';
import { NeucronError } from '@neucron/ts-sdk';
import type { LoginBody, LoginResponse } from '@neucron/ts-sdk';
```

### CommonJS

```javascript
const NeucronSDK = require('@neucron/ts-sdk').default;
const { NeucronError } = require('@neucron/ts-sdk');
```

## TypeScript Configuration

The SDK ships with TypeScript declaration files (`.d.ts`). Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true
  }
}
```

## Peer Dependencies

The SDK bundles its own runtime dependencies:

| Dependency | Purpose |
|------------|---------|
| `axios` | HTTP client for API requests |
| `zod` | Runtime schema validation |

You do not need to install these separately.

## Browser Usage

The SDK uses `axios` and is compatible with modern bundlers (Vite, Webpack, esbuild). For file uploads via `sdk.blob.uploadDocument()`, the browser `FormData` API is used natively.

## Verify Installation

```typescript
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK();
console.log(typeof sdk.auth.login); // "function"
```

If this runs without import errors, installation succeeded.
