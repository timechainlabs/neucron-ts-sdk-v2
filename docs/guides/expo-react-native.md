# Expo & React Native

This guide explains how to use `@neucron/ts-sdk` in Expo and React Native apps, and how to avoid common bundling errors.

## Root Cause of `fs` Bundling Errors

If you see an error like:

```
The package at "node_modules/neucron-sdk/dist/data-integrity/helper.js"
attempted to import the Node standard library module "fs".
```

**The issue is in the SDK package you installed, not your Expo integration code.**

| Package | React Native safe? | Notes |
|---------|-------------------|-------|
| `neucron-sdk` (v0.2.x) | No | Old JavaScript SDK; imports `fs`, `path`, and `form-data` |
| `@neucron/ts-sdk` (this repo) | Yes | Single bundled output; uses native `FormData` and `axios` |

The old `neucron-sdk` loads `data-integrity/helper.js` on import, which references Node's `fs` module. Metro bundles all imports statically, so the app crashes even if you never call data-integrity methods.

## Fix: Use `@neucron/ts-sdk`

### 1. Remove the old package

```bash
npm uninstall neucron-sdk
```

### 2. Install this SDK

```bash
# From npm (when published)
npm install @neucron/ts-sdk

# Or link locally during development
npm install ../neucron-ts-sdk-v2
```

### 3. Update imports

```typescript
// Before (old neucron-sdk)
import NeucronSDK from 'neucron-sdk';
const sdk = new NeucronSDK();
await sdk.authentication.login({ email, password });
await sdk.wallet.getAllWallet();

// After (@neucron/ts-sdk)
import NeucronSDK from '@neucron/ts-sdk';
const sdk = new NeucronSDK();
await sdk.auth.login({ email, password });
await sdk.wallet.walletList();
```

### 4. Clear Metro cache

```bash
npx expo start -c
```

## API Name Changes (Old → New)

| Old (`neucron-sdk`) | New (`@neucron/ts-sdk`) |
|---------------------|-------------------------|
| `sdk.authentication` | `sdk.auth` |
| `sdk.wallet.getAllWallet()` | `sdk.wallet.walletList()` |
| `sdk.dataIntegrity.uploadFile({ filePath })` | `sdk.dataIntegrity.fileUpload({ file })` |

## File Uploads in React Native

Do **not** pass file paths. Pass a React Native file object from `expo-document-picker` or `expo-image-picker`:

```typescript
import * as DocumentPicker from 'expo-document-picker';

const picked = await DocumentPicker.getDocumentAsync();
if (!picked.canceled && picked.assets[0]) {
  const asset = picked.assets[0];

  await sdk.dataIntegrity.fileUpload({
    walletID: 'wal_123',
    file: {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? 'application/octet-stream',
    },
  });
}
```

The SDK accepts:

- `File` (web)
- `Blob` (web / Node tests)
- `{ uri, name, type }` (React Native)

## Payout Requests

```typescript
const result = await sdk.payout.createPayoutRequest({
  businessId: 'biz_abc123',
  teamId: 'team_xyz',
  appSecret: 'your-app-secret',
  payload: {
    amount: '100',
    currency: 'CLP',
    receiver_paymail: 'recipient@paymail.com',
  },
});
```

## Session Token Management

Store the token after login and restore it on app launch:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK();

async function login(email: string, password: string) {
  const { data } = await sdk.auth.login({ email, password });
  await AsyncStorage.setItem('neucron_token', data.token);
  return data;
}

async function restoreSession() {
  const token = await AsyncStorage.getItem('neucron_token');
  if (token) {
    sdk.auth.setToken(token);
  }
}
```

## Optional: Metro Config

If you link the SDK from a local monorepo path, add it to `watchFolders` and ensure Metro resolves the built `dist` entry:

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '../neucron-ts-sdk-v2');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sdkRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(sdkRoot, 'node_modules'),
];

module.exports = config;
```

Always run `npm run build` in the SDK repo before testing in Expo when using a local link.

## Checklist

- [ ] Uninstalled `neucron-sdk`
- [ ] Installed `@neucron/ts-sdk`
- [ ] Updated imports (`auth` not `authentication`)
- [ ] Cleared Metro cache (`expo start -c`)
- [ ] Built SDK if using local file link (`npm run build`)
- [ ] File uploads use `{ uri, name, type }` not file paths
