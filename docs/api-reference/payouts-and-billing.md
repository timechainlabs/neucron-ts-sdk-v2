# Payouts & Billing API

## Payout Service — `sdk.payout`

Create and manage batch payouts to vendors or recipients. All payout methods require authentication and a `businessId` unless noted otherwise.

### Common Headers

| Header | When set |
|--------|----------|
| `Authorization` | Always (from SDK auth token) |
| `X-Identifier` | Always (`NEUCRON` by default) |
| `X-Neucron-Business-ID` | When `businessId` is provided |
| `X-Neucron-Team-ID` | `createPayoutRequest` only, when `teamId` is provided |
| `X-App-Secret` | `createPayoutRequest` only |

### Shared Types

#### `PayoutUpsertPayload`

Used by `createPayout` and `updatePayout` as the request body.

| Field | Type | Description |
|-------|------|-------------|
| `address` | `string` | Destination blockchain address |
| `amount` | `string` | Payout amount |
| `amount_in_fiat` | `number` | Fiat equivalent amount |
| `asset_id` | `string` | Asset identifier |
| `currency` | `string` | Currency code |
| `destination_wallet` | `string` | Destination wallet ID |
| `email` | `string` | Recipient email |
| `meta` | `PayoutMeta` | Optional metadata (`email`, `name`, `note`) |
| `paymail` | `string` | Recipient Paymail address |
| `scheduled_at` | `string` | ISO timestamp for scheduled payout |
| `wallet_id` | `string` | Source wallet ID |

#### `PayoutMeta`

| Field | Type | Description |
|-------|------|-------------|
| `email` | `string` | Contact email |
| `name` | `string` | Display name |
| `note` | `string` | Free-text note |

---

### `createPayout(options)`

Create a new payout batch.

**Auth required:** Yes

**HTTP:** `POST /payout`

**Query params:** None

**Request body:** `options.payload` (`PayoutUpsertPayload`)

### Parameters — `CreatePayout`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `payload` | `PayoutUpsertPayload` | Yes | Payout details |

### Response — `CreatePayoutResponse`

```typescript
{ payout_id: string }
```

### Example

```typescript
const result = await sdk.payout.createPayout({
  businessId: 'biz_abc123',
  payload: {
    wallet_id: 'wal_123',
    asset_id: 'asset_bsv',
    amount: '0.5',
    amount_in_fiat: 25,
    currency: 'USD',
    email: 'vendor@example.com',
    meta: {
      name: 'Vendor Payment',
      note: 'Q2 invoice settlement',
    },
  },
});

console.log(result.data.payout_id);
```

---

### `createPayoutRequest(options)`

Create a payout request using app credentials. Intended for server-to-server integrations that authenticate with an app secret.

**Auth required:** Yes

**HTTP:** `POST /payout/request`

**Request body:** `options.payload` (`CreatePayoutRequestPayload`)

### Parameters — `CreatePayoutRequest`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `appSecret` | `string` | Yes | App secret (`X-App-Secret` header) |
| `teamId` | `string` | No | Team context (`X-Neucron-Team-ID` header) |
| `payload` | `CreatePayoutRequestPayload` | Yes | Payout request body |

### Payload — `CreatePayoutRequestPayload`

| Field | Type | Description |
|-------|------|-------------|
| `amount` | `string` | Payout amount |
| `amount_in_fiat` | `number` | Fiat equivalent amount |
| `asset_id` | `string` | Asset identifier |
| `currency` | `string` | Currency code (e.g. `CLP`) |
| `meta` | `PayoutMeta` | Optional metadata |
| `receiver_address` | `string` | Receiver blockchain address |
| `receiver_email` | `string` | Receiver email |
| `receiver_paymail` | `string` | Receiver Paymail |
| `sender_address` | `string` | Sender blockchain address |
| `sender_email` | `string` | Sender email |
| `sender_paymail` | `string` | Sender Paymail |

### Response — `CreatePayoutResponse`

```typescript
{ payout_id: string }
```

### Example

```typescript
const result = await sdk.payout.createPayoutRequest({
  businessId: 'biz_abc123',
  teamId: 'team_xyz',
  appSecret: 'your-app-secret',
  payload: {
    amount: '100',
    amount_in_fiat: 100,
    asset_id: 'asset_123',
    currency: 'CLP',
    meta: {
      email: 'user@example.com',
      name: 'Jane Doe',
      note: 'Vendor payment',
    },
    receiver_address: '1ReceiverAddress',
    receiver_email: 'receiver@example.com',
    receiver_paymail: 'receiver@paymail.com',
    sender_address: '1SenderAddress',
    sender_email: 'sender@example.com',
    sender_paymail: 'sender@paymail.com',
  },
});

console.log(result.data.payout_id);
```

