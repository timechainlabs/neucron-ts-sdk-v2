# Assets

## What are assets in Neucron?

**Assets** are digital tokens managed on Neucron — certificates, utilities, securities, stablecoins, tickets, and more. The `sdk.assets` module covers discovery, balances, ledger views, and transfers. Creating/minting utility tokens lives on `sdk.utility`; regulated security tokens on `sdk.asset21`.

### Asset types

`CERTIFICATE` · `UTILITY` · `SECURITY` · `STABLECOIN` · `MNEE` · `TICKET`

### Status values

`DRAFTED` · `MINTED` · `EXPIRED` · `DEPLOYED`

Access via `sdk.assets`.

---

## `getAssetDetails`

Fetch full metadata for an asset.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query | Asset ID |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "assetID": "asset_util001"
}
```

### Response Payload

```json
{
  "asset_id": "asset_util001",
  "asset_name": "Loyalty Points",
  "asset_type": "UTILITY",
  "symbol": "LOYAL",
  "status": "MINTED",
  "protocol": "STAS-20",
  "scope": "public",
  "total_supply": 1000000,
  "current_supply": 750000,
  "image_url": "https://cdn.example.com/loyal.png",
  "legal_term": "Subject to issuer terms.",
  "wallet_id": "wal_def456",
  "user_id": "usr_abc123",
  "team_id": "team_abc123",
  "app_id": "app_xyz789",
  "utxo_id": "utxo_abc123",
  "created_at": "2026-05-01T10:00:00Z",
  "updated_at": "2026-07-01T12:00:00Z",
  "minted_at": "2026-05-02T10:00:00Z",
  "expires_at": null,
  "tokenDetail": {
    "name": "Loyalty Points",
    "symbol": "LOYAL",
    "totalSupply": 1000000,
    "satsPerToken": 1
  },
  "certificate_metadata": {},
  "event_metadata": {}
}
```

```typescript
const { data } = await sdk.assets.getAssetDetails({ assetID: 'asset_util001' });
```

---

## `deleteAsset`

Delete an asset.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query | Asset ID |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "assetID": "asset_util001"
}
```

### Response Payload

```json
{
  "message": "Asset deleted successfully"
}
```

```typescript
await sdk.assets.deleteAsset({ assetID: 'asset_util001' });
```

---

## `transfer`

Transfer an asset to one or more recipients.

### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `asset_id` | `string` | Yes | Asset to transfer |
| `transfer_destinations` | `Array` | Yes | Recipients (min 1) |

Each destination: `amount`, `name`, `country_code`, `email`, `paymail`, `phone_number`.

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "asset_id": "asset_util001",
  "transfer_destinations": [
    {
      "amount": 100,
      "name": "Alice Smith",
      "country_code": "+91",
      "email": "alice@example.com",
      "paymail": "alice@neucron.io",
      "phone_number": "9876543210"
    }
  ]
}
```

### Response Payload

```json
{
  "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "message": "Transfer submitted"
}
```

```typescript
await sdk.assets.transfer({
  asset_id: 'asset_util001',
  transfer_destinations: [
    {
      amount: 100,
      name: 'Alice Smith',
      country_code: '+91',
      email: 'alice@example.com',
      paymail: 'alice@neucron.io',
      phone_number: '9876543210',
    },
  ],
});
```

---

## `getLedgerList`

List ledger entries (optionally filtered by status).

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `status` | `string[]` | No | Body | Status filters |
| `walletID` | `string` | No | Query | Wallet filter |
| `pageNumber` | `number` | No | Query | Page (default 1) |
| `pageSize` | `number` | No | Query | Size (default 5) |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "walletID": "wal_def456",
  "pageNumber": 1,
  "pageSize": 10,
  "status": ["MINTED", "DEPLOYED"],
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "list": [
    {
      "asset_id": "asset_util001",
      "asset_name": "Loyalty Points",
      "status": "MINTED",
      "amount": 1000
    }
  ],
  "page_meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

```typescript
const { data } = await sdk.assets.getLedgerList({
  walletID: 'wal_def456',
  pageNumber: 1,
  pageSize: 10,
  status: ['MINTED', 'DEPLOYED'],
});
```

---

## `getAssetList`

List assets with search and filters.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `searchQuery` | `string` | No | Query | Search text |
| `status` | `DRAFTED \| MINTED \| EXPIRED \| DEPLOYED` | No | Query | Status |
| `type` | Asset type enum | No | Query | Asset type |
| `walletID` | `string` | No | Query | Wallet filter |
| `pageNumber` | `number` | No | Query | Page |
| `pageSize` | `number` | No | Query | Size |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "searchQuery": "Loyalty",
  "status": "MINTED",
  "type": "UTILITY",
  "walletID": "wal_def456",
  "pageNumber": 1,
  "pageSize": 20,
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "list": [
    {
      "asset_id": "asset_util001",
      "asset_name": "Loyalty Points",
      "asset_type": "UTILITY",
      "status": "MINTED",
      "symbol": "LOYAL"
    }
  ],
  "page_meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

```typescript
const { data } = await sdk.assets.getAssetList({
  status: 'MINTED',
  type: 'UTILITY',
  pageNumber: 1,
  pageSize: 20,
});
```

---

## `getPublicAssetList`

List public assets.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `pageSize` | `number` | No | Query | Default 100 |
| `searchQuery` | `string` | No | Query | Search |
| `type` | `string` | No | Query | Type filter |
| `pageNumber` | `number` | No | Query | Page |
| `network` | `string` | No | Query | Network |
| `chain` | `string` | No | Query | Chain |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "pageSize": 50,
  "pageNumber": 1,
  "type": "UTILITY",
  "network": "MAIN",
  "chain": "BSV",
  "searchQuery": "Loyalty"
}
```

