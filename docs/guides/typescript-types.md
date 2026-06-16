# TypeScript Types

The SDK exports all request and response types from the package entry point. Import them for type-safe application code.

## Importing Types

```typescript
import NeucronSDK, {
  NeucronError,
  // Authentication
  LoginBody,
  LoginResponse,
  SignUpBody,
  SignupResponse,
  // Wallet
  CreateWalletBody,
  CreateWalletReponse,
  WalletListResponse,
  // Add more as needed
} from '@neucron/ts-sdk';
```

## Exported Type Modules

| Module | Key Types |
|--------|-----------|
| `authentication/types` | `LoginBody`, `SignUpBody`, `UserInfoResponse`, `Platform` |
| `wallet/types` | `CreateWalletBody`, `SyncAsset`, `Transactions` |
| `assets/types` | `TransferAsset`, `LedgerList`, `Balances` |
| `asset21/types` | `Deploy`, `Transfer`, `GetUnspentUTXOs` |
| `asset-swap/types` | `SwapAssets`, `SwapRate` |
| `pay/types` | `PayRequestInput`, `PayResponse` |
| `paymail/types` | `CreatePaymailBody`, `PaymailListResponse` |
| `utility/types` | `CreateUtility`, `MintUtility`, `RedeemUtility` |
| `data-integrity/types` | `FileUpload`, `TextUpload` |
| `team/types` | `CreateInvite`, `MemberList` |
| `business/types` | `GetBusinessDetails`, `BusinessListResponse` |
| `members/types` | `CreateInvites`, `AssignRoles` |
| `rbac/types` | `CreateRole`, `PermissionsResponse` |
| `apps/types` | `CreateApp`, `AppSecretResponse` |
| `blob/types` | `UploadDocument`, `UploadDocumentResponse` |
| `invoice/types` | `CreateInvoice`, `PaymentSession`, `InvoicesListResponse` |
| `customer/types` | `CreateCustomer`, `CustomerResponse` |
| `vendor/types` | `CreateVendor`, `PayVendor` |
| `bill/types` | `CreateBill`, `PayBill` |
| `payout/types` | `CreatePayout`, `ConfirmPayout` |
| `billing/types` | `RequestPlan`, `SubscriptionInfo`, `CreditBalanceResponse` |

## HttpResponse Generic

All service methods return:

```typescript
interface HttpResponse<T> {
  data: T;
  headers: Record<string, string>;
  status: number;
}
```

Use the generic when writing wrapper functions:

```typescript
import type { HttpResponse } from '@neucron/ts-sdk';
import type { WalletListResponse } from '@neucron/ts-sdk';

async function fetchWallets(
  sdk: NeucronSDK
): Promise<HttpResponse<WalletListResponse>> {
  return sdk.wallet.walletList();
}
```

## Platform & Identifier Enums

```typescript
type Platform = 'NEUCRON' | 'ASSETYZER' | 'CERTIFICATE' | 'TICKETING';
type Identifier = 'NEUCRON' | 'ASSETYZER';
```

## Zod Schema Inference

Types are inferred from Zod schemas at build time. If you need to extend validation:

```typescript
import { z } from 'zod';

const customLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

type CustomLogin = z.infer<typeof customLoginSchema>;
```

> The SDK's internal validators use the bundled schemas. Custom schemas are for your application layer only.

## NeucronError Type Guard

```typescript
import { NeucronError } from '@neucron/ts-sdk';

function isNeucronError(err: unknown): err is NeucronError {
  return err instanceof NeucronError;
}
```

## IDE Autocomplete Tips

1. Instantiate the SDK and type `sdk.` — your IDE will list all 20 services
2. Hover over any method to see its parameter type
3. Use `import type` for types-only imports to avoid runtime overhead:

```typescript
import type { CreateInvoice } from '@neucron/ts-sdk';

const invoiceData: CreateInvoice = {
  businessId: 'biz_123',
  invoiceData: { /* ... */ },
};
```
