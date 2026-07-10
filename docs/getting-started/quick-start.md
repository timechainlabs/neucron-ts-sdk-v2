# Quick Start

This guide walks you through authenticating and making your first calls with the Neucron TypeScript SDK.

## 1. Initialize the SDK

```typescript
import NeucronSDK from '@neucron/ts-sdk';

const sdk = new NeucronSDK();
```

You can optionally pass a pre-existing auth token:

```typescript
const sdk = new NeucronSDK({
  authToken: 'your-existing-jwt-token',
});
```

## 2. Sign Up (new users)

```typescript
const signUpResult = await sdk.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  first_name: 'Jane',
  last_name: 'Doe',
  platform: 'NEUCRON',
});

console.log(signUpResult.data);
// {
//   paymail_id: 'jane@...',
//   token: 'eyJhbG...',
//   user_id: 'usr_...',
//   wallet_id: 'wal_...'
// }
```

{% hint style="info" %}
Sign-up automatically creates a default wallet and Paymail for the user, and returns an auth token.
{% endhint %}

## 3. Log In

```typescript
const loginResult = await sdk.auth.login({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});

console.log(loginResult.data.token);
// Token is automatically stored — all subsequent calls use it
```

After `login()`, the SDK stores the token internally. You do not need to pass it manually to other services.

## 4. Get User Info

```typescript
const userInfo = await sdk.auth.userInfo();
console.log(userInfo.data);
```

## 5. List Wallets

```typescript
const wallets = await sdk.wallet.walletList();
console.log(wallets.data);
```

## 6. Create a Wallet

```typescript
const newWallet = await sdk.wallet.createWallet({
  walletName: 'Business Wallet',
  paymailName: 'businesswallet',
});

console.log(newWallet.data.wallet_id);
```

## 7. Work in Business Context

Most business features require a `businessId`. Pass it per request:

```typescript
const invoices = await sdk.invoice.getInvoices({
  businessId: 'biz_abc123',
  pageNumber: 1,
  pageSize: 10,
});
```

## Complete Example

```typescript
import NeucronSDK, { NeucronError } from '@neucron/ts-sdk';

async function main() {
  const sdk = new NeucronSDK();

  try {
    // Authenticate
    await sdk.auth.login({
      email: process.env.NEUCRON_EMAIL!,
      password: process.env.NEUCRON_PASSWORD!,
    });

    // Personal wallet operations
    const wallets = await sdk.wallet.walletList();
    console.log('Wallets:', wallets.data);

    // Business operations
    const businesses = await sdk.business.getBusinessList();
    const businessId = businesses.data[0]?.business_id as string | undefined;

    if (businessId) {
      const customers = await sdk.customer.getCustomers({
        businessId,
        page: 1,
        size: 20,
      });
      console.log('Customers:', customers.data);
    }
  } catch (err) {
    if (err instanceof NeucronError) {
      console.error(`[${err.type}] ${err.message}`);
      if (err.type === 'validation') {
        console.error('Issues:', err.issues);
      }
    } else {
      throw err;
    }
  }
}

main();
```

## Log Out

```typescript
await sdk.auth.logout();
// Clears the stored token; protected methods will throw until you log in again
```

## What's Next?

- [Overview](overview.md) — Configuration, auth, headers, responses, and errors
- [Features Overview](../features/overview.md) — Full SDK function documentation by feature
