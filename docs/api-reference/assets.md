# Assets API

**Service:** `sdk.assets`

Query asset ledgers, transfer tokens, and inspect balances and statistics.

---

## `getAssetDetails(options)`

Get detailed information about a specific asset.

**HTTP:** `GET /asset/details`

### Parameters — `AssetDetails`

| Field | Type | Required |
|-------|------|----------|
| `assetID` | `string` | Yes |
| `businessId` | `string` | No |

---

## `deleteAsset(options)`

Delete an asset from the ledger.

**HTTP:** `DELETE /asset/delete`

---

## `transfer(options)`

Transfer an asset to one or more destinations.

**HTTP:** `POST /asset/transfer`

### Parameters — `TransferAsset`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletID` | `string` | Yes | Source wallet |
| `asset_id` | `string` | Yes | Asset identifier |
| `transfer_destinations` | `array` | Yes | Destination addresses/amounts |
| `businessId` | `string` | No | Business context |

---

## `getLedgerList(options?)`

Get paginated asset ledger entries.

**HTTP:** `POST /asset/ledgerlist`

### Parameters — `LedgerList`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `pageNumber` | `number` | `1` | Page number |
| `pageSize` | `number` | `5` | Items per page |
| `walletID` | `string` | — | Filter by wallet |
| `businessId` | `string` | — | Business context |

### Example

```typescript
const ledger = await sdk.assets.getLedgerList({
  walletID: 'wal_abc123',
  pageNumber: 1,
  pageSize: 20,
});
```

---

## `getAssetList(options?)`

List all assets for the authenticated user.

**HTTP:** `GET /asset/assetlist`

---

## `getPublicAssetList(options?)`

List publicly visible assets.

**HTTP:** `GET /asset/public/assetlist`

---

## `getLedgerDetails(options)`

Get details for a specific ledger entry.

**HTTP:** `GET /asset/ledger/details`

---

## `getAssetStats()`

Get aggregate asset statistics for the user.

**HTTP:** `GET /asset/stats`

---

## `getBalances(options)`

Get asset balances for a wallet.

**HTTP:** `GET /asset/balances`

### Parameters — `Balances`

| Field | Type | Required |
|-------|------|----------|
| `walletID` | `string` | Yes |

---

## `getOwnedAssetDetails(options)`

Get owned asset details by ID.

**HTTP:** `GET /asset/owned/details`

---

## `getEventDetails(options)`

Get event/ticket details for an asset.

**HTTP:** `GET /event/details`

---

## Asset Status Values

Ledger items may have the following `status` values:

| Status | Meaning |
|--------|---------|
| `MINTED` | Newly created asset |
| `CHANGE` | Change output from a transaction |
| `CREDITED` | Received asset |
| `SPENT` | Asset spent in a transaction |
| `DEBITED` | Asset debited |
