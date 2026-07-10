# Bills

## What are bills in Neucron?

A **bill** is an accounts-payable document from a vendor — the payable counterpart to an invoice. Bills move through a review and payment workflow:

1. **Create** a bill (often `DRAFTED` or `PENDING_APPROVAL`)
2. **Update** while still editable
3. **Review** — `APPROVE` or `DECLINE`
4. **Confirm** the bill
5. **Pay** via payout (optionally scheduled)
6. Optionally **map** the bill to an existing payout

### Bill statuses (on create)

| Status | Meaning |
| --- | --- |
| `DRAFTED` | Draft |
| `UNPROCESSED` | Submitted, not yet reviewed |
| `PENDING_APPROVAL` | Waiting for approval |

### Review actions

`APPROVE` | `DECLINE`

Access via `sdk.bill`.

---

## `createBill`

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header | Business |
| `payload` | Bill payload | Yes | Body | Full bill |

### Request Payload

```json
{
  "businessId": "biz_123",
  "payload": {
    "vendor_id": "ven_1",
    "currency": "USD",
    "discount": 0,
    "tax_rate": 18,
    "status": "DRAFTED",
    "bill_items": [
      {
        "name": "Cloud hosting",
        "quantity": 1,
        "cost_per_unit": 500,
        "tax_rate": 18,
        "sac_code": "9983",
        "account": "Expenses",
        "sub_total": 500,
        "total": 590
      }
    ],
    "billing_details": {
      "bill_date": "2026-07-01",
      "due_date": "2026-07-31",
      "billing_number": "BILL-1001",
      "order_number": "PO-55",
      "payment_terms": "Net 30",
      "amount_payble": 590
    },
    "billing_address": {
      "address": "100 Market St",
      "city": "San Francisco",
      "state": "CA",
      "country": "US",
      "pin_code": "94105"
    },
    "tax_payer_info": {
      "gst_treatment": "REGISTERED",
      "pan": "ABCDE1234F",
      "tds": "0",
      "vat_gstin": "22AAAAA0000A1Z5"
    },
    "other_details": {
      "notes": "July hosting invoice",
      "lut_number": "",
      "attachments": []
    },
    "additional_charge": {}
  }
}
```

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | Auth + business ID |

### Response (`data`)

| Field | Type |
| --- | --- |
| `billID` | `string` |

```typescript
const { data } = await sdk.bill.createBill({
  businessId: 'biz_123',
  payload: {
    vendor_id: 'ven_1',
    currency: 'USD',
    discount: 0,
    tax_rate: 18,
    status: 'DRAFTED',
    bill_items: [/* ... */],
    billing_details: { /* ... */ },
    billing_address: { /* ... */ },
    tax_payer_info: { /* ... */ },
    other_details: { /* ... */ },
    additional_charge: {},
  },
});
```

---

## `updateBill`

| Parameters | `businessId`, `billID`, `payload` |
| --- | --- |
| **Query** | `billID` |
| **Body** | Full bill payload |
| **Response** | `{ message }` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1",
  "payload": {
    "vendor_id": "ven_1",
    "currency": "USD",
    "discount": 10,
    "tax_rate": 18,
    "status": "DRAFTED",
    "bill_items": [
      {
        "name": "Cloud hosting",
        "quantity": 1,
        "cost_per_unit": 450,
        "tax_rate": 18,
        "sac_code": "9983"
      }
    ],
    "billing_details": {
      "bill_date": "2026-07-01",
      "due_date": "2026-07-31",
      "billing_number": "BILL-1001",
      "payment_terms": "Net 30",
      "amount_payble": 531
    },
    "billing_address": {
      "address": "100 Market St",
      "city": "San Francisco",
      "country": "US",
      "pin_code": "94105"
    },
    "tax_payer_info": {
      "gst_treatment": "REGISTERED",
      "pan": "ABCDE1234F",
      "tds": "0",
      "vat_gstin": "22AAAAA0000A1Z5"
    },
    "other_details": { "notes": "Updated amount" },
    "additional_charge": {}
  }
}
```

---

## `getBill`

| Parameters | `businessId`, `billID` |
| --- | --- |
| **Query** | `billID` |
| **Response** | `BillResponse` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1"
}
```

```typescript
const { data: bill } = await sdk.bill.getBill({
  businessId: 'biz_123',
  billID: 'bill_1',
});
```

---

## `listBills`

| Parameters | `businessId`, `vendorID?`, `page?`, `size?` |
| --- | --- |
| **Query** | Filters + pagination |
| **Response** | `BillsListResponse` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "vendorID": "ven_1",
  "page": 1,
  "size": 20
}
```

```typescript
const { data } = await sdk.bill.listBills({
  businessId: 'biz_123',
  vendorID: 'ven_1',
  page: 1,
  size: 20,
});
```

---

## `reviewBill`

| Parameters | `businessId`, `billID`, `action: 'APPROVE' \| 'DECLINE'` |
| --- | --- |
| **Query** | `billID`, `action` |
| **Response** | `{ message }` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1",
  "action": "APPROVE"
}
```

```typescript
await sdk.bill.reviewBill({
  businessId: 'biz_123',
  billID: 'bill_1',
  action: 'APPROVE',
});
```

---

## `confirmBill`

| Parameters | `businessId`, `billID` |
| --- | --- |
| **Query** | `billID` |
| **Response** | `{ message }` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1"
}
```

---

## `payBill`

Pay an approved bill (creates / triggers payout mechanics).

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header | Business |
| `billID` | `string` | Yes | Query | Bill |
| `payDTO.asset_id` | `string` | Yes | Body | Asset used to pay |
| `payDTO.sender_wallet_id` | `string` | Yes | Body | Paying wallet |
| `payDTO.schedule_at` | `string` | No | Body | Schedule time |
| `payDTO.meta` | `object` | No | Body | Metadata |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1",
  "payDTO": {
    "asset_id": "00000000-0000-0000-0000-000000000000",
    "sender_wallet_id": "wallet_1",
    "schedule_at": "2026-08-01T10:00:00Z",
    "meta": { "note": "Bill settlement" }
  }
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `payout_id` | `string` |
| `txmeta` | `string` |

```typescript
const { data } = await sdk.bill.payBill({
  businessId: 'biz_123',
  billID: 'bill_1',
  payDTO: {
    asset_id: '00000000-0000-0000-0000-000000000000',
    sender_wallet_id: 'wallet_1',
  },
});
```

---

## `mapBillToPayout`

Link a bill to an existing payout.

| Parameters | `businessId`, `billID`, `payoutID` |
| --- | --- |
| **Query** | `billID`, `payoutID` |
| **Response** | `{ message }` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "billID": "bill_1",
  "payoutID": "payout_1"
}
```

---

## `acceptVendorInvitation`

Accept a vendor invitation in the bill/vendor context.

| Parameters | `businessId`, `vendorID`, `token` |
| --- | --- |
| **Query** | `vendorID`, `token` |
| **Response** | `{ message }` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "vendorID": "ven_1",
  "token": "invite-token"
}
```
