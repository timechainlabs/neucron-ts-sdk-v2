# Vendors

## What are vendors in Neucron?

**Vendors** are the counterparties you pay — suppliers, contractors, and service providers. Together with [Bills](bills.md) and [Payouts](payouts.md), they form Neucron’s **accounts payable** stack:

1. Create / invite a vendor
2. Receive or create bills against the vendor
3. Review and pay bills (or pay the vendor directly)
4. Track expenses with graphs and summaries

### Vendor lifecycle actions

| Action                   | Method                                                    |
| ------------------------ | --------------------------------------------------------- |
| Create / update / delete | `createVendor`, `updateVendor`, `deleteVendor`            |
| Invite & accept          | `inviteVendor`, `acceptVendor`                            |
| Suspend / unsuspend      | `setVendorSuspension`                                     |
| Ledger & expenses        | `getVendorLedger`, `getExpenseGraph`, `getExpenseSummary` |
| Direct pay               | `payVendor`                                               |

Access via `sdk.vendor`.

---

## `listVendors`

### Parameters

| Name         | Type     | Required      | Sent as          |
| ------------ | -------- | ------------- | ---------------- |
| `businessId` | `string` | Yes (typical) | Header / context |
| `page`       | `number` | No            | Query            |
| `size`       | `number` | No            | Query            |

|                   |                    |
| ----------------- | ------------------ |
| **Auth required** | Yes                |
| **Headers**       | Auth + business ID |

### Request Payload

```json
{
    "businessId": "biz_123",
    "page": 1,
    "size": 20
}
```

### Response (`data`)

`VendorsListResponse` — vendors + pagination.

```typescript
const { data } = await sdk.vendor.listVendors({
    businessId: 'biz_123',
    page: 1,
    size: 20,
});
```

---

## `getVendor`

| Parameters   | `businessId`, `vendorId` (query `vendorID`) |
| ------------ | ------------------------------------------- |
| **Response** | `VendorResponse`                            |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1"
}
```

```typescript
const { data } = await sdk.vendor.getVendor({
    businessId: 'biz_123',
    vendorId: 'ven_1',
});
```

---

## `createVendor`

### Request Payload

```json
{
    "businessId": "biz_123",
    "payload": {
        "vendor_name": "Cloud Hosting Ltd",
        "vendor_type": "BUSINESS",
        "email": "ap@cloudhost.example",
        "phone_number": "+1-555-0200",
        "address_details": {
            "address": "200 Server Rd",
            "city": "Austin",
            "country": "US",
            "fax_number": "",
            "phone_number": "+1-555-0200",
            "pin_code": "78701",
            "state": "TX"
        },
        "contact_persons": [
            {
                "department": "Sales",
                "designation": "Account Manager",
                "email": "am@cloudhost.example",
                "first_name": "Sam",
                "language": "en",
                "last_name": "Lee",
                "phone_number": "+1-555-0201",
                "salulation": "Mr",
                "work_number": "+1-555-0202"
            }
        ],
        "payment_details": {
            "currency": "USD",
            "expense_wallet": "wallet_1",
            "opening_balance": 0,
            "payment_address": "1ABC...",
            "payment_terms": "Net 30",
            "place_of_supply": "TX"
        },
        "tax_payer_info": {
            "gst_treatment": "REGISTERED",
            "pan": "ABCDE1234F",
            "tds": "0",
            "vat_gstin": "22AAAAA0000A1Z5"
        }
    }
}
```

```typescript
const { data } = await sdk.vendor.createVendor({
    businessId: 'biz_123',
    payload: {
        vendor_name: 'Cloud Hosting Ltd',
        vendor_type: 'BUSINESS',
        email: 'ap@cloudhost.example',
        phone_number: '+1-555-0200',
        // ...remaining VendorUpsertPayload fields
    },
});
```

---

## `updateVendor`

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1",
    "payload": {
        "vendor_name": "Cloud Hosting Ltd",
        "vendor_type": "BUSINESS",
        "email": "ap@cloudhost.example",
        "phone_number": "+1-555-0299",
        "address_details": {
            "address": "200 Server Rd",
            "city": "Austin",
            "country": "US",
            "fax_number": "",
            "phone_number": "+1-555-0299",
            "pin_code": "78701",
            "state": "TX"
        },
        "contact_persons": [],
        "payment_details": {
            "currency": "USD",
            "expense_wallet": "wallet_1",
            "opening_balance": 0,
            "payment_address": "1ABC...",
            "payment_terms": "Net 15",
            "place_of_supply": "TX"
        },
        "tax_payer_info": {
            "gst_treatment": "REGISTERED",
            "pan": "ABCDE1234F",
            "tds": "0",
            "vat_gstin": "22AAAAA0000A1Z5"
        }
    }
}
```

