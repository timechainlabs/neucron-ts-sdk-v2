# Invoicing & Collections

## What is invoicing on Neucron?

Neucron invoicing covers the full **accounts receivable** loop:

1. **Create** draft invoices with line items, taxes, and payment options
2. **Finalise**, **share**, and send **reminders**
3. Attach **payment collections** (invoice-linked or public universal links)
4. Open **payment sessions** for a specific asset
5. **Check** on-chain payment status
6. Mark invoices **paid** and send confirmations
7. Analyze **revenue** and customer balances

### Key concepts

| Concept                  | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| **Invoice**              | Bill issued to a `customer_id`, deposited into a `deposit_wallet` |
| **Payment collection**   | Receivable link that accepts one or more supported assets         |
| **Public collection**    | Universal payment link not tied to a specific invoice             |
| **Payment session**      | Checkout session for a collection + chosen `assetID`              |
| **Wallet customization** | Branding (`display_name`, `logo_url`) for wallet payment pages    |

Access via `sdk.invoice`. Pass `businessId` for business scope.

---

## Invoice CRUD & lifecycle

### `createInvoice`

#### Parameters

| Name          | Type     | Required | Sent as | Description     |
| ------------- | -------- | -------- | ------- | --------------- |
| `businessId`  | `string` | No       | Header  | Business        |
| `invoiceData` | object   | Yes      | Body    | Invoice payload |

|                   |                             |
| ----------------- | --------------------------- |
| **Auth required** | Yes                         |
| **Headers**       | Auth + optional business ID |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceData": {
        "currency": "USD",
        "customer_id": "cust_1",
        "deposit_wallet": "wallet_1",
        "discount": 0,
        "due_date": "2026-08-01",
        "invoice_number": "INV-1001",
        "issue_date": "2026-07-10",
        "items": [
            {
                "name": "Consulting",
                "quantity": 10,
                "cost_per_unit": 100,
                "tax_rate": 18,
                "sac_code": "9983"
            }
        ],
        "lut_number": "",
        "notes": "Net 30",
        "order_number": "PO-55",
        "payment_option": [
            {
                "chain": "BSV",
                "network": "MAIN",
                "asset_option": [
                    {
                        "asset_id": "00000000-0000-0000-0000-000000000000",
                        "asset_name": "BSV"
                    }
                ]
            }
        ],
        "payment_terms": "Net 30",
        "round_off": true
    }
}
```

#### Response (`data`)

`InvoiceResponse`.

```typescript
const { data: invoice } = await sdk.invoice.createInvoice({
    businessId: 'biz_123',
    invoiceData: {
        currency: 'USD',
        customer_id: 'cust_1',
        deposit_wallet: 'wallet_1',
        discount: 0,
        due_date: '2026-08-01',
        invoice_number: 'INV-1001',
        issue_date: '2026-07-10',
        items: [
            {
                name: 'Consulting',
                quantity: 10,
                cost_per_unit: 100,
                tax_rate: 18,
                sac_code: '9983',
            },
        ],
        lut_number: '',
        notes: 'Net 30',
        order_number: 'PO-55',
        payment_option: [
            {
                chain: 'BSV',
                network: 'MAIN',
                asset_option: [
                    {
                        asset_id: '00000000-0000-0000-0000-000000000000',
                        asset_name: 'BSV',
                    },
                ],
            },
        ],
        payment_terms: 'Net 30',
        round_off: true,
    },
});
```

---

### `getInvoices`

| Parameters   | `businessId?`, `pageNumber?`, `pageSize?`, `statuses?: string[]` |
| ------------ | ---------------------------------------------------------------- |
| **Sent as**  | Header + query                                                   |
| **Response** | `{ invoices, page_meta }`                                        |

### Request Payload

```json
{
    "businessId": "biz_123",
    "pageNumber": 1,
    "pageSize": 20,
    "statuses": ["DRAFT", "SENT"]
}
```

```typescript
const { data } = await sdk.invoice.getInvoices({
    businessId: 'biz_123',
    pageNumber: 1,
    pageSize: 20,
    statuses: ['DRAFT', 'SENT'],
});
```

---

### `getInvoiceDetails`

| Parameters   | `invoiceID` (required), `businessId?` |
| ------------ | ------------------------------------- |
| **Query**    | `invoiceID`                           |
| **Response** | `InvoiceResponse`                     |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1"
}
```

---

### `updateInvoice`

