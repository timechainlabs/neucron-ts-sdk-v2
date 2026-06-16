# Wallet API

**Service:** `sdk.wallet`

Create and manage BSV wallets, addresses, asset sync, and transaction history.

---

## `createWallet(options)`

Create a new wallet with an optional Paymail alias.

**HTTP:** `POST /wallet/create`

### Parameters — `CreateWalletBody`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletName` | `string` | Yes | Display name for the wallet |
| `paymailName` | `string` | No | Paymail alias (defaults to `walletName`) |
| `walletType` | `string` | No | Wallet type identifier |
| `custodianProvider` | `string` | No | Custodian provider name |
| `customCustodianEndpoint` | `string` | No | Custom custodian URL |
| `provider` | `string` | No | Wallet provider |
| `businessId` | `string` | No | Business context header |

### Response — `CreateWalletReponse`

| Field | Type |
|-------|------|
| `wallet_id` | `string` |
| `paymail_id` | `string` |

### Example

```typescript
const wallet = await sdk.wallet.createWallet({
  walletName: 'My Business Wallet',
  paymailName: 'mybusiness',
});
```

---

## `createBSVWallet(options)`

Create a BSV-specific wallet (Paymail defaults to wallet name).

**HTTP:** `POST /wallet/create`

### Parameters — `CreateBSVWalletBody`

| Field | Type | Required |
|-------|------|----------|
| `walletName` | `string` | Yes |
| `businessId` | `string` | No |

---

## `walletList(options?)`

List all wallets for the authenticated user.

**HTTP:** `GET /wallet/list`

### Parameters

| Field | Type |
|-------|------|
| `businessId` | `string` (optional) |

---

## `updateDefaultWallet(options)`

Set a wallet as the user's default.

**HTTP:** `PUT /wallet/default?walletID={id}`

### Parameters — `UpdateDefaultWalletBody`

| Field | Type | Required |
|-------|------|----------|
| `walletID` | `string` | Yes |
| `businessId` | `string` | No |

---

## `createAddress(options)`

Generate a new receiving address for a wallet.

**HTTP:** `POST /wallet/address/create`

### Parameters — `WalletAddressBody`

| Field | Type | Required |
|-------|------|----------|
| `walletID` | `string` | Yes |
| `businessId` | `string` | No |

---

## `walletAddressList(options?)`

List all addresses for a wallet.

**HTTP:** `GET /wallet/addresses`

---

## `syncAsset(options)`

Sync wallet assets with the blockchain.

**HTTP:** `POST /wallet/sync`

### Parameters — `SyncAsset`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletID` | `string` | Yes | Wallet to sync |
| `network` | `'MAIN' \| 'TEST'` | Yes | Network type |
| `businessId` | `string` | No | Business context |

---

## `getAvailableAssets(options?)`

Get assets available in a wallet.

**HTTP:** `GET /wallet/assets`

---

## `addAssetToWallet(options)`

Add an asset to a wallet's tracked list.

**HTTP:** `POST /wallet/asset/add`

---

## `removeAssetFromWallet(options)`

Remove an asset from a wallet's tracked list.

**HTTP:** `POST /wallet/asset/remove`

---

## `recoverWallet(options)`

Recover a wallet from backup.

**HTTP:** `POST /wallet/recover`

---

## `getTransactions(options)`

Get paginated transaction history for a wallet.

**HTTP:** `GET /wallet/history`

### Parameters — `Transactions`

| Field | Type | Description |
|-------|------|-------------|
| `walletID` | `string` | Wallet ID |
| `pageNumber` | `number` | Page number |
| `pageSize` | `number` | Page size |
| `businessId` | `string` | Business context |

---

## `getTransactionDetails(options)`

Get details for a single transaction.

**HTTP:** `GET /wallet/transaction`

---

## `importAsset(options)`

Import an external asset into a wallet.

**HTTP:** `POST /wallet/asset/import`

---

## Wallet Workflow Example

```typescript
await sdk.auth.login({ email, password });

// Create wallet
const { data: created } = await sdk.wallet.createWallet({
  walletName: 'Operations',
  paymailName: 'ops',
});

// Sync with mainnet
await sdk.wallet.syncAsset({
  walletID: created.wallet_id,
  network: 'MAIN',
});

// List transactions
const history = await sdk.wallet.getTransactions({
  walletID: created.wallet_id,
  pageNumber: 1,
  pageSize: 10,
});
```
