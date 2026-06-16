# Asset21 (STAS) API

**Service:** `sdk.asset21`

Interact with the STAS token protocol — deploy tokens, manage customers, transfer assets, and sync blockchain state.

---

## Address & Balance

### `getAddressState(options)`

Get the state of an Asset21 address.

**HTTP:** `GET /asset21/address`

### `fetchBalance(options)`

Fetch token balance for an address.

**HTTP:** `GET /asset21/balance`

### `getSystemConfig(options)`

Retrieve system configuration for Asset21.

**HTTP:** `GET /asset21/config`

---

## Customers

### `getCustomers(options)`

List Asset21 customers.

**HTTP:** `GET /asset21/customers`

---

## Token Lifecycle

### `deploy(options)`

Deploy a new STAS token contract.

**HTTP:** `POST /asset21/deploy`

### `register(options)`

Register a token with the Asset21 system.

**HTTP:** `POST /asset21/register`

---

## Requests

### `createRequest(options)`

Create a new Asset21 request.

**HTTP:** `POST /asset21/request`

### `updateRequest(options)`

Update an existing request.

**HTTP:** `PUT /asset21/request`

### `getRequest(options)`

Get request details.

**HTTP:** `GET /asset21/request`

---

## Sync & Transfer

### `syncTransaction(options)`

Sync a specific transaction with the blockchain.

**HTTP:** `POST /asset21/sync`

### `triggerSyncForAddresses(options)`

Trigger sync for multiple addresses.

**HTTP:** `POST /asset21/sync`

### `transfer(options)`

Transfer STAS tokens.

**HTTP:** `POST /asset21/transfer`

---

## UTXOs

### `getUnspentUTXOs(options)`

List unspent UTXOs for an address.

**HTTP:** `GET /asset21/utxos`

### `getOutputInfo(options)`

Get output information for a specific outpoint.

**HTTP:** `GET /asset21`

---

## Example

```typescript
// Fetch balance for an address
const balance = await sdk.asset21.fetchBalance({
  address: '1A1zP1...',
  // additional fields per schema
});

// Transfer tokens
const transfer = await sdk.asset21.transfer({
  walletID: 'wal_123',
  // transfer payload per schema
});
```

> All Asset21 methods require authentication. Refer to exported TypeScript types (`Deploy`, `Transfer`, etc.) for full parameter schemas.
