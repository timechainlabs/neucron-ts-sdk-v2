# Paymail

## What is Paymail?

**Paymail** is a human-readable payment address for Bitcoin SV, similar to an email address (for example `alice@neucron.io`). Instead of sharing long blockchain addresses, users and businesses share a paymail that resolves to the correct wallet destination.

In Neucron:

- A wallet can have one or more paymail aliases
- One alias can be marked as the **default**
- Payments via `sdk.pay.payWithPaymail` resolve the paymail to the recipient wallet
- Paymails are useful for invoices, collection links, and peer-to-peer transfers

Access via `sdk.paymail`.

---

## `createPaymail`

Create a new paymail alias for a wallet.

### Parameters

| Name          | Type     | Required | Sent as | Description                               |
| ------------- | -------- | -------- | ------- | ----------------------------------------- |
| `paymailName` | `string` | Yes      | Query   | Local-part of the paymail                 |
| `walletID`    | `string` | No       | Query   | Target wallet (default wallet if omitted) |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |
| **Request body**  | None            |

### Request Payload

```json
{
    "paymailName": "treasury",
    "walletID": "wal_def456"
}
```

### Response Payload

```json
{
    "message": "Paymail created successfully"
}
```

```typescript
await sdk.paymail.createPaymail({
    walletID: 'wal_def456',
    paymailName: 'treasury',
});
```

---

## `paymailList`

List paymail aliases for a wallet.

### Parameters

| Name       | Type     | Required | Sent as | Description      |
| ---------- | -------- | -------- | ------- | ---------------- |
| `walletID` | `string` | No       | Query   | Filter by wallet |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |

### Request Payload

```json
{
    "walletID": "wal_def456"
}
```

### Response Payload

```json
[
    {
        "alias": "treasury",
        "wallet_id": "wal_def456",
        "is_wallet_default": true
    },
    {
        "alias": "ops",
        "wallet_id": "wal_def456",
        "is_wallet_default": false
    }
]
```

```typescript
const { data } = await sdk.paymail.paymailList({ walletID: 'wal_def456' });
```

---

## `updateDefaultPaymail`

Set the default paymail alias for a wallet.

### Parameters

| Name       | Type     | Required | Sent as | Description                   |
| ---------- | -------- | -------- | ------- | ----------------------------- |
| `alias`    | `string` | Yes      | Query   | Paymail alias to make default |
| `walletID` | `string` | No       | Query   | Wallet scope                  |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |
| **Request body**  | None            |

### Request Payload

```json
{
    "alias": "treasury",
    "walletID": "wal_def456"
}
```

### Response Payload

```json
{
    "message": "Default paymail updated"
}
```

```typescript
await sdk.paymail.updateDefaultPaymail({
    alias: 'treasury',
    walletID: 'wal_def456',
});
```

---

## `deletePaymail`

Delete a paymail alias.

### Parameters

| Name    | Type     | Required | Sent as | Description     |
| ------- | -------- | -------- | ------- | --------------- |
| `alias` | `string` | Yes      | Query   | Alias to delete |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |
| **Request body**  | None            |

### Request Payload

```json
{
    "alias": "old-alias"
}
```

### Response Payload

```json
{
    "message": "Paymail deleted successfully"
}
```

```typescript
await sdk.paymail.deletePaymail({ alias: 'old-alias' });
```
