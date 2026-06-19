# Customers, Vendors & Bills API

## Customer Service — `sdk.customer`

Manage customer records for invoicing and payment collections.

---

### `getCustomers(options)`

List customers with pagination.

**HTTP:** `GET /invoice/customers`

### Parameters — `ListCustomers`

| Field | Type |
|-------|------|
| `businessId` | `string` |
| `pageNumber` | `number` |
| `pageSize` | `number` |

### `getCustomer(options)`

Get a single customer by ID.

**HTTP:** `GET /invoice/customer`

### `createCustomer(options)`

Create a new customer.

**HTTP:** `POST /invoice/customer`

### Parameters — `CreateCustomer`

| Field | Type |
|-------|------|
| `businessId` | `string` |
| `customerData` | `object` | Name, email, address, etc. |

### `updateCustomer(options)`

Update customer details.

**HTTP:** `PUT /invoice/customer`

### `deleteCustomer(options)`

Delete a customer.

**HTTP:** `DELETE /invoice/customer`

### Example

```typescript
const customer = await sdk.customer.createCustomer({
  businessId: 'biz_abc123',
  customerData: {
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1-555-0100',
  },
});
```

---

## Vendor Service — `sdk.vendor`

Manage vendors, track expenses, and process vendor payments.

---

### `listVendors(options)`

List vendors with filters and pagination.

**HTTP:** `GET /vendor/list`

### `getVendor(options)`

Get vendor details by ID.

**HTTP:** `GET /vendor/{id}`

### `createVendor(options)`

Register a new vendor.

**HTTP:** `POST /vendor`

### `updateVendor(options)`

Update vendor information.

**HTTP:** `PUT /vendor/{id}`

### `inviteVendor(options)`

Send an invitation to a vendor.

**HTTP:** `POST /vendor/invite`

### `setVendorSuspension(options)`

Suspend or unsuspend a vendor.

**HTTP:** `PUT /vendor/suspension`

### `deleteVendor(options)`

Remove a vendor.

**HTTP:** `DELETE /vendor/{id}`

### `getVendorLedger(options)`

Get the financial ledger for a vendor.

**HTTP:** `GET /vendor/ledger`

### `acceptVendor(options)`

Accept a vendor invitation.

**HTTP:** `POST /vendor/accept`

### `getExpenseGraph(options)`

Get expense graph data for vendors.

**HTTP:** `GET /vendor/expense/graph`

### `getExpenseSummary(options)`

Get expense summary statistics.

**HTTP:** `GET /vendor/expense/summary`

### `payVendor(options)`

Make a direct payment to a vendor.

**HTTP:** `POST /vendor/pay`

---

## Bill Service — `sdk.bill`

Manage vendor bills through review, confirmation, and payment.

---

### `createBill(options)`

Create a new vendor bill.

**HTTP:** `POST /vendor/bill`

### `updateBill(options)`

Update bill details.

**HTTP:** `PUT /vendor/bill`

### `getBill(options)`

Get bill details by ID.

**HTTP:** `GET /vendor/bill`

### `listBills(options)`

List bills with filters.

**HTTP:** `GET /vendor/bill/list`

### `reviewBill(options)`

Submit a bill for review.

**HTTP:** `POST /vendor/bill/review`

### `confirmBill(options)`

Confirm/approve a bill.

**HTTP:** `POST /vendor/bill/confirm`

### `payBill(options)`

Pay an approved bill.

**HTTP:** `POST /vendor/bill/pay`

### `mapBillToPayout(options)`

Map a bill to a payout batch.

**HTTP:** `POST /vendor/bill/payout`

### `acceptVendorInvitation(options)`

Accept a vendor bill invitation.

**HTTP:** `POST /vendor/accept`

---

## Accounts Payable Workflow

```typescript
const businessId = 'biz_abc123';

// 1. Register vendor
const vendor = await sdk.vendor.createVendor({
  businessId,
  vendorData: { name: 'Office Supplies Co', email: 'ap@officesupplies.com' },
});

// 2. Create bill
const bill = await sdk.bill.createBill({
  businessId,
  billData: {
    vendor_id: vendor.data.vendor_id,
    amount: 1250.00,
    description: 'Q2 office supplies',
  },
});

// 3. Review and confirm
await sdk.bill.reviewBill({ businessId, billId: bill.data.bill_id });
await sdk.bill.confirmBill({ businessId, billId: bill.data.bill_id });

// 4. Pay
await sdk.bill.payBill({
  businessId,
  billId: bill.data.bill_id,
  walletID: 'wal_123',
});
```