| Parameters   | `invoiceID`, `invoiceData` (record), `businessId?` |
| ------------ | -------------------------------------------------- |
| **Response** | `InvoiceResponse`                                  |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "invoiceData": {
        "notes": "Updated payment terms",
        "payment_terms": "Net 15",
        "discount": 5
    }
}
```

---

### `deleteInvoice`

| Parameters   | `invoiceID`, `businessId?` |
| ------------ | -------------------------- |
| **Response** | `{ message }`              |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1"
}
```

---

### `finaliseInvoice`

Lock a draft invoice for issuance.

| Parameters   | `invoiceID`, `businessId?` |
| ------------ | -------------------------- |
| **Response** | `{ message }`              |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1"
}
```

```typescript
await sdk.invoice.finaliseInvoice({ businessId: 'biz_123', invoiceID: 'inv_1' });
```

---

### `markInvoiceAsPaid`

| Parameters   | `invoiceID`, `payload: { emails, paid_at, cc?, bcc?, note? }`, `businessId?` |
| ------------ | ---------------------------------------------------------------------------- |
| **Response** | `{ message }`                                                                |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "payload": {
        "emails": ["billing@acme.com"],
        "cc": ["finance@example.com"],
        "bcc": [],
        "paid_at": "2026-07-15T12:00:00Z",
        "note": "Received via BSV"
    }
}
```

---

### `shareInvoice`

| Parameters   | `invoiceID`, `emails: string[]`, `sendEmail?`, `businessId?` |
| ------------ | ------------------------------------------------------------ |
| **Response** | `{ message }`                                                |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "emails": ["billing@acme.com", "ap@acme.com"],
    "sendEmail": true
}
```

---

### `sendInvoiceReminder` / `sendPaymentConfirmation`

| Parameters   | `invoiceID`, `payload: EmailPayload`, `businessId?` |
| ------------ | --------------------------------------------------- |
| **Response** | `{ message }`                                       |

`EmailPayload`: `{ emails, cc?, bcc?, note?, paid_at? }`.

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "payload": {
        "emails": ["billing@acme.com"],
        "cc": ["finance@example.com"],
        "note": "Friendly reminder — invoice due soon"
    }
}
```

---

## Payment collections

### `createPaymentCollection`

Create a collection linked to an invoice.

| Parameters   | `invoiceID`, `supportedAssets: string[]`, `walletID?`, `businessId?` |
| ------------ | -------------------------------------------------------------------- |
| **Response** | `PaymentCollectionResponse`                                          |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "supportedAssets": ["00000000-0000-0000-0000-000000000000"],
    "walletID": "wallet_1"
}
```

```typescript
await sdk.invoice.createPaymentCollection({
    businessId: 'biz_123',
    invoiceID: 'inv_1',
    supportedAssets: ['00000000-0000-0000-0000-000000000000'],
    walletID: 'wallet_1',
});
```

---

### `createPublicPaymentCollection`

Create a universal payment link.

| Parameters   | `businessId?`, `data: { wallet_id, amount?, currency?, metadata? }` |
| ------------ | ------------------------------------------------------------------- |
| **Response** | `PaymentCollectionResponse`                                         |

### Request Payload

```json
{
    "businessId": "biz_123",
    "data": {
        "wallet_id": "wallet_1",
        "amount": 50,
        "currency": "USD",
        "metadata": { "campaign": "summer-sale" }
    }
}
```

```typescript
await sdk.invoice.createPublicPaymentCollection({
    businessId: 'biz_123',
    data: {
        wallet_id: 'wallet_1',
        amount: 50,
        currency: 'USD',
    },
});
```

---

### `updatePaymentCollection`

| Parameters   | Same shape as create (invoice + `supportedAssets`) |
| ------------ | -------------------------------------------------- |
| **Response** | `PaymentCollectionResponse`                        |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "supportedAssets": ["00000000-0000-0000-0000-000000000000", "asset_usdt"]
}
```

---

### `mapCollectionToInvoice`

