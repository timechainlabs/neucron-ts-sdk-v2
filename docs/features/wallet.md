# Wallet

## What is a wallet in Neucron?

A **wallet** in Neucron is the primary container for holding digital assets, receiving payments, and signing on-chain activity. Every Neucron user receives a wallet at signup; businesses can own additional wallets for treasury, operations, or product-specific flows.

Wallets are identified by a `wallet_id` and typically have:

- A human-readable **wallet name**
- One or more **blockchain addresses**
- An optional **paymail** (human-readable payment address like `name@domain`)
- A **wallet type** and **provider** (self-managed, MPC, or custodian-backed)
- Cloud sync / backup status fields for recovery

### Types of wallets

| Type                                      | How you create it                | Explanation                                                                                                                                                             |
| ----------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BSV wallet**                            | `createBSVWallet`                | Simplified Bitcoin SV wallet — provide a name (and optional paymail). Best default for payments and everyday use.                                                       |
| **Configurable / MPC / custodian wallet** | `createWallet`                   | Full options: `walletType`, `custodianProvider`, `customCustodianEndpoint`, `provider`. Use when you need institutional custody, MPC key shares, or a custom custodian. |
| **Default wallet**                        | Marked via `updateDefaultWallet` | The wallet used when a method does not require an explicit `walletID`.                                                                                                  |

### Networks

Wallet operations that touch the chain accept:

| Value  | Meaning      |
| ------ | ------------ |
| `MAIN` | Mainnet      |
| `TEST` | Test network |

### Personal vs business wallets

Pass `businessId` to scope wallet operations to a business. Omit it for the authenticated user's personal wallets.

Access via `sdk.wallet`.

---

## `createWallet`

Create a wallet with full configuration (MPC / custodian options supported).

### Parameters

| Name                      | Type     | Required | Sent as                        | Description                |
| ------------------------- | -------- | -------- | ------------------------------ | -------------------------- |
| `walletName`              | `string` | Yes      | Query                          | Display name               |
| `paymailName`             | `string` | No       | Query                          | Desired paymail local-part |
| `walletType`              | `string` | No       | Query                          | Wallet type identifier     |
| `custodianProvider`       | `string` | No       | Query                          | Custodian provider name    |
| `customCustodianEndpoint` | `string` | No       | Query                          | Custom custodian URL       |
| `provider`                | `string` | No       | Query                          | Key / wallet provider      |
| `businessId`              | `string` | No       | Header `X-Neucron-Business-ID` | Business scope             |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |
| **Request body**  | None                                                  |

### Request Payload

```json
{
    "walletName": "Treasury",
    "paymailName": "treasury",
    "walletType": "MPC",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "wallet_id": "wal_def456",
    "paymail_id": "treasury@neucron.io",
    "message": "Wallet created successfully"
}
```

```typescript
const { data } = await sdk.wallet.createWallet({
    walletName: 'Treasury',
    paymailName: 'treasury',
    walletType: 'MPC',
    businessId: 'biz_abc123',
});
```

---

## `createBSVWallet`

