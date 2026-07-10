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

### Zod Schemas (optional)

Runtime validation schemas are available as a separate export:

```typescript
import { walletSchemas, commonSchemas } from '@neucron/ts-sdk/schemas';
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

## Dependencies

The SDK bundles its own runtime dependencies:

| Dependency | Purpose |
|------------|---------|
| `axios` | Internal transport used by the SDK |
| `zod` | Runtime schema validation |

You do not need to install these separately.

## Browser & React Native

The SDK is compatible with modern bundlers (Vite, Webpack, esbuild) and React Native / Expo. For file uploads (`sdk.blob`, `sdk.dataIntegrity`), use the browser `File`/`Blob` APIs or a React Native upload object `{ uri, name, type }`.

## Verify Installation

```typescript
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK();
console.log(typeof sdk.auth.login); // "function"
```

If this runs without import errors, installation succeeded.

## Next Step

Continue to [Quick Start](quick-start.md) to authenticate and call your first SDK functions.
