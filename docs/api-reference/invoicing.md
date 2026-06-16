# Invoicing & Payment Collections API

**Service:** `sdk.invoice`

Full invoice lifecycle management plus payment collection sessions for accepting customer payments.

---

## Invoice CRUD

### `createInvoice(options)`

Create a new invoice (draft).

**HTTP:** `POST /invoice`

### Parameters — `CreateInvoice`

| Field | Type | Description |
|-------|------|-------------|
| `businessId` | `string` | Business context |
| `invoiceData` | `object` | Invoice fields (customer, line items, etc.) |

### `getInvoices(options?)`

List invoices with pagination.

**HTTP:** `GET /invoice/list`

### `getInvoiceDetails(options)`

Get a single invoice by ID.

**HTTP:** `GET /invoice/{id}`

### `updateInvoice(options)`

Update a draft invoice.

**HTTP:** `PUT /invoice/{id}`

### `deleteInvoice(options)`

Delete an invoice.

**HTTP:** `DELETE /invoice/{id}`

---

## Invoice Actions

### `finaliseInvoice(options)`

Finalize a draft invoice (makes it payable).

**HTTP:** `POST /invoice/finalise`

### `markInvoiceAsPaid(options)`

Manually mark an invoice as paid.

**HTTP:** `POST /invoice/mark-paid`

### `shareInvoice(options)`

Share an invoice via email.

**HTTP:** `POST /invoice/share`

### `sendInvoiceReminder(options)`

Send a payment reminder email.

**HTTP:** `POST /invoice/reminder`

### `sendPaymentConfirmation(options)`

Send a payment confirmation email.

**HTTP:** `POST /invoice/confirmation`

---

## Payment Collections

### `mapCollectionToInvoice(options)`

Link a payment collection to an invoice.

**HTTP:** `POST /invoice/map-collection`

### `submitCollection(options)`

Submit a payment collection.

**HTTP:** `POST /invoice/collection`

### `createPaymentCollection(options)`

Create a new payment collection.

**HTTP:** `POST /invoice/payment-collection`

### `updatePaymentCollection(options)`

Update payment collection settings.

**HTTP:** `PUT /invoice/payment-collection`

### `getInvoicePaymentCollections(options)`

Get payment collections for an invoice.

**HTTP:** `GET /invoice/payment-collection`

---

## Payment Sessions

### `createPaymentSession(options)`

Create a checkout session for customer payment.

**HTTP:** `POST /payment-collection/session`

### `getPaymentSession(options)`

Retrieve session details.

**HTTP:** `GET /payment-collection/session`

### `checkPaymentCollection(options)`

Check payment collection status.

**HTTP:** `GET /payment-collection/check`

### `checkPaymentSession(options)`

Check session payment status.

**HTTP:** `GET /payment-collection/session/check`

### `getPaymentCollectionList(options?)`

List all payment collections.

**HTTP:** `GET /payment-collection/list`

### `getPaymentCollection(options)`

Get a single payment collection.

**HTTP:** `GET /payment-collection/{id}`

### `getCollectionAssets(options)`

Get assets associated with a collection.

**HTTP:** `GET /payment-collection/assets`

---

## Wallet Customization

### `getWalletPaymentCollectionInfo(options)`

Get wallet info for payment collections.

**HTTP:** `GET /payment-collection/wallet/info`

### `createWalletPaymentCollectionCustomization(options)`

Create wallet branding/customization.

**HTTP:** `POST /payment-collection/wallet/customization`

### `updateWalletPaymentCollectionCustomization(options)`

Update wallet customization.

**HTTP:** `PUT /payment-collection/wallet/customization`

---

## Analytics

### `getRevenueGraph(options?)`

Get revenue graph data.

**HTTP:** `GET /invoice/revenue`

### `getCustomerBalances(options?)`

Get customer balance summary.

**HTTP:** `GET /invoice/customer-balances`

---

## Invoice Workflow Example

```typescript
const businessId = 'biz_abc123';

// 1. Create draft invoice
const invoice = await sdk.invoice.createInvoice({
  businessId,
  invoiceData: {
    customer_id: 'cust_123',
    line_items: [
      { description: 'Consulting', amount: 500, quantity: 1 },
    ],
    due_date: '2026-07-01',
  },
});

// 2. Finalize
await sdk.invoice.finaliseInvoice({
  businessId,
  invoiceId: invoice.data.invoice_id,
});

// 3. Create payment session
const session = await sdk.invoice.createPaymentSession({
  businessId,
  invoiceId: invoice.data.invoice_id,
  // session options
});

// 4. Share with customer
await sdk.invoice.shareInvoice({
  businessId,
  invoiceId: invoice.data.invoice_id,
  email: 'customer@example.com',
});
```
