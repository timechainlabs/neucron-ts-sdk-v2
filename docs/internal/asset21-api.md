# Service: `sdk.asset21`

Interact with the **STAS token protocol** — deploy tokens, manage customers, transfer assets, and sync blockchain state.

> **Base URL:** `https://dev.neucron.io/v1`  
> All Asset21 methods require authentication.

---

## Table of Contents

* [Quick Start](#quick-start)
* [SDK Method Index](#sdk-method-index)
* [Authentication & Headers](#authentication--headers)
* [Permissions](#permissions)
* [Address & Balance](#address--balance)
  * [getAddressState](#getaddressstate)
  * [fetchBalance](#fetchbalance)
  * [getSystemConfig](#getsystemconfig)
  * [updateSystemConfig](#updatesystemconfig-platform-extension)
* [Customers](#customers)
  * [getCustomers](#getcustomers)
* [Token Lifecycle](#token-lifecycle)
  * [register](#register)
  * [deploy](#deploy)
  * [listDeployedAssets](#listdeployedassets-platform-extension)
* [Requests](#requests)
  * [createRequest](#createrequest)
  * [getRequest](#getrequest)
  * [updateRequest](#updaterequest)
* [Sync & Transfer](#sync--transfer)
  * [syncTransaction](#synctransaction)
  * [triggerSyncForAddresses](#triggersyncforaddresses)
  * [transfer](#transfer)
* [UTXOs](#utxos)
  * [getUnspentUTXOs](#getunspentutxos)
  * [getOutputInfo](#getoutputinfo)
* [Analytics](#analytics-platform-extension)
  * [getAnalytics](#getanalytics)
* [Reference](#reference)
  * [Request States](#request-states)
  * [Request Statuses](#request-statuses)
  * [Amount Formatting](#amount-formatting)
  * [Error Responses](#error-responses)
  * [Full API Summary](#full-api-summary)

---

## Quick Start

```typescript
import { sdk } from '@neucron/sdk';

// Fetch balance for an address
const balance = await sdk.asset21.fetchBalance({
  address: '1A1zP1...',
  assetID: 'asset-uuid',
});

// Transfer tokens
const transfer = await sdk.asset21.transfer({
  walletID: 'wal_123',
  fromAddress: '1Sender...',
  toAddress: '1Receiver...',
  amount: '1000000',
});

// Create a mint request
const request = await sdk.asset21.createRequest({
  assetId: 'asset-uuid',
  state: 'MINT',
  requestDetails: {
    address: '1Customer...',
    amount: '1000000',
  },
});
```

{% hint style="info" %}
Refer to exported TypeScript types (`Deploy`, `Transfer`, `RaiseRequestPayload`, etc.) for full parameter schemas.
{% endhint %}

---

## SDK Method Index

| SDK Method | HTTP | Endpoint | Section |
|------------|------|----------|---------|
| `getAddressState(options)` | `GET` | `/asset21/address` | [Address & Balance](#getaddressstate) |
| `fetchBalance(options)` | `GET` | `/asset21/balance` | [Address & Balance](#fetchbalance) |
| `getSystemConfig(options)` | `GET` | `/asset21/config` | [Address & Balance](#getsystemconfig) |
| `getCustomers(options)` | `GET` | `/asset21/customers` | [Customers](#getcustomers) |
| `register(options)` | `POST` | `/asset21/register` | [Token Lifecycle](#register) |
| `deploy(options)` | `POST` | `/asset21/deploy` | [Token Lifecycle](#deploy) |
| `createRequest(options)` | `POST` | `/asset21/request` | [Requests](#createrequest) |
| `getRequest(options)` | `GET` | `/asset21/request` | [Requests](#getrequest) |
| `updateRequest(options)` | `PUT` | `/asset21/request` | [Requests](#updaterequest) |
| `syncTransaction(options)` | `POST` | `/asset21/sync` | [Sync & Transfer](#synctransaction) |
| `triggerSyncForAddresses(options)` | `POST` | `/asset21/sync` | [Sync & Transfer](#triggersyncforaddresses) |
| `transfer(options)` | `POST` | `/asset21/transfer` | [Sync & Transfer](#transfer) |
| `getUnspentUTXOs(options)` | `GET` | `/asset21/utxos` | [UTXOs](#getunspentutxos) |
| `getOutputInfo(options)` | `GET` | `/asset21/{outpoint}` | [UTXOs](#getoutputinfo) |

### Platform Extensions (Stablecoin UI)

| Method / Usage | HTTP | Endpoint | Section |
|----------------|------|----------|---------|
| Update config | `PUT` | `/asset21/config` | [updateSystemConfig](#updatesystemconfig-platform-extension) |
| Dashboard analytics | `GET` | `/asset21/analytics` | [getAnalytics](#getanalytics) |
| List deployed assets | `GET` | `/asset/assetlist` | [listDeployedAssets](#listdeployedassets-platform-extension) |

{% hint style="warning" %}
**Platform vs SDK HTTP methods:** The Stablecoin Platform frontend may call some endpoints with a different HTTP verb than the canonical SDK (e.g. `POST` instead of `GET` for balance/UTXOs, `GET` instead of `POST` for sync). Both variants are documented below. Prefer the **SDK method** when integrating via `@neucron/sdk`.
{% endhint %}

---

## Authentication & Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Auth token from login |
| `X-Neucron-Business-ID` | Most endpoints | Active business/team ID |
| `Content-Type` | POST/PUT | `application/json` |
| `Accept` | Yes | `application/json` |

```http
Authorization: <auth_token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
Content-Type: application/json
```

---

## Permissions

| Permission | Description |
|------------|-------------|
| `asset21:view` | View dashboard, tokens, customers, transactions |
| `asset21:create` | Register new tokens |
| `asset21:deploy` | Deploy registered tokens on-chain |
| `asset21:request` | Create and act on workflow requests |
| `asset21:config` | View and update token configuration |

---

# Address & Balance

## getAddressState

Get the state of an Asset21 address (blacklist, freeze, balance metadata, etc.).

| | |
|---|---|
| **SDK** | `sdk.asset21.getAddressState(options)` |
| **HTTP** | `GET /v1/asset21/address` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | Blockchain address to inspect |
| `assetID` | `string` | Yes | Asset identifier |

### SDK Example

```typescript
const state = await sdk.asset21.getAddressState({
  address: '1A1zP1...',
  assetID: 'asset-uuid',
});
```

### Request Example

```http
GET /v1/asset21/address?address=1A1zP1...&assetID=asset-uuid
Authorization: <token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
```

### Response Body

```json
{
  "address": "1A1zP1...",
  "assetId": "asset-uuid",
  "balance": "1000000",
  "frozen": false,
  "blacklisted": false
}
```

---

## fetchBalance

Fetch token balance for one or more addresses.

| | |
|---|---|
| **SDK** | `sdk.asset21.fetchBalance(options)` |
| **HTTP (SDK)** | `GET /v1/asset21/balance` |
| **HTTP (Platform)** | `POST /v1/asset21/balance` |

### SDK — Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | Address to query |
| `assetID` | `string` | No | Filter by asset |

### SDK Example

```typescript
const balance = await sdk.asset21.fetchBalance({
  address: '1A1zP1...',
  assetID: 'asset-uuid',
});
```

### SDK Request Example

```http
GET /v1/asset21/balance?address=1A1zP1...&assetID=asset-uuid
Authorization: <token>
Accept: application/json
```

### Platform — Request Body (`POST`)

Used by `BlockchainService.getBalances()` when querying multiple addresses:

```json
{
  "addresses": [
    "1AddressA...",
    "1AddressB..."
  ]
}
```

### Response Body

```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "address": "1AddressA...",
        "balance": "1000000",
        "confirmed": "1000000",
        "unconfirmed": "0"
      }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `balance` | `string` | Total balance in smallest on-chain unit |
| `confirmed` | `string` | Confirmed balance |
| `unconfirmed` | `string` | Unconfirmed (mempool) balance |

---

## getSystemConfig

Retrieve system configuration for an Asset21 token.

| | |
|---|---|
| **SDK** | `sdk.asset21.getSystemConfig(options)` |
| **HTTP** | `GET /v1/asset21/config` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetID` | `string` | Yes* | Asset identifier |

\* Required when fetching config for a specific deployed token.

### SDK Example

```typescript
const config = await sdk.asset21.getSystemConfig({
  assetID: 'asset-uuid',
});
```

### Request Example

```http
GET /v1/asset21/config?assetID=asset-uuid
Authorization: <token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
```

### Response Body

```json
{
  "approver": "approver-address-or-id",
  "assetId": "asset-uuid",
  "burnAddress": "burn-address",
  "decimals": 6,
  "feeAddress": "fee-collection-address",
  "fees": [
    { "fee": "100", "min": "0", "max": "1000000" }
  ],
  "holder_identity_config": {
    "kyb_level": 1,
    "kyc_level": 1
  },
  "mintAddress": "mint-address",
  "minterHex": "minter-hex",
  "paused": false,
  "request_config": {
    "min_approval": 1,
    "min_rejection": 1
  },
  "symbol": "MSC",
  "tokenId": "on-chain-token-id"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `paused` | `boolean` | Whether the token chain is paused |
| `decimals` | `number` | Token decimal precision |
| `fees` | `array` | Fee tiers in smallest on-chain units |
| `request_config.min_approval` | `number` | Approvals required to execute requests |
| `request_config.min_rejection` | `number` | Rejections required to cancel requests |
| `mintAddress` | `string` | Mint destination address |
| `burnAddress` | `string` | Burn address |
| `feeAddress` | `string` | Fee collection address |

---

## updateSystemConfig (Platform Extension)

Update fee structure and approval rules. Used by the Stablecoin Settings page.

| | |
|---|---|
| **HTTP** | `PUT /v1/asset21/config` |
| **Permission** | `asset21:config` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetID` | `string` | Yes | Asset to update |

### Request Body

```json
{
  "fees": [
    { "fee": "100", "min": "0", "max": "1000000" }
  ],
  "request_config": {
    "min_approval": 1,
    "min_rejection": 1
  }
}
```

{% hint style="warning" %}
`fee`, `min`, and `max` must be sent in the token's **smallest on-chain unit** (raw integer), not human-readable decimals.
{% endhint %}

### Response Body

```json
{ "message": "Configuration has been updated successfully." }
```

---

# Customers

## getCustomers

List Asset21 customers for a deployed asset.

| | |
|---|---|
| **SDK** | `sdk.asset21.getCustomers(options)` |
| **HTTP** | `GET /v1/asset21/customers` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetID` | `string` | Yes | Asset identifier |

### SDK Example

```typescript
const customers = await sdk.asset21.getCustomers({
  assetID: 'asset-uuid',
});
```

### Request Example

```http
GET /v1/asset21/customers?assetID=asset-uuid
Authorization: <token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
```

### Response Body

```json
[
  {
    "address": "1CustomerAddress...",
    "asset_id": "asset-uuid",
    "email": "customer@example.com",
    "paymail": "customer@paymail",
    "name": "Customer Name",
    "total_amount": 500000000,
    "total_tx": 12
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `address` | `string` | Customer wallet address |
| `email` | `string` | Customer email |
| `paymail` | `string` | Paymail alias |
| `name` | `string` | Display name |
| `total_amount` | `number` | Total balance (smallest unit) |
| `total_tx` | `number` | Transaction count |

---

# Token Lifecycle

## register

Register a token with the Asset21 system before on-chain deployment.

| | |
|---|---|
| **SDK** | `sdk.asset21.register(options)` |
| **HTTP** | `POST /v1/asset21/register` |
| **Permission** | `asset21:create` |

### Request Body

```json
{
  "asset_name": "My Stablecoin",
  "asset_type": "STABLECOIN",
  "decimals": 6,
  "image_url": "https://example.com/icon.png",
  "legal_term": "Legal terms text",
  "symbol": "MSC",
  "wallet_id": "wallet-uuid",
  "token_detail": {
    "icon": "https://example.com/icon.png",
    "feeStructure": [
      { "fee": "100", "min": "0", "max": "1000000" }
    ],
    "holder_identity_config": {
      "kyb_level": 1,
      "kyc_level": 1
    },
    "request_config": {
      "min_approval": 1,
      "min_rejection": 1
    }
  },
  "network": "MAIN",
  "currency": "USD",
  "price": 100
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `asset_name` | `string` | Yes | Token display name |
| `symbol` | `string` | Yes | Token symbol |
| `decimals` | `number` | Yes | Decimal places |
| `image_url` | `string` | Yes | Token image URL |
| `legal_term` | `string` | Yes | Legal terms |
| `wallet_id` | `string` | Yes | Wallet for deployment |
| `token_detail` | `object` | Yes | Fees, identity config, approval rules |
| `network` | `string` | Yes | `MAIN` or `TEST` |
| `asset_type` | `string` | No | Asset classification |
| `currency` | `string` | No | Fiat currency code |
| `price` | `number` | No | Price in smallest unit |

### SDK Example

```typescript
const result = await sdk.asset21.register({
  asset_name: 'My Stablecoin',
  symbol: 'MSC',
  decimals: 6,
  wallet_id: 'wallet-uuid',
  network: 'MAIN',
  // ...remaining fields
});
```

### Response Body

```json
{ "assetID": "newly-created-asset-uuid" }
```

---

## deploy

Deploy a new STAS token contract on-chain.

| | |
|---|---|
| **SDK** | `sdk.asset21.deploy(options)` |
| **HTTP** | `POST /v1/asset21/deploy` |
| **Permission** | `asset21:deploy` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetID` | `string` | Yes | Asset ID from `register` |

### Request Body

No body required.

### SDK Example

```typescript
const result = await sdk.asset21.deploy({
  assetID: 'asset-uuid',
});
```

### Request Example

```http
POST /v1/asset21/deploy?assetID=asset-uuid
Authorization: <token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
```

### Response Body

```json
{ "txid": "on-chain-transaction-id" }
```

---

## listDeployedAssets (Platform Extension)

List all deployed assets for the active business. Not part of `sdk.asset21` namespace — uses the Asset service.

| | |
|---|---|
| **HTTP** | `GET /v1/asset/assetlist` |
| **Permission** | `asset21:view` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | `string` | Yes | Filter by status. Platform uses `DEPLOYED` |

### Response Body

```json
{
  "list": [
    {
      "asset_id": "asset-uuid",
      "asset_name": "My Stablecoin",
      "symbol": "MSC",
      "decimals": 6,
      "status": "DEPLOYED",
      "wallet_id": "wallet-uuid",
      "token_detail": {
        "request_config": { "min_approval": 1, "min_rejection": 1 }
      }
    }
  ],
  "page_meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "next_page": null,
    "total_pages": 1
  }
}
```

---

# Requests

Multi-approval workflow API for mint, redeem, customer onboarding, pause/resume, blacklist, and freeze operations.

## createRequest

Create a new Asset21 request.

| | |
|---|---|
| **SDK** | `sdk.asset21.createRequest(options)` |
| **HTTP** | `POST /v1/asset21/request` |
| **Permission** | `asset21:request` |

### Request Body

```json
{
  "assetId": "asset-uuid",
  "state": "MINT",
  "requestDetails": {
    "address": "customer-wallet-address",
    "amount": "1000000",
    "email": "user@example.com",
    "name": "Customer Name",
    "paymail": "alias@paymail",
    "UtxoId": "txid_vout"
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assetId` | `string` | Yes | Target asset ID |
| `state` | `RequestState` | Yes | Request type — see [Request States](#request-states) |
| `requestDetails` | `object` | Yes | Payload varies by `state` |

### `requestDetails` by State

| State | Required Fields | Optional Fields |
|-------|-----------------|-----------------|
| `CUSTOMER` | — | `address`, `email`, `paymail`, `name` |
| `MINT` | `address`, `amount` | — |
| `REDEEM` | `UtxoId`, `amount` | `address` (refund) |
| `PAUSE` | — | `email` |
| `RESUME` | — | `email` |
| `BLACKLIST` | `address` | `email` |
| `UNBLACKLIST` | `address` | `email` |
| `FREEZE` | `address` | `email` |
| `UNFREEZE` | `address` | `email` |

### SDK Example — Mint

```typescript
await sdk.asset21.createRequest({
  assetId: 'asset-uuid',
  state: 'MINT',
  requestDetails: {
    address: '1Customer...',
    amount: '1000000',
  },
});
```

### SDK Example — Customer Onboarding

```typescript
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

### Response Body

```json
{ "message": "Request created successfully" }
```

---

## getRequest

Get request details. Supports listing and filtering with pagination.

| | |
|---|---|
| **SDK** | `sdk.asset21.getRequest(options)` |
| **HTTP** | `GET /v1/asset21/request` |
| **Permission** | `asset21:view` / `asset21:request` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetID` | `string` | Yes | Asset identifier |
| `page` | `number` | Yes | Page number (1-based) |
| `size` | `number` | Yes | Page size |
| `state` | `RequestState` | No | Filter by request type |
| `status` | `RequestStatus` | No | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED` |

### SDK Example

```typescript
const requests = await sdk.asset21.getRequest({
  assetID: 'asset-uuid',
  page: 1,
  size: 100,
  state: 'MINT',
  status: 'PENDING',
});
```

### Request Example

```http
GET /v1/asset21/request?assetID=asset-uuid&page=1&size=100&state=MINT&status=PENDING
Authorization: <token>
X-Neucron-Business-ID: <business_id>
Accept: application/json
```

### Response Body

```json
[
  {
    "requestId": "request-uuid",
    "assetId": "asset-uuid",
    "state": "MINT",
    "status": "PENDING",
    "created_by": "user-id",
    "createdAt": "2026-05-26T10:00:00.000Z",
    "updatedAt": "2026-05-26T10:00:00.000Z",
    "approvalsRequired": 1,
    "rejectionsRequired": 1,
    "currentApprovals": 0,
    "currentRejections": 0,
    "approvers": null,
    "rejectors": null,
    "requestDetails": {
      "address": "1CustomerAddress...",
      "amount": "1000000"
    }
  }
]
```

---

## updateRequest

Update an existing request — approve or reject.

| | |
|---|---|
| **SDK** | `sdk.asset21.updateRequest(options)` |
| **HTTP** | `PUT /v1/asset21/request` |
| **Permission** | `asset21:request` |

### Request Body

```json
{
  "action": "APPROVE",
  "assetId": "asset-uuid",
  "requestId": "request-uuid"
}
```

### Request Fields

| Field | Type | Required | Values | Description |
|-------|------|----------|--------|-------------|
| `action` | `string` | Yes | `APPROVE`, `REJECT` | Action to perform |
| `assetId` | `string` | Yes | — | Asset the request belongs to |
| `requestId` | `string` | Yes | — | Request to update |

### SDK Example

```typescript
await sdk.asset21.updateRequest({
  action: 'APPROVE',
  assetId: 'asset-uuid',
  requestId: 'request-uuid',
});
```

### Response Body

```json
{ "message": "Request approved successfully" }
```

---

# Sync & Transfer

## syncTransaction

Sync a specific transaction with the blockchain for an asset.

| | |
|---|---|
| **SDK** | `sdk.asset21.syncTransaction(options)` |
| **HTTP (SDK)** | `POST /v1/asset21/sync` |
| **HTTP (Platform)** | `GET /v1/asset21/sync` |

### SDK — Request Body

```json
{
  "assetID": "asset-uuid",
  "txid": "transaction-id"
}
```

### SDK Example

```typescript
await sdk.asset21.syncTransaction({
  assetID: 'asset-uuid',
  txid: 'abc123...',
});
```

### Platform — Query Parameters (`GET`)

Used by the Transactions page (`BlockchainService.syncAssetTransactions`):

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `assetID` | `string` | Yes | — | Asset identifier |
| `from` | `string` | No | `0` | Pagination offset |
| `limit` | `string` | No | `1000` | Max records |
| `action` | `string` | No | — | Filter: `mint`, `redeem`, `transfer`, etc. |

### Platform Request Example

```http
GET /v1/asset21/sync?assetID=asset-uuid&from=0&limit=1000&action=mint
Authorization: <token>
Accept: application/json
```

### Response Body

```json
[
  {
    "txid": "transaction-id",
    "height": 850000,
    "idx": 0,
    "outs": [0, 1],
    "rawtx": "raw-transaction-hex",
    "receivers": ["1ReceiverAddress..."],
    "senders": ["1SenderAddress..."],
    "score": 1
  }
]
```

---

## triggerSyncForAddresses

Trigger blockchain sync for multiple addresses.

| | |
|---|---|
| **SDK** | `sdk.asset21.triggerSyncForAddresses(options)` |
| **HTTP** | `POST /v1/asset21/sync` |

### Request Body

```json
{
  "assetID": "asset-uuid",
  "addresses": [
    "1AddressA...",
    "1AddressB..."
  ]
}
```

### SDK Example

```typescript
await sdk.asset21.triggerSyncForAddresses({
  assetID: 'asset-uuid',
  addresses: ['1AddressA...', '1AddressB...'],
});
```

### Response Body

```json
{
  "message": "Sync triggered successfully",
  "synced": 2
}
```

---

## transfer

Transfer STAS tokens between addresses.

| | |
|---|---|
| **SDK** | `sdk.asset21.transfer(options)` |
| **HTTP** | `POST /v1/asset21/transfer` |
| **Permission** | `asset21:request` |

### Request Body

```json
{
  "walletID": "wal_123",
  "tokenAddress": "token-contract-or-id",
  "fromAddress": "1SenderAddress...",
  "toAddress": "1ReceiverAddress...",
  "amount": "1000000",
  "metadata": {}
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletID` | `string` | Yes | Source wallet ID |
| `fromAddress` | `string` | Yes | Sender address |
| `toAddress` | `string` | Yes | Receiver address |
| `amount` | `string` | Yes | Amount in smallest on-chain unit |
| `tokenAddress` | `string` | No | Token contract/ID |
| `metadata` | `object` | No | Optional metadata |

### SDK Example

```typescript
const transfer = await sdk.asset21.transfer({
  walletID: 'wal_123',
  fromAddress: '1Sender...',
  toAddress: '1Receiver...',
  amount: '1000000',
});
```

### Response Body

```json
{
  "success": true,
  "data": {
    "transactionHash": "tx-hash",
    "transferId": "transfer-uuid",
    "status": "pending",
    "amount": "1000000",
    "fromAddress": "1SenderAddress...",
    "toAddress": "1ReceiverAddress..."
  }
}
```

---

# UTXOs

## getUnspentUTXOs

List unspent UTXOs for an address.

| | |
|---|---|
| **SDK** | `sdk.asset21.getUnspentUTXOs(options)` |
| **HTTP (SDK)** | `GET /v1/asset21/utxos` |
| **HTTP (Platform)** | `POST /v1/asset21/utxos` |

### SDK — Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | `string` | Yes | Owner address |
| `assetID` | `string` | No | Filter by asset |

### SDK Example

```typescript
const utxos = await sdk.asset21.getUnspentUTXOs({
  address: '1Address...',
  assetID: 'asset-uuid',
});
```

### SDK Request Example

```http
GET /v1/asset21/utxos?address=1Address...&assetID=asset-uuid
Authorization: <token>
Accept: application/json
```

### Platform — Request Body (`POST`)

```json
{
  "addresses": ["1AddressA..."],
  "includeMempool": false
}
```

{% hint style="info" %}
The Mint & Burn page may also send a plain address array as the POST body. Optional query param: `?assetID=<asset_id>`.
{% endhint %}

### Response Body

**Array format:**

```json
[
  {
    "outpoint": "txid_0",
    "txid": "txid",
    "vout": 0,
    "address": "1Address...",
    "amount": "500000",
    "confirmations": 6,
    "height": 850000,
    "scriptPubKey": "script-hex"
  }
]
```

**Wrapped format:**

```json
{
  "utxos": [
    {
      "txid": "txid",
      "vout": 0,
      "address": "1Address...",
      "amount": "500000",
      "confirmations": 6,
      "scriptPubKey": "script-hex"
    }
  ],
  "totalAmount": "500000"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `outpoint` | `string` | `{txid}_{vout}` |
| `amount` | `string` | Smallest on-chain unit |
| `confirmations` | `number` | Block confirmations |

---

## getOutputInfo

Get output information for a specific outpoint.

| | |
|---|---|
| **SDK** | `sdk.asset21.getOutputInfo(options)` |
| **HTTP** | `GET /v1/asset21/{outpoint}` |

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `outpoint` | `string` | Yes | Outpoint (`txid:vout` or `txid_vout`, URL-encoded) |

### SDK Example

```typescript
const output = await sdk.asset21.getOutputInfo({
  outpoint: 'abc123txid:0',
});
```

### Request Example

```http
GET /v1/asset21/abc123txid%3A0
Authorization: <token>
Accept: application/json
```

### Response Body

```json
{
  "success": true,
  "data": {
    "output": {
      "txid": "abc123txid",
      "vout": 0,
      "address": "1Address...",
      "amount": "500000",
      "scriptPubKey": "script-hex",
      "confirmations": 6,
      "spent": false,
      "height": 850000
    }
  }
}
```

---

# Analytics (Platform Extension)

## getAnalytics

Dashboard analytics for a deployed asset. Used by the Stablecoin Dashboard — not part of the core `sdk.asset21` index.

| | |
|---|---|
| **HTTP** | `GET /v1/asset21/analytics` |
| **Permission** | `asset21:view` |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `assetID` | `string` | Yes | — | Asset identifier |
| `limit` | `string` | No | `10` | Graph data points |
| `graphRange` | `string` | No | `month` | Time range |

### Response Body

```json
{
  "graph_data": [
    {
      "mint_count": 5,
      "mint_volume": 9323372036854776000000000,
      "redeem_count": 2,
      "redeem_volume": 0,
      "timestamp": "2026-05-26T00:00:00.000Z",
      "transfer_count": 10,
      "transfer_volume": 18446744073709556000
    }
  ],
  "pending_operations": 3,
  "total_customers": 42,
  "total_supply": 1000000000000
}
```

---

# Reference

## Request States

| State | Description | `requestDetails` |
|-------|-------------|------------------|
| `CUSTOMER` | Onboard a customer | `address`, `email`, `paymail` |
| `MINT` | Mint tokens | `address`, `amount` |
| `REDEEM` | Burn/redeem from UTXO | `UtxoId`, `amount`, `address` |
| `PAUSE` | Pause chain | `email` |
| `RESUME` | Resume chain | `email` |
| `BLACKLIST` | Blacklist address | `address`, `email` |
| `UNBLACKLIST` | Remove blacklist | `address`, `email` |
| `FREEZE` | Freeze address | `address`, `email` |
| `UNFREEZE` | Unfreeze address | `address`, `email` |

## Request Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Awaiting approvals |
| `APPROVED` | Fully approved and executed |
| `REJECTED` | Rejected |
| `CANCELLED` | Cancelled |

## Amount Formatting

All on-chain amounts are in the token's **smallest unit** (raw integer).

| Decimals | Human | Raw API Value |
|----------|-------|---------------|
| `6` | `1.00` | `1000000` |
| `8` | `1.00` | `100000000` |

## Error Responses

```json
{ "error": "Human-readable error message" }
```

| HTTP Status | Meaning |
|-------------|---------|
| `401` | Missing or invalid token |
| `403` | Insufficient permissions |
| `4xx` | Validation / business rule failure |
| `5xx` | Server error |

## Full API Summary

| SDK Method | HTTP | Endpoint |
|------------|------|----------|
| `getAddressState` | `GET` | `/v1/asset21/address` |
| `fetchBalance` | `GET` | `/v1/asset21/balance` |
| `getSystemConfig` | `GET` | `/v1/asset21/config` |
| `getCustomers` | `GET` | `/v1/asset21/customers` |
| `register` | `POST` | `/v1/asset21/register` |
| `deploy` | `POST` | `/v1/asset21/deploy` |
| `createRequest` | `POST` | `/v1/asset21/request` |
| `getRequest` | `GET` | `/v1/asset21/request` |
| `updateRequest` | `PUT` | `/v1/asset21/request` |
| `syncTransaction` | `POST` | `/v1/asset21/sync` |
| `triggerSyncForAddresses` | `POST` | `/v1/asset21/sync` |
| `transfer` | `POST` | `/v1/asset21/transfer` |
| `getUnspentUTXOs` | `GET` | `/v1/asset21/utxos` |
| `getOutputInfo` | `GET` | `/v1/asset21/{outpoint}` |
| *(Platform)* Update config | `PUT` | `/v1/asset21/config` |
| *(Platform)* Analytics | `GET` | `/v1/asset21/analytics` |
| *(Platform)* Asset list | `GET` | `/v1/asset/assetlist` |
| *(Platform)* Balance (bulk) | `POST` | `/v1/asset21/balance` |
| *(Platform)* UTXOs (bulk) | `POST` | `/v1/asset21/utxos` |
| *(Platform)* Sync (list) | `GET` | `/v1/asset21/sync` |

---

*Aligned with GitBook `sdk.asset21` service documentation and Stablecoin Platform implementation. Last updated: July 2026.*
