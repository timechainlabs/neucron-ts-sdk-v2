# Asset21 (Security Tokens)

## What is Asset21?

**Asset21** is Neucron’s framework for **regulated / security-style tokens**. Unlike simple utility or certificate assets, Asset21 tokens support:

- **Registration** of token metadata and governance rules
- **On-chain deployment**
- **Customer onboarding** (who is allowed to hold the token)
- **Governance requests** for mint, redeem, pause, freeze, blacklist, and related actions
- **Multi-party approval** (`min_approval` / `min_rejection`)
- **Analytics**, UTXO inspection, and transaction sync

### Governance request states

| State | Purpose |
| --- | --- |
| `CUSTOMER` | Onboard a customer / holder |
| `MINT` | Mint new supply |
| `REDEEM` | Redeem / burn |
| `PAUSE` / `RESUME` | Pause or resume transfers |
| `FREEZE` / `UNFREEZE` | Freeze or unfreeze an address |
| `BLACKLIST` / `UNBLACKLIST` | Blacklist or clear blacklist |

### Request statuses & actions

| Status | Meaning |
| --- | --- |
| `PENDING` | Awaiting votes |
| `APPROVED` | Approved |
| `REJECTED` | Rejected |
| `CANCELLED` | Cancelled |

Actions when updating a request: `APPROVE` | `REJECT`.

Most Asset21 methods accept optional `businessId` and `teamId` (sent as headers).

Access via `sdk.asset21`.

---

## `register`

Register a new security token (off-chain registration before deploy).

### Parameters (body + context headers)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `asset_name` | `string` | Yes | Token name |
| `symbol` | `string` | Yes | Symbol |
| `decimals` | `number` | Yes | Decimals |
| `image_url` | `string` | Yes | Image URL |
| `legal_term` | `string` | Yes | Legal terms |
| `wallet_id` | `string` | Yes | Issuer wallet |
| `network` | `'MAIN' \| 'TEST'` | Yes | Network |
| `token_detail` | `object` | Yes | Icon, fees, holder identity, `request_config` |
| `asset_type` | `string` | No | Type label |
| `currency` | `string` | No | Currency |
| `price` | `number` | No | Price |
| `total_supply` | `number` | No | Supply |
| `businessId` / `teamId` | `string` | No | Context headers |

### Request Payload

```json
{
  "asset_name": "Series A Token",
  "symbol": "SAT",
  "decimals": 2,
  "image_url": "https://cdn.example.com/sat.png",
  "legal_term": "See offering memorandum",
  "wallet_id": "wallet_1",
  "network": "MAIN",
  "token_detail": {
    "icon": "https://cdn.example.com/sat-icon.png",
    "decimal": 2,
    "feeStructure": [{ "fee": "0.1", "min": "0", "max": "100" }],
    "request_config": { "min_approval": 2, "min_rejection": 1 }
  },
  "asset_type": "SECURITY",
  "currency": "USD",
  "price": 10,
  "total_supply": 1000000,
  "businessId": "biz_123",
  "teamId": "team_1"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `assetID` | `string` |

```typescript
const { data } = await sdk.asset21.register({
  asset_name: 'Series A Token',
  symbol: 'SAT',
  decimals: 2,
  image_url: 'https://cdn.example.com/sat.png',
  legal_term: 'See offering memorandum',
  wallet_id: 'wallet_1',
  network: 'MAIN',
  token_detail: {
    request_config: { min_approval: 2, min_rejection: 1 },
  },
  businessId: 'biz_123',
  teamId: 'team_1',
});
```

---

## `deploy`

Deploy a registered Asset21 token on-chain.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "businessId": "biz_123",
  "teamId": "team_1"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `txid` | `string` |

```typescript
const { data } = await sdk.asset21.deploy({ assetID: 'asset_abc', businessId: 'biz_123' });
```

---

## `listDeployedAssets`

List deployed Asset21 assets by status with pagination.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `status` | `string` | Yes | Query | Deployment status filter |
| `pageNumber` | `number` | No | Query | Page |
| `pageSize` | `number` | No | Query | Size |
| `businessId` / `teamId` | `string` | No | Headers | Context |

### Request Payload

```json
{
  "status": "DEPLOYED",
  "pageNumber": 1,
  "pageSize": 20,
  "businessId": "biz_123"
}
```

### Response (`data`)

Paginated deployed-asset list.

```typescript
const { data } = await sdk.asset21.listDeployedAssets({
  status: 'DEPLOYED',
  pageNumber: 1,
  pageSize: 20,
});
```

---

## `getAddressState`

Get balance / freeze / blacklist state for an address on an asset.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `address` | `string` | Yes | Query |
| `assetID` | `string` | Yes | Query |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "address": "1ABC...",
  "assetID": "asset_abc",
  "businessId": "biz_123"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `address` | `string` |
| `assetId` | `string` |
| `balance` | `string \| number` |
| `frozen` | `boolean` |
| `blacklisted` | `boolean` |

```typescript
const { data } = await sdk.asset21.getAddressState({
  address: '1ABC...',
  assetID: 'asset_abc',
});
```

---

## `fetchBalance`

Fetch balance for one address or a batch of addresses.

### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `address` | `string` | One of address/addresses | Single address |
| `addresses` | `string[]` | One of address/addresses | Batch |
| `assetID` | `string` | No | Asset filter |
| `businessId` / `teamId` | `string` | No | Headers |

Single-address calls use query params; batch uses a request body `{ addresses }`.

### Request Payload (single)

```json
{
  "assetID": "asset_abc",
  "address": "1ABC...",
  "businessId": "biz_123"
}
```

### Request Payload (batch)

```json
{
  "assetID": "asset_abc",
  "addresses": ["1ABC...", "1DEF..."],
  "businessId": "biz_123"
}
```

### Response (`data`)

Includes optional `success` and `data.balances[]` with `address`, `balance`, `confirmed`, `unconfirmed`.

```typescript
const { data } = await sdk.asset21.fetchBalance({
  assetID: 'asset_abc',
  addresses: ['1ABC...', '1DEF...'],
});
```

---

## `getSystemConfig`

Read token system configuration (fees, approval thresholds, mint/burn addresses).

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "businessId": "biz_123"
}
```

