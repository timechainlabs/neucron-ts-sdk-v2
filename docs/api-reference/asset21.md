# Asset21 (STAS) API

**Service:** `sdk.asset21`

Interact with the STAS token protocol — deploy tokens, manage customers, transfer assets, and sync blockchain state.

> All Asset21 methods require authentication.

---

## SDK Method Index

| SDK Method | HTTP | Endpoint |
|------------|------|----------|
| `getAddressState(options)` | `GET` | `/asset21/address` |
| `fetchBalance(options)` | `GET` or `POST` | `/asset21/balance` |
| `getSystemConfig(options)` | `GET` | `/asset21/config` |
| `updateSystemConfig(options)` | `PUT` | `/asset21/config` |
| `getCustomers(options)` | `GET` | `/asset21/customers` |
| `register(options)` | `POST` | `/asset21/register` |
| `deploy(options)` | `POST` | `/asset21/deploy` |
| `listDeployedAssets(options)` | `GET` | `/asset/assetlist` |
| `createRequest(options)` | `POST` | `/asset21/request` |
| `getRequest(options)` | `GET` | `/asset21/request` |
| `updateRequest(options)` | `PUT` | `/asset21/request` |
| `syncTransaction(options)` | `POST` | `/asset21/sync` |
| `listSyncedTransactions(options)` | `GET` | `/asset21/sync` |
| `triggerSyncForAddresses(options)` | `POST` | `/asset21/sync` |
| `transfer(options)` | `POST` | `/asset21/transfer` |
| `getUnspentUTXOs(options)` | `GET` or `POST` | `/asset21/utxos` |
| `getOutputInfo(options)` | `GET` | `/asset21/{outpoint}` |
| `getAnalytics(options)` | `GET` | `/asset21/analytics` |

### Common Options

Most methods accept optional context fields:

| Field | Type | Description |
|-------|------|-------------|
| `businessId` | `string` | Sets `X-Neucron-Business-ID` |
| `teamId` | `string` | Sets `X-Neucron-Team-ID` |

---

## Address & Balance

### `getAddressState(options)`

Get the state of an Asset21 address.

**HTTP:** `GET /asset21/address`

| Parameter | Type | Required |
|-----------|------|----------|
| `address` | `string` | Yes |
| `assetID` | `string` | Yes |

```typescript
const state = await sdk.asset21.getAddressState({
  businessId: 'biz_abc123',
  address: '1A1zP1...',
  assetID: 'asset-uuid',
});
```

---

### `fetchBalance(options)`

Fetch token balance for one or more addresses.

- Single address → `GET` with `address` + `assetID` query params
- Multiple addresses → `POST` with `{ addresses: string[] }` body

```typescript
// Single address
await sdk.asset21.fetchBalance({
  address: '1A1zP1...',
  assetID: 'asset-uuid',
});

// Multiple addresses
await sdk.asset21.fetchBalance({
  assetID: 'asset-uuid',
  addresses: ['1AddressA...', '1AddressB...'],
});
```

---

### `getSystemConfig(options)`

**HTTP:** `GET /asset21/config?assetID={id}`

```typescript
const config = await sdk.asset21.getSystemConfig({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
});
```

---

### `updateSystemConfig(options)`

**HTTP:** `PUT /asset21/config?assetID={id}`

```typescript
await sdk.asset21.updateSystemConfig({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
  fees: [{ fee: '100', min: '0', max: '1000000' }],
  request_config: { min_approval: 1, min_rejection: 1 },
});
```

---

## Customers

### `getCustomers(options)`

**HTTP:** `GET /asset21/customers?assetID={id}`

```typescript
const customers = await sdk.asset21.getCustomers({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
});
```

---

## Token Lifecycle

### `register(options)`

Register a token before on-chain deployment.

**HTTP:** `POST /asset21/register`

```typescript
const result = await sdk.asset21.register({
  businessId: 'biz_abc123',
  asset_name: 'My Stablecoin',
  symbol: 'MSC',
  decimals: 6,
  image_url: 'https://example.com/icon.png',
  legal_term: 'Legal terms',
  wallet_id: 'wallet-uuid',
  network: 'MAIN',
  token_detail: {
    feeStructure: [{ fee: '100', min: '0', max: '1000000' }],
    request_config: { min_approval: 1, min_rejection: 1 },
  },
});

console.log(result.data.assetID);
```

---

### `deploy(options)`

Deploy a registered token on-chain.

**HTTP:** `POST /asset21/deploy?assetID={id}`

```typescript
const deploy = await sdk.asset21.deploy({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
});
```

---

### `listDeployedAssets(options)`

List deployed assets for the active business.

**HTTP:** `GET /asset/assetlist`

