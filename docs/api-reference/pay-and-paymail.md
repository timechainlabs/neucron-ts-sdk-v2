# Pay & Paymail API

## Pay Service — `sdk.pay`

Send payments using address, email, or Paymail as the destination type. All pay methods route through the asset transfer endpoint.

---

### `payWithAddress(options)`

Pay to a blockchain address.

**HTTP:** `POST /asset/transfer?walletID={id}`

### `payWithEmail(options)`

Pay to an email address (resolves to recipient wallet).

### `payWithPaymail(options)`

Pay to a Paymail address (e.g., `user@paymail.com`).

### Parameters — `PayRequestInput`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletID` | `string` | Yes | Source wallet ID |
| `assetName` | `string` | Yes | Asset name key (mapped to `asset_id` internally) |
| `transfer_destinations` | `array` | Yes | Destinations with amounts |

The SDK resolves `assetName` to an internal `asset_id` via `ASSET_IDS` constants. Unsupported asset names throw an error before the API call.

### Example

```typescript
await sdk.pay.payWithPaymail({
  walletID: 'wal_123',
  assetName: 'BSV',
  transfer_destinations: [
    {
      paymail: 'recipient@paymail.com',
      amount: 0.001,
    },
  ],
});
```

---

## Paymail Service — `sdk.paymail`

Manage Paymail aliases associated with wallets.

---

### `createPaymail(options)`

Create a new Paymail alias.

**HTTP:** `POST /paymail/create`

### Parameters — `CreatePaymailBody`

Includes wallet ID and desired Paymail alias. See exported type for full schema.

---

### `paymailList(options)`

List Paymail aliases for a wallet.

**HTTP:** `GET /paymail/list`

---

### `updateDefaultPaymail(options)`

Set a Paymail alias as the default for a wallet.

**HTTP:** `PUT /paymail/default`

---

### `deletePaymail(options)`

Delete a Paymail alias.

**HTTP:** `DELETE /paymail/delete`

### Example

```typescript
// Create alias
await sdk.paymail.createPaymail({
  walletID: 'wal_123',
  paymailName: 'myalias',
});

// List aliases
const aliases = await sdk.paymail.paymailList({
  walletID: 'wal_123',
});
```