---

### `updatePayout(options)`

Update an existing draft payout.

**Auth required:** Yes

**HTTP:** `PUT /payout?payoutID={id}`

**Request body:** `options.payload` (`PayoutUpsertPayload`)

### Parameters — `UpdatePayout`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `payoutID` | `string` | Yes | Payout ID to update |
| `payload` | `PayoutUpsertPayload` | Yes | Updated payout fields |

### Response — `CreatePayoutResponse`

```typescript
{ payout_id: string }
```

### Example

```typescript
await sdk.payout.updatePayout({
  businessId: 'biz_abc123',
  payoutID: 'payout_456',
  payload: {
    amount: '1.0',
    amount_in_fiat: 50,
    meta: { note: 'Updated amount' },
  },
});
```

---

### `listPayouts(options)`

List payouts with optional filters and pagination.

**Auth required:** Yes

**HTTP:** `GET /payout/list`

### Parameters — `ListPayouts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `status` | `string` | No | Filter by payout status |
| `reference` | `string` | No | Filter by reference ID |
| `reference_type` | `string` | No | Filter by reference type |
| `page` | `number` | No | Page number (min: 1) |
| `limit` | `number` | No | Items per page (min: 1) |

### Response — `PayoutListResponse`

```typescript
{
  list: Array<{ payout_id: string; /* additional fields */ }>;
  page_meta?: {
    page: number;
    limit: number;
    total: number;
    next_page?: number;
    total_pages: number;
  };
}
```

### Example

```typescript
const payouts = await sdk.payout.listPayouts({
  businessId: 'biz_abc123',
  status: 'pending',
  page: 1,
  limit: 20,
});

console.log(payouts.data.list);
console.log(payouts.data.page_meta);
```

---

### `triggerPayout(options)`

Trigger execution of a confirmed payout on-chain.

**Auth required:** Yes

**HTTP:** `POST /payout/trigger?payoutID={id}`

**Request body:** None

### Parameters — `PayoutId`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `payoutID` | `string` | Yes | Payout ID to trigger |

### Response — `TriggerPayoutResponse`

```typescript
{
  tx_link?: string;
  txid?: string;
}
```

### Example

```typescript
const result = await sdk.payout.triggerPayout({
  businessId: 'biz_abc123',
  payoutID: 'payout_456',
});

console.log(result.data.txid);
```

---

### `getPayout(options)`

Get full details for a single payout by ID.

**Auth required:** Yes

**HTTP:** `GET /payout?payoutID={id}`

### Parameters — `PayoutId`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `payoutID` | `string` | Yes | Payout ID |

### Response — `PayoutApiModel`

```typescript
{ payout_id: string; /* additional API fields */ }
```

### Example

```typescript
const payout = await sdk.payout.getPayout({
  businessId: 'biz_abc123',
  payoutID: 'payout_456',
});

console.log(payout.data);
```

---

### `confirmPayout(options)`

Confirm a payout and optionally send notification emails.

**Auth required:** Yes

**HTTP:** `POST /payout/confirm?payoutID={id}`

**Request body:** `options.payload`

### Parameters — `ConfirmPayout`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessId` | `string` | Yes | Business context |
| `payoutID` | `string` | Yes | Payout ID to confirm |
| `payload` | `object` | Yes | Confirmation options |

### Payload fields

| Field | Type | Description |
|-------|------|-------------|
| `emails` | `string[]` | Recipient email addresses |
| `cc` | `string[]` | CC email addresses |
| `bcc` | `string[]` | BCC email addresses |
| `note` | `string` | Note included in notification |

### Response — `ConfirmPayoutResponse`

```typescript
{ message: string }
```

### Example

```typescript
await sdk.payout.confirmPayout({
  businessId: 'biz_abc123',
  payoutID: 'payout_456',
  payload: {
    emails: ['finance@example.com'],
    note: 'Payout approved for processing',
  },
});
```

---

### Payout Workflow Example

Full create → confirm → trigger flow:

```typescript
// 1. Create payout
const created = await sdk.payout.createPayout({
  businessId: 'biz_abc123',
  payload: {
    wallet_id: 'wal_123',
    asset_id: 'asset_bsv',
    amount: '0.5',
    email: 'vendor@example.com',
  },
});

const payoutID = created.data.payout_id;

// 2. Confirm payout
await sdk.payout.confirmPayout({
  businessId: 'biz_abc123',
  payoutID,
  payload: {
    emails: ['finance@example.com'],
  },
});

// 3. Trigger on-chain execution
const triggered = await sdk.payout.triggerPayout({
  businessId: 'biz_abc123',
  payoutID,
});

console.log('Transaction ID:', triggered.data.txid);
```

---

