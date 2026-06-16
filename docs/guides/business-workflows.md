# Business Context Workflows

This guide covers common multi-tenant patterns when building applications on top of the Neucron SDK.

## Understanding Business Context

Neucron supports **personal** and **business** workspaces. Business-scoped APIs require the `X-Neucron-Business-ID` header, which you set by passing `businessId` on SDK method calls.

```
Personal account          Business account
     │                         │
     ▼                         ▼
sdk.wallet.*            sdk.invoice.*
sdk.assets.*            sdk.customer.*
sdk.pay.*               sdk.vendor.*
                        sdk.bill.*
                        sdk.payout.*
                        sdk.members.*
                        sdk.rbac.*
```

## Workflow 1: Onboard a New Business User

```typescript
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK();

async function onboardUser(email: string, password: string) {
  // 1. Register
  await sdk.auth.signUp({
    email,
    password,
    platform: 'NEUCRON',
    first_name: 'Business',
    last_name: 'Owner',
  });

  // 2. Login
  await sdk.auth.login({ email, password });

  // 3. List businesses (may be empty for new users)
  const businesses = await sdk.business.getBusinessList();

  return businesses.data;
}
```

## Workflow 2: Invoice-to-Payment Flow

```typescript
async function createAndCollectPayment(
  sdk: NeucronSDK,
  businessId: string,
  customerEmail: string,
  amount: number
) {
  // Create or find customer
  const customer = await sdk.customer.createCustomer({
    businessId,
    customerData: { name: 'Client', email: customerEmail },
  });

  // Create invoice
  const invoice = await sdk.invoice.createInvoice({
    businessId,
    invoiceData: {
      customer_id: customer.data.customer_id,
      line_items: [{ description: 'Service', amount, quantity: 1 }],
    },
  });

  // Finalize
  await sdk.invoice.finaliseInvoice({
    businessId,
    invoiceId: invoice.data.invoice_id,
  });

  // Create payment session for checkout page
  const session = await sdk.invoice.createPaymentSession({
    businessId,
    invoiceId: invoice.data.invoice_id,
  });

  // Share invoice via email
  await sdk.invoice.shareInvoice({
    businessId,
    invoiceId: invoice.data.invoice_id,
    email: customerEmail,
  });

  return session.data;
}
```

## Workflow 3: Team Collaboration Setup

```typescript
async function setupTeam(
  sdk: NeucronSDK,
  businessId: string,
  teamMembers: Array<{ email: string; role: string }>
) {
  // Create custom roles
  await sdk.rbac.createRole({
    businessId,
    role: { name: 'Finance', permissions: ['invoice:*', 'payout:*'] },
  });

  // Invite members
  for (const member of teamMembers) {
    await sdk.members.createInvites({
      businessId,
      invites: [{ email: member.email, role: member.role }],
    });
  }

  // Verify members
  const members = await sdk.members.getMembers({ businessId });
  return members.data;
}
```

## Workflow 4: Vendor Bill Processing

```typescript
async function processVendorBill(
  sdk: NeucronSDK,
  businessId: string,
  vendorId: string,
  amount: number,
  walletID: string
) {
  const bill = await sdk.bill.createBill({
    businessId,
    billData: { vendor_id: vendorId, amount },
  });

  await sdk.bill.reviewBill({
    businessId,
    billId: bill.data.bill_id,
  });

  await sdk.bill.confirmBill({
    businessId,
    billId: bill.data.bill_id,
  });

  await sdk.bill.payBill({
    businessId,
    billId: bill.data.bill_id,
    walletID,
  });
}
```

## Workflow 5: Server-Side Session Pattern

For backend applications, store tokens securely per user session:

```typescript
// Express.js example
import NeucronSDK from '@neucron/ts-sdk';

const sdkInstances = new Map<string, NeucronSDK>();

function getSdkForUser(userId: string): NeucronSDK {
  if (!sdkInstances.has(userId)) {
    const sdk = new NeucronSDK();
    sdkInstances.set(userId, sdk);
  }
  return sdkInstances.get(userId)!;
}

app.post('/api/login', async (req, res) => {
  const sdk = getSdkForUser(req.body.userId);
  await sdk.auth.login({
    email: req.body.email,
    password: req.body.password,
  });
  res.json({ success: true });
});

app.get('/api/wallets', async (req, res) => {
  const sdk = getSdkForUser(req.user.id);
  const wallets = await sdk.wallet.walletList();
  res.json(wallets.data);
});
```

## Best Practices

1. **Always pass `businessId`** on business-scoped calls — do not rely on implicit defaults
2. **Handle 401 errors** by prompting re-login or refreshing the token
3. **Validate inputs client-side** before calling the SDK (the SDK also validates via Zod)
4. **Use blob upload** for documents before referencing them in invoices or bills
5. **Separate personal and business wallet operations** — use `businessId` when operating on behalf of a business
