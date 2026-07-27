# Billing & Subscriptions

## What is platform billing?

**Billing** here means Neucron **platform** subscription and credits — not customer invoices. Use this service to:

- View current plan and credit balances
- Browse pricing plans
- Request, upgrade, or cancel subscriptions
- Top up credits (manual / Stripe / PayPal)
- Inspect billing history and usage graphs
- Manage platform invoices and payment methods

### Subscription status

| Status            | Meaning          |
| ----------------- | ---------------- |
| `ACTIVE`          | Plan is active   |
| `CANCELLED`       | Cancelled        |
| `PENDING_PAYMENT` | Awaiting payment |

### Credit top-up providers

`MANUAL` | `STRIPE` | `PAYPAL`

Access via `sdk.billing`.

---

## Account overview

### `getBillingInfo`

| Parameters        | None                            |
| ----------------- | ------------------------------- |
| **Auth required** | Yes                             |
| **Headers**       | `Authorization`, `X-Identifier` |
| **Response**      | `BillingInfoResponse`           |

### Request Payload

```json
null
```

```typescript
const { data } = await sdk.billing.getBillingInfo();
```

---

### `getCreditBalance`

| Parameters   | None                                   |
| ------------ | -------------------------------------- |
| **Response** | `{ plan_balance, purchased_balance? }` |

### Request Payload

```json
null
```

```typescript
const { data } = await sdk.billing.getCreditBalance();
```

---

### `getBillingHistory`

| Parameters   | `pageNumber?`, `pageSize?` (query) |
| ------------ | ---------------------------------- |
| **Response** | `BillingHistoryResponse`           |

### Request Payload

```json
{
    "pageNumber": 1,
    "pageSize": 20
}
```

```typescript
const { data } = await sdk.billing.getBillingHistory(1, 20);
```

---

### `getGraph`

Credit usage over time.

| Parameters   | `granularity: string` (query) |
| ------------ | ----------------------------- |
| **Response** | `GraphDataResponse`           |

### Request Payload

```json
{
    "granularity": "monthly"
}
```

```typescript
const { data } = await sdk.billing.getGraph('monthly');
```

---

## Plans & subscriptions

### `getPricingPlans`

| Parameters   | None                   |
| ------------ | ---------------------- |
| **Response** | `PricingPlansResponse` |

### Request Payload

```json
null
```

---

### `requestPlan`

| Parameters       | Plan request body (`RequestPlan`) |
| ---------------- | --------------------------------- |
| **Request body** | Plan selection payload            |
| **Response**     | `SubscriptionInfo`                |

### Request Payload

```json
{
    "plan_id": "plan_pro",
    "auto_pay": true,
    "provider": "MANUAL"
}
```

```typescript
const { data } = await sdk.billing.requestPlan({
    plan_id: 'plan_pro',
    auto_pay: true,
    provider: 'MANUAL',
});
```

---

### `getPlanStatus`

| Parameters   | None               |
| ------------ | ------------------ |
| **Response** | `SubscriptionInfo` |

### Request Payload

```json
null
```

---

### `upgradePlan`

| Parameters   | `subscriptionID`, `newPlanID` (query) |
| ------------ | ------------------------------------- |
| **Response** | `SubscriptionInfo`                    |

### Request Payload

```json
{
    "subscriptionID": "sub_1",
    "newPlanID": "plan_pro"
}
```

```typescript
await sdk.billing.upgradePlan({
    subscriptionID: 'sub_1',
    newPlanID: 'plan_pro',
});
```

---

### `cancelPlan`

| Parameters   | `subscriptionId` (query `subscriptionID`) |
| ------------ | ----------------------------------------- |
| **Response** | `SubscriptionInfo`                        |

### Request Payload

```json
{
    "subscriptionId": "sub_1"
}
```

```typescript
await sdk.billing.cancelPlan({ subscriptionId: 'sub_1' });
```

---

### `creditsTopUp`

| Parameters   | Body `{ amount, provider: 'MANUAL' \| 'STRIPE' \| 'PAYPAL' }` |
| ------------ | ------------------------------------------------------------- |
| **Response** | `SubscriptionInfo`                                            |

### Request Payload

```json
{
    "amount": 100,
    "provider": "STRIPE"
}
```

```typescript
await sdk.billing.creditsTopUp({
    amount: 100,
    provider: 'STRIPE',
});
```

---

## Platform invoices & payments

### `getInvoiceList`

| Parameters   | `page?`, `size?` → query `pageNumber`, `pageSize` |
| ------------ | ------------------------------------------------- |
| **Response** | `InvoiceListResponse`                             |

### Request Payload

```json
{
    "page": 1,
    "size": 20
}
```

---

### `raisePaymentForInvoice`

| Parameters   | `invoiceId` (query `invoiceID`) |
| ------------ | ------------------------------- |
| **Response** | `SubscriptionInfo`              |

### Request Payload

```json
{
    "invoiceId": "plat_inv_1"
}
```

```typescript
await sdk.billing.raisePaymentForInvoice({ invoiceId: 'plat_inv_1' });
```

---

### `getPaymentHistory`

| Parameters   | `subscriptionId`, `page?`, `size?` |
| ------------ | ---------------------------------- |
| **Query**    | `subscription_id`, `page`, `size`  |
| **Response** | `PaymentHistoryResponse`           |

### Request Payload

```json
{
    "subscriptionId": "sub_1",
    "page": 1,
    "size": 20
}
```

---

### `downloadInvoice`

| Parameters   | `paymentId: string`                      |
| ------------ | ---------------------------------------- |
| **Response** | Download payload (PDF / binary metadata) |

### Request Payload

```json
{
    "paymentId": "pay_1"
}
```

```typescript
const { data } = await sdk.billing.downloadInvoice('pay_1');
```

---

## Payment methods

### `getPaymentMethods`

| Parameters   | None                     |
| ------------ | ------------------------ |
| **Response** | `PaymentMethodsResponse` |

### Request Payload

```json
null
```

---

### `addPaymentMethod`

| Parameters   | `paymentData: Record<string, unknown>` (body) |
| ------------ | --------------------------------------------- |
| **Response** | `PaymentMethodsResponse`                      |

### Request Payload

```json
{
    "paymentData": {
        "type": "card",
        "token": "tok_visa_4242",
        "isDefault": true
    }
}
```

```typescript
await sdk.billing.addPaymentMethod({
    paymentData: {
        type: 'card',
        token: 'tok_visa_4242',
        isDefault: true,
    },
});
```
