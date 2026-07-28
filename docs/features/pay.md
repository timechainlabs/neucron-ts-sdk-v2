# Pay

## What is Pay in Neucron?

The **Pay** service sends assets from a wallet to one or more destinations. The asset is selected with `assetName`, so the same methods send stablecoins such as USDC and USDT, or any other asset supported on the target network. Destinations can be:

| Method           | Destination type       | When to use                                                  |
| ---------------- | ---------------------- | ------------------------------------------------------------ |
| `payWithAddress` | Raw blockchain address | You already have an on-chain address                               |
| `payWithEmail`   | Email                  | Recipient is identified by email (Neucron resolves delivery) |
| `payWithPaymail` | Paymail                | Preferred human-readable payment address                     |

All three methods share the same input shape. The SDK maps `assetName: 'BSV'` to the platform BSV asset ID and submits a transfer from the selected wallet.

{% hint style="info" %}
Currently the Pay helpers support **BSV only** via `assetName: 'BSV'`. For other digital assets use `sdk.assets.transfer` or Asset21 transfer methods.
{% endhint %}

Access via `sdk.pay`.

---

## Shared request shape

### Parameters

| Name                    | Type     | Required | Sent as                   | Description                               |
| ----------------------- | -------- | -------- | ------------------------- | ----------------------------------------- |
| `walletID`              | `string` | No       | Query                     | Source wallet (default wallet if omitted) |
| `assetName`             | `string` | Yes      | Mapped to body `asset_id` | Asset to send, e.g. `'USDC'`, `'USDT'`    |
| `transfer_destinations` | `Array`  | Yes      | Body                      | One or more destinations                  |

### Destination variants

| Field                           | Type                   | Required     | Description        |
| ------------------------------- | ---------------------- | ------------ | ------------------ |
| `amount`                        | `number` (integer ≥ 1) | Yes          | Amount in satoshis |
| `address` / `email` / `paymail` | `string`               | Yes (one of) | Destination        |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |

### Response Payload

```json
["a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"]
```

`string[]` — one or more transaction IDs produced by the transfer.

---

## `payWithAddress`

Pay to blockchain address(es).

### Request Payload

```json
{
    "walletID": "wal_def456",
    "assetName": "BSV",
    "transfer_destinations": [
        {
            "amount": 5000,
            "address": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
        }
    ]
}
```

### Response Payload

```json
["a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"]
```

```typescript
const { data: txIds } = await sdk.pay.payWithAddress({
    walletID: 'wal_def456',
    assetName: 'BSV',
    transfer_destinations: [{ amount: 5000, address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' }],
});
```

---

## `payWithEmail`

Pay to email destination(s).

### Request Payload

```json
{
    "walletID": "wal_def456",
    "assetName": "BSV",
    "transfer_destinations": [
        {
            "amount": 2500,
            "email": "friend@example.com"
        }
    ]
}
```

### Response Payload

```json
["b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a"]
```

```typescript
const { data: txIds } = await sdk.pay.payWithEmail({
    walletID: 'wal_def456',
    assetName: 'BSV',
    transfer_destinations: [{ amount: 2500, email: 'friend@example.com' }],
});
```

---

## `payWithPaymail`

Pay to paymail destination(s).

### Request Payload

```json
{
    "walletID": "wal_def456",
    "assetName": "BSV",
    "transfer_destinations": [
        {
            "amount": 1000,
            "paymail": "alice@neucron.io"
        },
        {
            "amount": 2000,
            "paymail": "bob@neucron.io"
        }
    ]
}
```

### Response Payload

```json
["c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2"]
```

```typescript
const { data: txIds } = await sdk.pay.payWithPaymail({
    walletID: 'wal_def456',
    assetName: 'BSV',
    transfer_destinations: [
        { amount: 1000, paymail: 'alice@neucron.io' },
        { amount: 2000, paymail: 'bob@neucron.io' },
    ],
});
```