---

## `inviteVendor`

Send a vendor invitation.

| Parameters   | `businessId`, `vendorId` |
| ------------ | ------------------------ |
| **Query**    | `vendorID`               |
| **Response** | `{ message }`            |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1"
}
```

---

## `acceptVendor`

Accept a vendor invitation using a token.

| Parameters   | `vendorId`, `token`, `businessId?` |
| ------------ | ---------------------------------- |
| **Query**    | `vendorID`, `token`                |
| **Response** | `{ message }`                      |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1",
    "token": "invite-token"
}
```

```typescript
await sdk.vendor.acceptVendor({
    businessId: 'biz_123',
    vendorId: 'ven_1',
    token: 'invite-token',
});
```

---

## `setVendorSuspension`

| Parameters   | `vendorId`, `action: 'SUSPEND' \| 'UNSUSPEND'`, `businessId` context |
| ------------ | -------------------------------------------------------------------- |
| **Query**    | `vendorID`, `action`                                                 |
| **Response** | `{ message }`                                                        |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1",
    "action": "SUSPEND"
}
```

```typescript
await sdk.vendor.setVendorSuspension({
    businessId: 'biz_123',
    vendorId: 'ven_1',
    action: 'SUSPEND',
});
```

---

## `deleteVendor`

| Parameters   | `businessId`, `vendorId` |
| ------------ | ------------------------ |
| **Response** | `{ message }`            |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1"
}
```

---

## `getVendorLedger`

| Parameters   | `businessId`, `vendorId` |
| ------------ | ------------------------ |
| **Response** | `VendorLedgerResponse`   |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1"
}
```

---

## `payVendor`

Pay a vendor directly (without a bill workflow).

| Parameters   | `vendorId`, `payDTO` (body), `businessId` |
| ------------ | ----------------------------------------- |
| **Query**    | `vendorID`                                |
| **Response** | `{ message }`                             |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorId": "ven_1",
    "payDTO": {
        "amount_in_fiat": 1000,
        "asset_id": "00000000-0000-0000-0000-000000000000",
        "currency": "USD",
        "sender_wallet_id": "wallet_1",
        "amount": "100000",
        "schedule_at": "2026-08-01T10:00:00Z",
        "meta": { "note": "Direct vendor payment" }
    }
}
```

```typescript
await sdk.vendor.payVendor({
    businessId: 'biz_123',
    vendorId: 'ven_1',
    payDTO: {
        amount_in_fiat: 1000,
        asset_id: '00000000-0000-0000-0000-000000000000',
        currency: 'USD',
        sender_wallet_id: 'wallet_1',
    },
});
```

---

## Expense analytics

### `getExpenseGraph`

| Parameters   | Date/currency filters + `businessId` |
| ------------ | ------------------------------------ |
| **Query**    | Filter fields                        |
| **Response** | Graph payload                        |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorID": "ven_1",
    "currency": "USD",
    "from": "2026-01-01",
    "to": "2026-07-01",
    "period": "monthly"
}
```

---

### `getExpenseSummary`

| Parameters   | Date/currency filters + `businessId` |
| ------------ | ------------------------------------ |
| **Query**    | Filter fields                        |
| **Response** | Summary payload                      |

### Request Payload

```json
{
    "businessId": "biz_123",
    "vendorID": "ven_1",
    "currency": "USD",
    "from": "2026-01-01",
    "to": "2026-07-01",
    "period": "monthly"
}
```

```typescript
const { data } = await sdk.vendor.getExpenseSummary({
    businessId: 'biz_123',
    vendorID: 'ven_1',
    currency: 'USD',
    from: '2026-01-01',
    to: '2026-07-01',
    period: 'monthly',
});
```
