# Payouts

## What are payouts in Neucron?

A **payout** is an outbound payment from a business wallet to a destination (address, paymail, email, or destination wallet). Payouts power:

- Vendor / bill settlement
- Scheduled future payments (`scheduled_at`)
- App-initiated payout requests (authenticated with `appSecret`)
- Manual treasury transfers

### Typical lifecycle

1. **Create** (or create a **payout request** from an app)
2. Optionally **update** while draft
3. **Trigger** on-chain execution
4. **Confirm** and notify recipients by email
5. **List / get** for history and reconciliation

Access via `sdk.payout`.

---

## Shared payout payload fields

Used by `createPayout` / `updatePayout`:

| Field                | Type                            | Description         |
| -------------------- | ------------------------------- | ------------------- |
| `wallet_id`          | `string`                        | Source wallet       |
| `destination_wallet` | `string`                        | Destination wallet  |
| `address`            | `string`                        | Blockchain address  |
| `paymail`            | `string`                        | Paymail destination |
| `email`              | `string`                        | Email destination   |
| `asset_id`           | `string`                        | Asset to send       |
| `amount`             | `string`                        | Amount              |
| `amount_in_fiat`     | `number`                        | Fiat equivalent     |
| `currency`           | `string`                        | Fiat currency       |
| `scheduled_at`       | `string`                        | Schedule timestamp  |
| `meta`               | `{ email?, name?, note?, ... }` | Metadata            |

---

## `createPayout`

### Parameters

| Name         | Type                 | Required | Sent as |
| ------------ | -------------------- | -------- | ------- |
| `businessId` | `string`             | Yes      | Header  |
| `payload`    | Payout upsert object | Yes      | Body    |

|                   |                    |
| ----------------- | ------------------ |
| **Auth required** | Yes                |
| **Headers**       | Auth + business ID |
| **Query**         | None               |

### Request Payload

```json
{
    "businessId": "biz_123",
    "payload": {
        "wallet_id": "wallet_1",
        "paymail": "vendor@neucron.io",
        "address": "1ABC...",
        "email": "vendor@example.com",
        "destination_wallet": "wallet_2",
        "asset_id": "00000000-0000-0000-0000-000000000000",
        "amount": "10000",
        "amount_in_fiat": 100,
        "currency": "USD",
        "scheduled_at": "2026-08-01T10:00:00Z",
        "meta": {
            "name": "Vendor Retainer",
            "email": "finance@example.com",
            "note": "July retainer"
        }
    }
}
```

### Response (`data`)

| Field       | Type     |
| ----------- | -------- |
| `payout_id` | `string` |

```typescript
const { data } = await sdk.payout.createPayout({
    businessId: 'biz_123',
    payload: {
        wallet_id: 'wallet_1',
        paymail: 'vendor@neucron.io',
        asset_id: '00000000-0000-0000-0000-000000000000',
        amount: '10000',
        currency: 'USD',
        meta: { note: 'July retainer' },
    },
});
```

---

## `createPayoutRequest`

Create a payout request authenticated with an app secret (server-to-server).

### Parameters

| Name           | Type     | Required | Sent as               | Description                                                            |
| -------------- | -------- | -------- | --------------------- | ---------------------------------------------------------------------- |
| `businessId`   | `string` | Yes      | Header                | Business                                                               |
| `appSecret`    | `string` | Yes      | Header `X-App-Secret` | App secret                                                             |
| Payload fields | object   | Yes      | Body                  | `amount`, `asset_id`, sender/receiver address/email/paymail, `meta`, … |

|                   |                              |
| ----------------- | ---------------------------- |
| **Auth required** | Yes                          |
| **Headers**       | Auth + business + app secret |

### Request Payload

```json
{
    "businessId": "biz_123",
    "appSecret": "app-secret-value",
    "payload": {
        "amount": "5000",
        "amount_in_fiat": 50,
        "asset_id": "00000000-0000-0000-0000-000000000000",
        "currency": "USD",
        "sender_address": "1SEND...",
        "sender_email": "ops@example.com",
        "sender_paymail": "ops@neucron.io",
        "receiver_address": "1RECV...",
        "receiver_email": "vendor@example.com",
        "receiver_paymail": "vendor@neucron.io",
        "meta": { "note": "App-initiated payout" }
    }
}
```

