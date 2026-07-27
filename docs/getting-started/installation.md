# Installation

## npm

```bash
npm install @timechainlabs/neucron-ts-sdk
```

## yarn

```bash
yarn add @timechainlabs/neucron-ts-sdk
```

## pnpm

```bash
pnpm add @timechainlabs/neucron-ts-sdk
```

## Import Styles

### ES Modules (recommended)

```typescript
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';
import { NeucronError } from '@timechainlabs/neucron-ts-sdk';
import type { LoginBody, LoginResponse } from '@timechainlabs/neucron-ts-sdk';
```

### CommonJS

```javascript
const NeucronSDK = require('@timechainlabs/neucron-ts-sdk').default;
const { NeucronError } = require('@timechainlabs/neucron-ts-sdk');
```

### Zod Schemas (optional)

Runtime validation schemas are available as a separate export:

```typescript
import { walletSchemas, commonSchemas } from '@timechainlabs/neucron-ts-sdk/schemas';
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
import NeucronSDK from '@timechainlabs/neucron-ts-sdk';

const sdk = new NeucronSDK();
console.log(typeof sdk.auth.login); // "function"
```

If this runs without import errors, installation succeeded.

## Next Step

Continue to [Quick Start](quick-start.md) to authenticate and call your first SDK functions.