## Billing Service — `sdk.billing`

Manage Neucron platform subscriptions, credits, payment methods, and platform billing invoices. All methods require authentication. Billing is scoped to the authenticated user account (no `businessId` parameter).

### Common Headers

| Header | Value |
|--------|-------|
| `Authorization` | SDK auth token |
| `X-Identifier` | `NEUCRON` (default) |

---

### `getBillingInfo()`

Get current billing account information.

**Auth required:** Yes

**HTTP:** `GET /billing`

**Parameters:** None

### Response — `BillingInfoResponse`

Backend-defined billing account object.

### Example

```typescript
const billing = await sdk.billing.getBillingInfo();
console.log(billing.data);
```

---

### `getBillingHistory(pageNumber?, pageSize?)`

Get paginated credit usage history.

**Auth required:** Yes

**HTTP:** `GET /credits/history`

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `pageNumber` | `number` | Page number |
| `pageSize` | `number` | Items per page |

### Response — `BillingHistoryResponse`

```typescript
{
  list: Array<{
    id: string;
    amount: number;
    business_id: string;
    user_id: string;
    credit_type: string;
    reason: string;
    created_at: string;
    valid_from: string;
    expires_at: string;
    metadata: Record<string, unknown>;
  }>;
  page_meta: {
    page: number;
    limit: number;
    total: number;
    next_page?: number;
    total_pages: number;
  };
}
```

### Example

```typescript
const history = await sdk.billing.getBillingHistory(1, 20);
console.log(history.data.list);
```

---

### `getPricingPlans()`

List available subscription pricing plans.

**Auth required:** Yes

**HTTP:** `GET /subscription/plans`

**Parameters:** None

### Response — `PricingPlansResponse`

Array of plan objects (backend-defined schema).

### Example

```typescript
const plans = await sdk.billing.getPricingPlans();
console.log(plans.data);
```

---

### `getCreditBalance()`

Get the current credit balance for the account.

**Auth required:** Yes

**HTTP:** `GET /credits/balance`

**Parameters:** None

### Response — `CreditBalanceResponse`

```typescript
{
  plan_balance: number;
  purchased_balance?: number;
}
```

### Example

```typescript
const balance = await sdk.billing.getCreditBalance();
console.log('Plan credits:', balance.data.plan_balance);
console.log('Purchased credits:', balance.data.purchased_balance);
```

---

### `requestPlan(options)`

Request a new subscription plan.

**Auth required:** Yes

**HTTP:** `POST /subscription/request`

### Parameters — `RequestPlan`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plan_id` | `string` | Yes | Plan ID to subscribe to |
| `auto_pay` | `boolean` | Yes | Enable automatic payments |
| `provider` | `'MANUAL'` | Yes | Payment provider (currently `MANUAL` only) |

### Response — `SubscriptionInfo`

```typescript
{
  subscription_id: string;
  business_id: string;
  plan_id: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PENDING_PAYMENT';
  started_at?: string;
  expires_at?: string;
  created_at: string;
}
```

### Example

```typescript
const subscription = await sdk.billing.requestPlan({
  plan_id: 'plan_starter',
  auto_pay: true,
  provider: 'MANUAL',
});
```

---

### `getPlanStatus()`

Get the current subscription status.

**Auth required:** Yes

**HTTP:** `GET /subscription/status`

**Parameters:** None

### Response — `SubscriptionInfo`

Same shape as `requestPlan` response.

### Example

```typescript
const status = await sdk.billing.getPlanStatus();
console.log(status.data.status); // 'ACTIVE' | 'CANCELLED' | 'PENDING_PAYMENT'
```

---

### `upgradePlan(options)`

Upgrade an existing subscription to a higher plan.

**Auth required:** Yes

**HTTP:** `POST /subscription/upgrade?subscriptionID={id}&newPlanID={id}`

### Parameters — `UpgradePlan`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subscriptionID` | `string` | Yes | Current subscription ID |
| `newPlanID` | `string` | Yes | Target plan ID |

### Response — `SubscriptionInfo`

### Example

```typescript
await sdk.billing.upgradePlan({
  subscriptionID: 'sub_abc123',
  newPlanID: 'plan_pro',
});
```

---

### `cancelPlan(options)`

Cancel an active subscription.

**Auth required:** Yes

**HTTP:** `POST /subscription/cancel?subscriptionID={id}`

### Parameters — `CancelPlan`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subscriptionId` | `string` | Yes | Subscription ID to cancel |

### Response — `SubscriptionInfo`

### Example

```typescript
await sdk.billing.cancelPlan({
  subscriptionId: 'sub_abc123',
});
```

---

### `creditsTopUp(options)`

Top up account credits.

**Auth required:** Yes

**HTTP:** `POST /credits/topup`