### Response (`data`)

| Field       | Type     |
| ----------- | -------- |
| `payout_id` | `string` |

```typescript
await sdk.payout.createPayoutRequest({
    businessId: 'biz_123',
    appSecret: 'app-secret',
    payload: {
        amount: '5000',
        asset_id: '00000000-0000-0000-0000-000000000000',
        receiver_paymail: 'vendor@neucron.io',
    },
});
```

---

## `updatePayout`

| Parameters   | `businessId`, `payoutID`, `payload` |
| ------------ | ----------------------------------- |
| **Query**    | `payoutID`                          |
| **Response** | `{ payout_id }`                     |

### Request Payload

```json
{
    "businessId": "biz_123",
    "payoutID": "payout_1",
    "payload": {
        "amount": "12000",
        "currency": "USD",
        "paymail": "vendor@neucron.io",
        "meta": { "note": "Updated amount" }
    }
}
```

---

## `listPayouts`

### Parameters

| Name             | Type     | Required | Sent as | Description    |
| ---------------- | -------- | -------- | ------- | -------------- |
| `businessId`     | `string` | Yes      | Header  | Business       |
| `status`         | `string` | No       | Query   | Status filter  |
| `reference`      | `string` | No       | Query   | Reference      |
| `reference_type` | `string` | No       | Query   | Reference type |
| `page`           | `number` | No       | Query   | Page           |
| `limit`          | `number` | No       | Query   | Page size      |

### Request Payload

```json
{
    "businessId": "biz_123",
    "status": "PENDING",
    "reference": "bill_1",
    "reference_type": "BILL",
    "page": 1,
    "limit": 20
}
```

### Response (`data`)

| Field       | Type                  |
| ----------- | --------------------- |
| `list`      | Payout models[]       |
| `page_meta` | Pagination (optional) |

```typescript
const { data } = await sdk.payout.listPayouts({
    businessId: 'biz_123',
    status: 'PENDING',
    page: 1,
    limit: 20,
});
```

---

## `getPayout`

| Parameters   | `businessId`, `payoutID`                               |
| ------------ | ------------------------------------------------------ |
| **Query**    | `payoutID`                                             |
| **Response** | Payout model (includes `payout_id` and related fields) |

### Request Payload

```json
{
    "businessId": "biz_123",
    "payoutID": "payout_1"
}
```

---

## `triggerPayout`

Execute a payout on-chain.

| Parameters   | `businessId`, `payoutID` |
| ------------ | ------------------------ |
| **Query**    | `payoutID`               |
| **Response** | `{ tx_link?, txid? }`    |

### Request Payload

```json
{
    "businessId": "biz_123",
    "payoutID": "payout_1"
}
```

```typescript
const { data } = await sdk.payout.triggerPayout({
    businessId: 'biz_123',
    payoutID: 'payout_1',
});
```

---

## `confirmPayout`

Confirm a payout and optionally email stakeholders.

### Parameters

| Name                 | Type       | Required | Sent as |
| -------------------- | ---------- | -------- | ------- |
| `businessId`         | `string`   | Yes      | Header  |
| `payoutID`           | `string`   | Yes      | Query   |
| `payload.emails`     | `string[]` | No       | Body    |
| `payload.cc` / `bcc` | `string[]` | No       | Body    |
| `payload.note`       | `string`   | No       | Body    |

### Request Payload

```json
{
    "businessId": "biz_123",
    "payoutID": "payout_1",
    "payload": {
        "emails": ["finance@example.com"],
        "cc": ["ops@example.com"],
        "bcc": ["audit@example.com"],
        "note": "Payment completed"
    }
}
```

### Response (`data`)

| Field     | Type     |
| --------- | -------- |
| `message` | `string` |

```typescript
await sdk.payout.confirmPayout({
    businessId: 'biz_123',
    payoutID: 'payout_1',
    payload: {
        emails: ['finance@example.com'],
        note: 'Payment completed',
    },
});
```