### Response Payload

```json
{
  "list": [
    {
      "asset_id": "asset_util001",
      "asset_name": "Loyalty Points",
      "symbol": "LOYAL",
      "scope": "public"
    }
  ]
}
```

```typescript
const { data } = await sdk.assets.getPublicAssetList({
  pageSize: 50,
  type: 'UTILITY',
  network: 'MAIN',
});
```

---

## `getLedgerDetails`

Fetch ledger details for an asset.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query | Asset ID |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "assetID": "asset_util001"
}
```

### Response Payload

```json
{
  "asset_id": "asset_util001",
  "entries": [
    {
      "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      "amount": 100,
      "type": "TRANSFER",
      "timestamp": "2026-07-01T10:30:00Z"
    }
  ]
}
```

```typescript
const { data } = await sdk.assets.getLedgerDetails({ assetID: 'asset_util001' });
```

---

## `getAssetStats`

Aggregate asset counts for the authenticated user.

| | |
| --- | --- |
| **Parameters** | None |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
null
```

### Response Payload

```json
{
  "total": 12,
  "totalActiveAssets": 8,
  "totalDraftedAssets": 3,
  "totalExpiredAssets": 1
}
```

```typescript
const { data } = await sdk.assets.getAssetStats();
```

---

## `getBalances`

Get wallet balances (fiat totals and per-asset).

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `walletID` | `string` | Yes | Query | Wallet ID |
| `network` | `'MAIN' \| 'TEST'` | No | Query | Network |
| `currency` | `string` | No | Query | Fiat currency |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "walletID": "wal_def456",
  "network": "MAIN",
  "currency": "INR",
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "total_balance": {
    "INR": 125000.5,
    "USD": 1500.25
  },
  "asset_balance": [
    {
      "asset_id": "asset_bsv001",
      "asset_name": "BSV",
      "balance": 0.5,
      "fiat_value": 15000
    }
  ]
}
```

```typescript
const { data } = await sdk.assets.getBalances({
  walletID: 'wal_def456',
  network: 'MAIN',
  currency: 'INR',
});
```

---

## `getOwnedAssetDetails`

Details for an asset owned by a wallet.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query | Asset ID |
| `walletID` | `string` | Yes | Query | Wallet ID |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "assetID": "asset_util001",
  "walletID": "wal_def456",
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "asset_id": "asset_util001",
  "wallet_id": "wal_def456",
  "balance": 500,
  "utxos": [
    {
      "utxo_id": "utxo_abc123",
      "amount": 500
    }
  ]
}
```

```typescript
const { data } = await sdk.assets.getOwnedAssetDetails({
  assetID: 'asset_util001',
  walletID: 'wal_def456',
});
```

---

## `getEventDetails`

Fetch event metadata by event ID.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `eventId` | `string` | Yes | Query (`eventID`) | Event ID |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "eventId": "evt_concert001",
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "event_id": "evt_concert001",
  "name": "Summer Concert 2026",
  "venue": "Bengaluru Arena",
  "starts_at": "2026-08-15T18:00:00Z",
  "asset_id": "asset_ticket001"
}
```

```typescript
const { data } = await sdk.assets.getEventDetails({
  eventId: 'evt_concert001',
});
```