### Response (`data`)

Fields such as `approver`, `assetId`, `burnAddress`, `decimals`, `feeAddress`, `fees[]`, `mintAddress`, `paused`, `symbol`, `tokenId`.

---

## `updateSystemConfig`

Update token system configuration.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query |
| `fees` | `Array<{ fee, min, max }>` | No | Body |
| `request_config` | `{ min_approval, min_rejection }` | No | Body |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "fees": [{ "fee": "0.1", "min": "0", "max": "100" }],
  "request_config": {
    "min_approval": 2,
    "min_rejection": 1
  },
  "businessId": "biz_123"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `message` | `string` |

```typescript
await sdk.asset21.updateSystemConfig({
  assetID: 'asset_abc',
  request_config: { min_approval: 2, min_rejection: 1 },
});
```

---

## `getCustomers`

List onboarded customers/holders for an Asset21 token.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "businessId": "biz_123"
}
```

### Response (`data`)

Array of `{ address, asset_id?, email?, name?, paymail? }`.

```typescript
const { data: customers } = await sdk.asset21.getCustomers({ assetID: 'asset_abc' });
```

---

## `createRequest`

Create a governance request (mint, customer onboarding, freeze, etc.).

### Parameters (body)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `assetId` | `string` | Yes | Token |
| `state` | Request state enum | Yes | Operation type |
| `requestDetails` | `object` | Yes | `address`, `amount`, `email`, `name`, `paymail`, `UtxoId`, … |
| `approvalsRequired` | `number` | No | Override approvals |
| `rejectionsRequired` | `number` | No | Override rejections |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetId": "asset_abc",
  "state": "MINT",
  "requestDetails": {
    "amount": 1000,
    "address": "1ABC...",
    "email": "holder@example.com",
    "name": "Holder Name",
    "paymail": "holder@neucron.io"
  },
  "approvalsRequired": 2,
  "rejectionsRequired": 1,
  "businessId": "biz_123",
  "teamId": "team_1"
}
```

### Response (`data`)

Created request object (includes request identifiers and status fields).

```typescript
await sdk.asset21.createRequest({
  assetId: 'asset_abc',
  state: 'MINT',
  requestDetails: { amount: 1000, address: '1ABC...' },
  approvalsRequired: 2,
});
```

---

## `getRequest`

