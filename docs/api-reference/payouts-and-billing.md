# Payouts & Billing API

## Payout Service — `sdk.payout`

Create and manage batch payouts to vendors or recipients.

---

### `createPayout(options)`

Create a new payout batch.

**HTTP:** `POST /payout`

### Parameters — `CreatePayout`

| Field | Type | Description |
|-------|------|-------------|
| `businessId` | `string` | Business context |
| Payout data | `object` | Recipients, amounts, wallet |

---

### `updatePayout(options)`

Update a draft payout.

**HTTP:** `PUT /payout`

---

### `listPayouts(options)`

List payouts with pagination and filters.

**HTTP:** `GET /payout/list`

---

### `triggerPayout(options)`

Trigger execution of a payout batch.

**HTTP:** `POST /payout/trigger`

---

### `getPayout(options)`

Get payout details by ID.

**HTTP:** `GET /payout/{id}`

---

### `confirmPayout(options)`

Confirm a payout for processing.

**HTTP:** `POST /payout/confirm`

### Example

```typescript
// Create payout
const payout = await sdk.payout.createPayout({
  businessId: 'biz_abc123',
  payoutData: {
    walletID: 'wal_123',
    recipients: [
      { vendor_id: 'vnd_1', amount: 500 },
      { vendor_id: 'vnd_2', amount: 750 },
    ],
  },
});

// Confirm and trigger
await sdk.payout.confirmPayout({
  businessId: 'biz_abc123',
  payoutId: payout.data.payout_id,
});

await sdk.payout.triggerPayout({
  businessId: 'biz_abc123',
  payoutId: payout.data.payout_id,
});
```

---

## Billing Service — `sdk.billing`

Manage Neucron platform subscriptions, credits, and payment methods.

---

### Subscription & Credits

| Method | HTTP | Description |
|--------|------|-------------|
| `getBillingInfo()` | `GET /billing` | Current billing account info |
| `getBillingHistory(page?, size?)` | `GET /credits/history` | Credit usage history |
| `getPricingPlans()` | `GET /subscription/plans` | Available subscription plans |
| `getCreditBalance()` | `GET /credits/balance` | Current credit balance |
| `requestPlan(options)` | `POST /subscription/request` | Request a subscription plan |
| `getPlanStatus()` | `GET /subscription/status` | Current plan status |
| `upgradePlan(options)` | `POST /subscription/upgrade` | Upgrade subscription |
| `cancelPlan(options)` | `POST /subscription/cancel` | Cancel subscription |
| `creditsTopUp(options)` | `POST /credits/topup` | Top up credits |
| `getGraph(granularity)` | `GET /credits/graph` | Credit usage graph |

---

### Invoices & Payments

| Method | HTTP | Description |
|--------|------|-------------|
| `getInvoiceList(page?, size?)` | `GET /payment-invoice/list` | Platform billing invoices |
| `raisePaymentForInvoice(options)` | `POST /payment-invoice/payment` | Pay a platform invoice |
| `getPaymentHistory(page?, size?)` | `GET /payment-invoice/payment/history` | Payment history |
| `downloadInvoice(paymentId)` | `GET /business/payment-invoices` | Download invoice PDF |
| `getPaymentMethods()` | `GET /billing/payment-methods` | Saved payment methods |
| `addPaymentMethod(data)` | `POST /billing/payment-methods` | Add payment method |

---

### Example

```typescript
// Check current plan and credits
const billing = await sdk.billing.getBillingInfo();
const balance = await sdk.billing.getCreditBalance();

console.log('Plan:', billing.data);
console.log('Credits:', balance.data);

// Upgrade plan
await sdk.billing.upgradePlan({
  planId: 'plan_pro',
});

// Top up credits
await sdk.billing.creditsTopUp({
  amount: 100,
});
```