```typescript
const assets = await sdk.asset21.listDeployedAssets({
  businessId: 'biz_abc123',
  status: 'DEPLOYED',
  pageNumber: 1,
  pageSize: 10,
});
```

---

## Requests

### `createRequest(options)`

**HTTP:** `POST /asset21/request`

Request states: `CUSTOMER`, `MINT`, `REDEEM`, `PAUSE`, `RESUME`, `FREEZE`, `BLACKLIST`, `UNFREEZE`, `UNBLACKLIST`

```typescript
// Mint request
await sdk.asset21.createRequest({
  assetId: 'asset-uuid',
  state: 'MINT',
  requestDetails: {
    address: '1Customer...',
    amount: '1000000',
  },
});

// Customer onboarding
await sdk.asset21.createRequest({
  assetId: 'asset-uuid',
  state: 'CUSTOMER',
  requestDetails: {
    address: '1Customer...',
    email: 'customer@example.com',
    paymail: 'customer@paymail',
  },
});
```

---

### `getRequest(options)`

**HTTP:** `GET /asset21/request`

```typescript
const requests = await sdk.asset21.getRequest({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
  page: 1,
  size: 100,
  state: 'MINT',
  status: 'PENDING',
});
```

---

### `updateRequest(options)`

Approve or reject a request.

**HTTP:** `PUT /asset21/request`

```typescript
await sdk.asset21.updateRequest({
  action: 'APPROVE',
  assetId: 'asset-uuid',
  requestId: 'request-uuid',
});
```

---

## Sync & Transfer

### `syncTransaction(options)`

Sync a specific transaction with the blockchain.

**HTTP:** `POST /asset21/sync`

```typescript
await sdk.asset21.syncTransaction({
  assetID: 'asset-uuid',
  txid: 'abc123...',
});
```

---

### `listSyncedTransactions(options)`

List synced transactions with pagination (platform/dashboard use).

**HTTP:** `GET /asset21/sync`

```typescript
const txs = await sdk.asset21.listSyncedTransactions({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
  from: 0,
  limit: 1000,
  action: 'mint',
});
```

---

### `triggerSyncForAddresses(options)`

Trigger sync for multiple addresses.

**HTTP:** `POST /asset21/sync`

```typescript
await sdk.asset21.triggerSyncForAddresses({
  assetID: 'asset-uuid',
  addresses: ['1AddressA...', '1AddressB...'],
});
```

---

### `transfer(options)`

Transfer STAS tokens between addresses.

**HTTP:** `POST /asset21/transfer`

```typescript
const transfer = await sdk.asset21.transfer({
  walletID: 'wal_123',
  fromAddress: '1Sender...',
  toAddress: '1Receiver...',
  amount: '1000000',
  assetID: 'asset-uuid',
});
```

---

## UTXOs

### `getUnspentUTXOs(options)`

- Single address → `GET` with `address` + `assetID`
- Multiple addresses → `POST` with `{ addresses, includeMempool? }`

```typescript
const utxos = await sdk.asset21.getUnspentUTXOs({
  address: '1Address...',
  assetID: 'asset-uuid',
});
```

---

### `getOutputInfo(options)`

**HTTP:** `GET /asset21/{outpoint}`

```typescript
const output = await sdk.asset21.getOutputInfo({
  outpoint: 'txid_vout',
});
```

---

## Analytics

### `getAnalytics(options)`

Dashboard analytics for a deployed asset.

**HTTP:** `GET /asset21/analytics`

```typescript
const analytics = await sdk.asset21.getAnalytics({
  businessId: 'biz_abc123',
  assetID: 'asset-uuid',
  graphRange: 'month',
  limit: 10,
});
```

---

## Full Workflow Example

```typescript
// 1. Register token
const registered = await sdk.asset21.register({
  businessId: 'biz_abc123',
  asset_name: 'My Stablecoin',
  symbol: 'MSC',
  decimals: 6,
  image_url: 'https://example.com/icon.png',
  legal_term: 'Terms',
  wallet_id: 'wal_123',
  network: 'MAIN',
  token_detail: {
    request_config: { min_approval: 1, min_rejection: 1 },
  },
});

// 2. Deploy on-chain
await sdk.asset21.deploy({
  businessId: 'biz_abc123',
  assetID: registered.data.assetID,
});

// 3. Create mint request
await sdk.asset21.createRequest({
  assetId: registered.data.assetID,
  state: 'MINT',
  requestDetails: { address: '1Customer...', amount: '1000000' },
});

// 4. Check analytics
const stats = await sdk.asset21.getAnalytics({
  businessId: 'biz_abc123',
  assetID: registered.data.assetID,
});
```