Create a simplified BSV wallet (paymail local-part defaults to `walletName`).

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `walletName` | `string` | Yes      | Query   | Display name   |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletName": "Main",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "wallet_id": "wal_ghi789",
    "paymail_id": "main@neucron.io",
    "message": "Wallet created successfully"
}
```

```typescript
const { data } = await sdk.wallet.createBSVWallet({
    walletName: 'Main',
    businessId: 'biz_abc123',
});
```

---

## `walletList`

List wallets for the authenticated user or business.

|                     |                                                       |
| ------------------- | ----------------------------------------------------- |
| **Parameters**      | `businessId?: string`                                 |
| **Auth required**   | Yes                                                   |
| **Headers**         | `Authorization`, `X-Identifier`, optional business ID |
| **Request Payload** | None (or `businessId` only)                           |

### Request Payload

```json
{
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
[
    {
        "wallet_id": "wal_def456",
        "wallet_name": "Treasury",
        "paymail_id": "treasury@neucron.io",
        "paymail_alias": "treasury",
        "is_default": true,
        "provider": "NEUCRON",
        "wallet_type": "MPC",
        "user_id": "usr_abc123",
        "neucron_cloud_status": "SYNCED",
        "cloud_sync_status": "SYNCED",
        "backup_status": "ENABLED"
    }
]
```

```typescript
const { data } = await sdk.wallet.walletList({ businessId: 'biz_abc123' });
```

---

## `updateDefaultWallet`

Mark a wallet as the default.

### Parameters

| Name         | Type     | Required | Sent as | Description            |
| ------------ | -------- | -------- | ------- | ---------------------- |
| `walletID`   | `string` | Yes      | Query   | Wallet to make default |
| `businessId` | `string` | No       | Header  | Business scope         |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Default wallet updated"
}
```

```typescript
await sdk.wallet.updateDefaultWallet({
    walletID: 'wal_def456',
    businessId: 'biz_abc123',
});
```

---

## `createAddress`

Generate a new address for a wallet.

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `walletID`   | `string` | Yes      | Query   | Target wallet  |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Address created successfully"
}
```

```typescript
await sdk.wallet.createAddress({
    walletID: 'wal_def456',
    businessId: 'biz_abc123',
});
```

---

## `walletAddressList`

List addresses for a wallet.

### Parameters

| Name         | Type               | Required | Sent as | Description      |
| ------------ | ------------------ | -------- | ------- | ---------------- |
| `walletID`   | `string`           | No       | Query   | Filter by wallet |
| `network`    | `'MAIN' \| 'TEST'` | No       | Query   | Network filter   |
| `businessId` | `string`           | No       | Header  | Business scope   |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
[
    {
        "wallet_id": "wal_def456",
        "address": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        "chain": "BSV"
    }
]
```

```typescript
const { data } = await sdk.wallet.walletAddressList({
    walletID: 'wal_def456',
    network: 'MAIN',
});
```

---

## `syncAsset`

Sync wallet assets from the chain.

### Parameters

| Name         | Type               | Required | Sent as | Description    |
| ------------ | ------------------ | -------- | ------- | -------------- |
| `walletID`   | `string`           | Yes      | Query   | Wallet to sync |
| `network`    | `'MAIN' \| 'TEST'` | Yes      | Query   | Network        |
| `businessId` | `string`           | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Assets synced",
    "synced_count": 3
}
```

```typescript
await sdk.wallet.syncAsset({
    walletID: 'wal_def456',
    network: 'MAIN',
});
```

---

## `getAvailableAssets`

List assets available to add to a wallet.

### Parameters

| Name         | Type               | Required | Sent as | Description                       |
| ------------ | ------------------ | -------- | ------- | --------------------------------- |
| `businessId` | `string`           | No       | Header  | Business scope                    |
| `walletID`   | `string`           | No       | Query   | Wallet context                    |
| `offset`     | `number`           | No       | Query   | Pagination offset                 |
| `limit`      | `number`           | No       | Query   | Page size                         |
| `search`     | `string`           | No       | Query   | Search text                       |
| `chain`      | `string`           | No       | Query   | Chain filter (`'All'` is omitted) |
| `network`    | `'MAIN' \| 'TEST'` | No       | Query   | Network                           |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "network": "MAIN",
    "limit": 20,
    "offset": 0,
    "search": "BSV",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "list": [
        {
            "asset_id": "asset_bsv001",
            "asset_name": "BSV",
            "symbol": "BSV",
            "chain": "BSV",
            "network": "MAIN"
        }
    ]
}
```

```typescript
const { data } = await sdk.wallet.getAvailableAssets({
    walletID: 'wal_def456',
    network: 'MAIN',
    limit: 20,
});
```

---

## `addAssetToWallet`

Add an asset to a wallet.

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `walletID`   | `string` | Yes      | Query   | Target wallet  |
| `assetID`    | `string` | Yes      | Query   | Asset to add   |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "assetID": "asset_bsv001",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Asset added to wallet"
}
```

```typescript
await sdk.wallet.addAssetToWallet({
    walletID: 'wal_def456',
    assetID: 'asset_bsv001',
});
```

---

## `removeAssetFromWallet`

Remove an asset from a wallet.

### Parameters

| Name         | Type     | Required | Sent as | Description     |
| ------------ | -------- | -------- | ------- | --------------- |
| `walletID`   | `string` | Yes      | Query   | Target wallet   |
| `assetID`    | `string` | Yes      | Query   | Asset to remove |
| `businessId` | `string` | No       | Header  | Business scope  |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "assetID": "asset_bsv001",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Asset removed from wallet"
}
```