### Parameters — `TopUpCredits`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `number` | Yes | Credit amount to purchase |
| `provider` | `'MANUAL' \| 'STRIPE' \| 'PAYPAL'` | Yes | Payment provider |

### Response — `SubscriptionInfo`

### Example

```typescript
await sdk.billing.creditsTopUp({
  amount: 100,
  provider: 'STRIPE',
});
```

---

### `getGraph(granularity)`

Get credit usage graph data over time.

**Auth required:** Yes

**HTTP:** `GET /credits/graph?granularity={value}`

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `granularity` | `string` | Yes | Time granularity (e.g. `'daily'`, `'weekly'`, `'monthly'`) |

### Response — `GraphDataResponse`

```typescript
Array<{
  date: string;
  used: number;
}>
```

### Example

```typescript
const graph = await sdk.billing.getGraph('daily');
console.log(graph.data);
```

---

### `getInvoiceList(page?, size?)`

List platform billing invoices (Neucron subscription invoices, not business customer invoices).

**Auth required:** Yes

**HTTP:** `GET /payment-invoice/list`

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `pageNumber` | `number` | Page number (mapped from `page` argument) |
| `pageSize` | `number` | Items per page (mapped from `size` argument) |

### Response — `InvoiceListResponse`

Backend-defined invoice list object.

### Example

```typescript
const invoices = await sdk.billing.getInvoiceList(1, 10);
console.log(invoices.data);
```

---

### `raisePaymentForInvoice(options)`

Initiate payment for a platform billing invoice.

**Auth required:** Yes

**HTTP:** `POST /payment-invoice/payment?invoiceID={id}`

### Parameters — `RaisePayment`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoiceId` | `string` | Yes | Invoice ID to pay |

### Response — `SubscriptionInfo`

### Example

```typescript
await sdk.billing.raisePaymentForInvoice({
  invoiceId: 'inv_platform_123',
});
```

---

### `getPaymentHistory(subscriptionId, page?, size?)`

Get payment history for a subscription.

**Auth required:** Yes

**HTTP:** `GET /payment-invoice/payment/history`

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `subscriptionId` | `string` | Yes | Subscription ID |
| `page` | `number` | No | Page number |
| `size` | `number` | No | Items per page |

### Response — `PaymentHistoryResponse`

```typescript
{
  list: Array<Record<string, unknown>>;
  page_meta: {
    page: number;
    limit: number;
    total: number;
    next_page?: number;
    total_pages: number;
  };
}
```

### Example

```typescript
const history = await sdk.billing.getPaymentHistory('sub_abc123', 1, 10);
console.log(history.data.list);
```

---

### `downloadInvoice(paymentId)`

Download a platform billing invoice document.

**Auth required:** Yes

**HTTP:** `GET /business/payment-invoices/{paymentId}`

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `paymentId` | `string` | Yes | Payment/invoice ID |

### Response

Backend-defined (typically PDF or file data).

### Example

```typescript
const invoice = await sdk.billing.downloadInvoice('payment_abc123');
```

---

### `getPaymentMethods()`

List saved payment methods for the account.

**Auth required:** Yes

**HTTP:** `GET /billing/payment-methods`

**Parameters:** None

### Response — `PaymentMethodsResponse`

```typescript
Array<{
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  details: Record<string, unknown>;
  isDefault: boolean;
}>
```

### Example

```typescript
const methods = await sdk.billing.getPaymentMethods();
console.log(methods.data);
```

---

### `addPaymentMethod(paymentData)`

Add a new payment method.

**Auth required:** Yes

**HTTP:** `POST /billing/payment-methods`

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `paymentData` | `Record<string, unknown>` | Yes | Payment method details (provider-specific) |

### Response — `PaymentMethodsResponse`

Returns the updated list of payment methods.

### Example

```typescript
await sdk.billing.addPaymentMethod({
  type: 'card',
  token: 'tok_stripe_123',
});
```

---

### Billing Workflow Example

```typescript
// Check current plan and credits
const billing = await sdk.billing.getBillingInfo();
const balance = await sdk.billing.getCreditBalance();
const status = await sdk.billing.getPlanStatus();

console.log('Billing info:', billing.data);
console.log('Credits:', balance.data.plan_balance);
console.log('Plan status:', status.data.status);

// Upgrade if needed
if (status.data.plan_id !== 'plan_pro') {
  await sdk.billing.upgradePlan({
    subscriptionID: status.data.subscription_id,
    newPlanID: 'plan_pro',
  });
}

// Top up credits
await sdk.billing.creditsTopUp({
  amount: 100,
  provider: 'STRIPE',
});

// View usage over time
const usage = await sdk.billing.getGraph('monthly');
console.log(usage.data);
```