| Parameters   | `invoiceID`, `collectionID`, `businessId?` |
| ------------ | ------------------------------------------ |
| **Response** | `{ message }`                              |

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1",
    "collectionID": "col_1"
}
```

---

### `submitCollection`

| Parameters   | `businessId?`, `data: { asset_id, invoice_id }` |
| ------------ | ----------------------------------------------- |
| **Response** | `{ message }`                                   |

### Request Payload

```json
{
    "businessId": "biz_123",
    "data": {
        "asset_id": "00000000-0000-0000-0000-000000000000",
        "invoice_id": "inv_1"
    }
}
```

---

### `getInvoicePaymentCollections`

### Request Payload

```json
{
    "businessId": "biz_123",
    "invoiceID": "inv_1"
}
```

---

### `getPaymentCollection`

### Request Payload

```json
{
    "businessId": "biz_123",
    "collectionID": "col_1"
}
```

---

### `getPaymentCollectionList`

### Request Payload

```json
{
    "businessId": "biz_123",
    "page": 1,
    "size": 20,
    "collection_id": "col_1",
    "reference": "INV-1001",
    "wallet_id": "wallet_1",
    "status": "OPEN"
}
```

---

### `getCollectionAssets`

| Parameters   | `collectionID`, `network?`, `businessId?` |
| ------------ | ----------------------------------------- |
| **Response** | Supported assets for the collection       |

### Request Payload

```json
{
    "businessId": "biz_123",
    "collectionID": "col_1",
    "network": "MAIN"
}
```

---

## Payment sessions

### `createPaymentSession`

| Parameters   | `collectionID`, `assetID`, `metadata?`, `businessId?` |
| ------------ | ----------------------------------------------------- |
| **Response** | `PaymentCollectionResponse`                           |

### Request Payload

```json
{
    "businessId": "biz_123",
    "collectionID": "col_1",
    "assetID": "00000000-0000-0000-0000-000000000000",
    "metadata": { "source": "checkout" }
}
```

---

### `getPaymentSession`

| Parameters   | `sessionID`, `businessId?` |
| ------------ | -------------------------- |
| **Response** | Session status payload     |

### Request Payload

```json
{
    "businessId": "biz_123",
    "sessionID": "sess_1"
}
```

---

### `checkPaymentCollection` / `checkPaymentSession`

Verify payment using optional `txHash`.

### Request Payload (`checkPaymentCollection`)

```json
{
    "businessId": "biz_123",
    "collectionID": "col_1",
    "txHash": "abc123..."
}
```

### Request Payload (`checkPaymentSession`)

```json
{
    "businessId": "biz_123",
    "sessionID": "sess_1",
    "txHash": "abc123..."
}
```

```typescript
await sdk.invoice.checkPaymentSession({
    businessId: 'biz_123',
    sessionID: 'sess_1',
    txHash: 'abc123...',
});
```

---

## Wallet collection branding

### `getWalletPaymentCollectionInfo`

| Parameters   | `walletID?`, `paymail?`, `businessId?` |
| ------------ | -------------------------------------- |
| **Response** | `WalletInfoPayload`                    |

### Request Payload

```json
{
    "businessId": "biz_123",
    "walletID": "wallet_1",
    "paymail": "payments@neucron.io"
}
```

---

### `createWalletPaymentCollectionCustomization` / `updateWalletPaymentCollectionCustomization`

| Parameters   | `walletID`, `payload: { display_name, logo_url }`, `businessId?` |
| ------------ | ---------------------------------------------------------------- |
| **Response** | `WalletInfoPayload`                                              |

### Request Payload

```json
{
    "businessId": "biz_123",
    "walletID": "wallet_1",
    "payload": {
        "display_name": "Acme Payments",
        "logo_url": "https://cdn.example.com/logo.png"
    }
}
```

```typescript
await sdk.invoice.createWalletPaymentCollectionCustomization({
    businessId: 'biz_123',
    walletID: 'wallet_1',
    payload: {
        display_name: 'Acme Payments',
        logo_url: 'https://cdn.example.com/logo.png',
    },
});
```

---

## Revenue analytics

### `getRevenueGraph`

| Parameters   | `businessId?`, `from?`, `to?`, `currency?`, `customerID?`, `period?: 'weekly' \| 'monthly' \| 'quarterly' \| 'yearly'` |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Response** | Analytics payload                                                                                                      |

### Request Payload

```json
{
    "businessId": "biz_123",
    "from": "2026-01-01",
    "to": "2026-07-01",
    "currency": "USD",
    "customerID": "cust_1",
    "period": "monthly"
}
```

```typescript
const { data } = await sdk.invoice.getRevenueGraph({
    businessId: 'biz_123',
    period: 'monthly',
    currency: 'USD',
});
```

---

### `getCustomerBalances`

### Request Payload

```json
{
    "businessId": "biz_123",
    "from": "2026-01-01",
    "to": "2026-07-01",
    "currency": "USD",
    "customerID": "cust_1"
}
```