```typescript
await sdk.wallet.removeAssetFromWallet({
    walletID: 'wal_def456',
    assetID: 'asset_bsv001',
});
```

---

## `recoverWallet`

Recover a wallet using a keyshard.

### Parameters

| Name         | Type     | Required | Sent as | Description       |
| ------------ | -------- | -------- | ------- | ----------------- |
| `walletID`   | `string` | Yes      | Query   | Wallet to recover |
| `keyshard`   | `string` | Yes      | Body    | Recovery keyshard |
| `businessId` | `string` | No       | Header  | Business scope    |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "keyshard": "ks_abc123def456...",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "message": "Wallet recovered successfully"
}
```

```typescript
await sdk.wallet.recoverWallet({
    walletID: 'wal_def456',
    keyshard: 'ks_abc123def456...',
});
```

---

## `getTransactions`

Paginated transaction history for a wallet.

### Parameters

| Name         | Type               | Required | Sent as | Description    |
| ------------ | ------------------ | -------- | ------- | -------------- |
| `walletID`   | `string`           | Yes      | Query   | Wallet ID      |
| `page`       | `number` (≥ 1)     | Yes      | Query   | Page number    |
| `limit`      | `number` (≥ 1)     | Yes      | Query   | Page size      |
| `chain`      | `string`           | No       | Query   | Chain filter   |
| `network`    | `'MAIN' \| 'TEST'` | No       | Query   | Network        |
| `businessId` | `string`           | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "page": 1,
    "limit": 20,
    "chain": "BSV",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "list": [
        {
            "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
            "amount": 5000,
            "direction": "OUT",
            "status": "CONFIRMED",
            "timestamp": "2026-07-01T10:30:00Z"
        }
    ],
    "page_meta": {
        "page": 1,
        "limit": 20,
        "total": 42,
        "next_page": 2,
        "total_pages": 3
    }
}
```

```typescript
const { data } = await sdk.wallet.getTransactions({
    walletID: 'wal_def456',
    page: 1,
    limit: 20,
    network: 'MAIN',
});
```

---

## `getTransactionDetails`

Fetch details for a single transaction.

### Parameters

| Name         | Type               | Required | Sent as | Description    |
| ------------ | ------------------ | -------- | ------- | -------------- |
| `txid`       | `string`           | Yes      | Query   | Transaction ID |
| `chain`      | `string`           | Yes      | Query   | Chain          |
| `network`    | `'MAIN' \| 'TEST'` | Yes      | Query   | Network        |
| `walletID`   | `string`           | Yes      | Query   | Wallet context |
| `businessId` | `string`           | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "chain": "BSV",
    "network": "MAIN",
    "walletID": "wal_def456",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "amount": 5000,
    "fee": 200,
    "confirmations": 6,
    "status": "CONFIRMED",
    "inputs": [],
    "outputs": [],
    "timestamp": "2026-07-01T10:30:00Z"
}
```

```typescript
const { data } = await sdk.wallet.getTransactionDetails({
    txid: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    chain: 'BSV',
    network: 'MAIN',
    walletID: 'wal_def456',
});
```

---

## `importAsset`

Import an external asset into a wallet.

### Parameters

| Name               | Type     | Required | Description              |
| ------------------ | -------- | -------- | ------------------------ |
| `asset_name`       | `string` | Yes      | Asset display name       |
| `chain`            | `string` | Yes      | Chain                    |
| `contract_address` | `string` | Yes      | Contract / token address |
| `network`          | `string` | Yes      | Network                  |
| `symbol`           | `string` | Yes      | Ticker symbol            |
| `wallet_id`        | `string` | Yes      | Target wallet            |
| `decimals`         | `number` | Yes      | Decimal places           |
| `businessId`       | `string` | No       | Business scope           |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "asset_name": "My Token",
    "chain": "BSV",
    "contract_address": "1ContractAddressExample...",
    "network": "MAIN",
    "symbol": "MTK",
    "wallet_id": "wal_def456",
    "decimals": 8,
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "asset_id": "asset_mtk001",
    "message": "Asset imported successfully"
}
```

```typescript
await sdk.wallet.importAsset({
    asset_name: 'My Token',
    chain: 'BSV',
    contract_address: '1ContractAddressExample...',
    network: 'MAIN',
    symbol: 'MTK',
    wallet_id: 'wal_def456',
    decimals: 8,
});
```