List governance requests with filters.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `assetID` | `string` | Yes | Query | Token |
| `state` | Request state | No | Query | Filter by state |
| `status` | Request status | No | Query | Filter by status |
| `page` | `number` | Yes | Query | Page |
| `size` | `number` | Yes | Query | Size |
| `businessId` / `teamId` | `string` | No | Headers | Context |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "state": "MINT",
  "status": "PENDING",
  "page": 1,
  "size": 20,
  "businessId": "biz_123"
}
```

### Response (`data`)

Paginated request list.

```typescript
const { data } = await sdk.asset21.getRequest({
  assetID: 'asset_abc',
  state: 'MINT',
  status: 'PENDING',
  page: 1,
  size: 20,
});
```

---

## `updateRequest`

Approve or reject a governance request.

### Parameters (body)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | `'APPROVE' \| 'REJECT'` | Yes | Vote |
| `assetId` | `string` | Yes | Token |
| `requestId` | `string` | Yes | Request ID |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "action": "APPROVE",
  "assetId": "asset_abc",
  "requestId": "req_1",
  "businessId": "biz_123",
  "teamId": "team_1"
}
```

### Response (`data`)

Updated request result.

```typescript
await sdk.asset21.updateRequest({
  action: 'APPROVE',
  assetId: 'asset_abc',
  requestId: 'req_1',
});
```

---

## `transfer`

Transfer Asset21 tokens.

### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `walletID` | `string` | Yes | Source wallet |
| `fromAddress` | `string` | Yes | Sender address |
| `toAddress` | `string` | Yes | Recipient address |
| `amount` | `string` | Yes | Amount |
| `assetID` | `string` | No | Query |
| `tokenAddress` | `string` | No | Token address |
| `metadata` | `object` | No | Extra metadata |
| `businessId` / `teamId` | `string` | No | Headers |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "walletID": "wallet_1",
  "fromAddress": "1FROM...",
  "toAddress": "1TO...",
  "amount": "100",
  "tokenAddress": "1TOKEN...",
  "metadata": { "note": "Secondary transfer" },
  "businessId": "biz_123"
}
```

### Response (`data`)

Transfer result payload.

```typescript
await sdk.asset21.transfer({
  assetID: 'asset_abc',
  walletID: 'wallet_1',
  fromAddress: '1FROM...',
  toAddress: '1TO...',
  amount: '100',
  businessId: 'biz_123',
});
```

---

## Sync & UTXO helpers

### `syncTransaction`

| Parameters | `assetID`, `txid`, optional `businessId` / `teamId` |
| --- | --- |
| **Body** | `{ assetID, txid }` |
| **Response** | Sync result |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "txid": "abc123def456...",
  "businessId": "biz_123"
}
```

---

### `listSyncedTransactions`

| Parameters | `assetID`, optional `from`, `limit`, `action`, context headers |
| --- | --- |
| **Response** | List of synced transactions |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "from": "0",
  "limit": 50,
  "action": "TRANSFER",
  "businessId": "biz_123"
}
```

---

### `triggerSyncForAddresses`

| Parameters | `assetID`, `addresses[]`, context headers |
| --- | --- |
| **Body** | `{ assetID, addresses }` |
| **Response** | Sync trigger result |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "addresses": ["1ABC...", "1DEF..."],
  "businessId": "biz_123"
}
```

---

### `getUnspentUTXOs`

Query unspent outputs for a single address or a batch of addresses.

### Request Payload (single)

```json
{
  "assetID": "asset_abc",
  "address": "1ABC...",
  "includeMempool": true,
  "businessId": "biz_123"
}
```

### Request Payload (batch)

```json
{
  "assetID": "asset_abc",
  "addresses": ["1ABC...", "1DEF..."],
  "includeMempool": false,
  "businessId": "biz_123"
}
```

---

### `getOutputInfo`

| Parameters | `outpoint`, optional context headers |
| --- | --- |
| **Response** | Output detail for the outpoint |

### Request Payload

```json
{
  "outpoint": "txid:0",
  "businessId": "biz_123"
}
```

---

### `getAnalytics`

| Parameters | `assetID`, optional `limit`, `graphRange`, context headers |
| --- | --- |
| **Response** | Mint / redeem / transfer analytics |

### Request Payload

```json
{
  "assetID": "asset_abc",
  "limit": 30,
  "graphRange": "30d",
  "businessId": "biz_123"
}
```

```typescript
const { data } = await sdk.asset21.getAnalytics({
  assetID: 'asset_abc',
  limit: 30,
});
```
