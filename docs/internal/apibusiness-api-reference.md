# Neucron Business API Reference

> Generated from `src/services/apibusiness.ts` and related types across the Neucron Console codebase.

---

## Table of Contents

1. [Common Configuration](#1-common-configuration)
2. [Wallet](#2-wallet)
3. [Wallet Assets & Operations](#3-wallet-assets--operations)
4. [Asset Swap](#4-asset-swap)
5. [Public Assets](#5-public-assets)
6. [Apps](#6-apps)
7. [Business / Team](#7-business--team)
8. [Members](#8-members)
9. [RBAC (Roles & Permissions)](#9-rbac-roles--permissions)
10. [Blob / Document Upload](#10-blob--document-upload)
11. [Invoices & Payment Collections](#11-invoices--payment-collections)
12. [Customers](#12-customers)
13. [Vendors](#13-vendors)
14. [Vendor Bills](#14-vendor-bills)
15. [Payouts](#15-payouts)
16. [Billing & Subscriptions](#16-billing--subscriptions)

---

## 1. Common Configuration

### Base URL

```
{VITE_API_BASE_URL}
```

Configured via environment variable `import.meta.env.VITE_API_BASE_URL`.

### Axios Instance

**Export:** `apibusiness` (default axios instance)

### Automatic Request Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json` | Overridden to `multipart/form-data` for file uploads |
| `Authorization` | `{token}` | From `localStorage.getItem("token")` |
| `X-Neucron-Business-ID` | Business ID | From param or `localStorage.getItem("selectedBusiness")` (skipped if `"personal"`) |
| `X-Identifier` | `NEUCRON` | Required for token validation on non-auth endpoints |

### Helper

```typescript
businessHeader(businessId?: string) =>
  businessId ? { "X-Neucron-Business-ID": businessId } : {}
```

### Pagination Schema (common)

```typescript
interface PageMeta {
  page: number;
  limit: number;
  total: number;
  next_page: number;
  total_pages: number;
}
```

### Error Response (typical)

```typescript
{ error: string } | { message: string }
```

---

## 2. Wallet

**Client export:** `businesswalletApi`

Basic wallet listing and asset ledger operations.

---

### 2.1 Get Asset Ledger List

| | |
|---|---|
| **Function** | `businesswalletApi.getAssets(pageNumber?, pageSize?, walletID?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/asset/ledgerlist?pageNumber={n}&pageSize={n}&walletID={id}` |

**Query Parameters**

| Param | Type | Default | Required |
|-------|------|---------|----------|
| `pageNumber` | `number` | `1` | No |
| `pageSize` | `number` | `5` | No |
| `walletID` | `string` | — | No |

**Request Body:** `[]` (empty array)

**Response Type:** `AssetApiResponse`

```typescript
interface AssetApiResponse {
  list: Asset[];
  page_meta: {
    page: number;
    limit: number;
    total_pages: number;
    total: number;
    next_page?: number;
  };
}
```

**Asset (ledger item)** — from `assetSlice.ts`:

```typescript
interface Asset {
  user_id: string;
  asset_name: string;
  asset_id: string;
  assetID: string;
  utxo_id: string;
  tx_id: string;
  wallet_id: string;
  type: string;
  symbol?: string;
  amount: number;
  currency?: string;
  image_url: string;
  asset_type: string;
  status: 'MINTED' | 'CHANGE' | 'CREDITED' | 'SPENT' | 'DEBITED';
  total_holdings: number;
  total_holdings_fiat: number;
  market_data: MarketData;
  asset_info: AssetInfo;
  // ... additional fields for tickets/certificates
}
```

---

### 2.2 Sync Wallet

| | |
|---|---|
| **Function** | `businesswalletApi.syncAsset(walletID, network, businessId?)` |
| **Method** | `POST` |
| **Path** | `/wallet/sync?walletID={id}&network={MAIN\|TEST}` |

**Query Parameters**

| Param | Type | Required |
|-------|------|----------|
| `walletID` | `string` | Yes |
| `network` | `"MAIN" \| "TEST"` | Yes |

**Request Body:** `{}`

**Response:** Backend-defined sync result

---

### 2.3 Get Wallet List

| | |
|---|---|
| **Function** | `businesswalletApi.getWalletList(businessId?)` |
| **Method** | `GET` |
| **Path** | `/wallet/list` |

**Response:** `Wallet[]`

```typescript
interface Wallet {
  wallet_id: string;
  wallet_name: string;
  paymail_id?: string;
  is_default?: boolean;
  paymail_alias?: string;
  provider?: string;
  wallet_type?: string;
  user_id?: string;
  neucron_cloud_status?: string;
  neucron_cloud_synced?: boolean;
  cloud_sync_status?: string;
  cloud_synced?: boolean;
  cloud_backup_status?: string;
  cloud_backup_synced?: boolean;
  backup_status?: string;
  backup_synced?: boolean;
}
```

---

## 3. Wallet Assets & Operations

**Client export:** `businessotherAssetsApi`

Extended wallet management: creation, assets, balances, transactions, recovery, and owned-asset details.

---

### 3.1 Create Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.createWallet(businessId, params)` |
| **Method** | `POST` |
| **Path** | `/wallet/create` |

**Query Parameters**

| Param | Type | Required |
|-------|------|----------|
| `walletName` | `string` | Yes |
| `paymailName` | `string` | No (defaults to `walletName`) |
| `walletType` | `string` | Yes |
| `custodianProvider` | `string` | No |
| `customCustodianEndpoint` | `string` | No |
| `provider` | `string` | No |

**Request Body:** `{}`

**Response:** `{ message?: string }`

---

### 3.2 Create BSV Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.createBSVWallet(businessId?, walletName)` |
| **Method** | `POST` |
| **Path** | `/wallet/create?walletName={name}&paymailName={name}` |

**Response:** `{ message?: string }`

---

### 3.3 Get Available Assets

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getAvailableAssets(businessId?, walletID?, offset?, limit?, search?, chain?, network?)` |
| **Method** | `GET` |
| **Path** | `/wallet/assets` |

**Query Parameters**

| Param | Type | Default |
|-------|------|---------|
| `offset` | `number` | `0` |
| `limit` | `number` | `5` |
| `walletID` | `string` | — |
| `search` | `string` | — |
| `chain` | `string` | — (skipped if `"All"`) |
| `network` | `"MAIN" \| "TEST"` | — |

**Response:**

```typescript
{ list: Asset[] }
```

---

### 3.4 Add Asset to Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.addAssetToWallet(businessId?, walletID, assetID)` |
| **Method** | `POST` |
| **Path** | `/wallet/asset/add?walletID={id}&assetID={id}` |

**Response:** `{ message: string }`

---

### 3.5 Remove Asset from Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.removeAssetFromWallet(businessId?, walletID, assetID)` |
| **Method** | `DELETE` |
| **Path** | `/wallet/asset/remove?walletID={id}&assetID={id}` |

**Response:** `{ message: string }`

---

### 3.6 Get Account Wallets

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getAccountWallets(businessId?)` |
| **Method** | `GET` |
| **Path** | `/wallet/list` |

**Response:** `Wallet[]` (same as §2.3)

---

### 3.7 Get Wallet Addresses

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getWalletAddresses(businessId?, walletID, network)` |
| **Method** | `GET` |
| **Path** | `/wallet/addresses` |

**Query Parameters:** `walletID`, `network` (`"MAIN" | "TEST"`)

**Response:** `WalletAddress[]`

```typescript
interface WalletAddress {
  wallet_id: string;
  address: string;
  chain: string;
}
```

---

### 3.8 Get Asset Balances

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getAssetBalances(businessId?, walletID, network, currency?)` |
| **Method** | `GET` |
| **Path** | `/asset/balances` |

**Query Parameters:** `walletID`, `network`, optional `currency`

**Response:** `Balance`

```typescript
interface Balance {
  total_balance: {
    usd?: number;
    [currency: string]: number | undefined;
  };
  asset_balance: AssetBalance[];
}

interface AssetBalance {
  asset_id: string;
  amount: number;
  usd_value?: number;
  [key: string]: any;
}
```

---

### 3.9 Set Default Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.setDefaultWallet(businessId?, walletID)` |
| **Method** | `PUT` |
| **Path** | `/wallet/default?walletID={id}` |

**Response:** `{ message: string }`

---

### 3.10 Recover Wallet

| | |
|---|---|
| **Function** | `businessotherAssetsApi.recoverWallet(businessId?, payload)` |
| **Method** | `POST` |
| **Path** | `/wallet/recover?walletID={wallet_id}` |

**Request Body:**

```typescript
{ keyshard: string }  // from payload.key_shard
```

**Response:** `{ message: string }`

---

### 3.11 Get Transaction History

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getTransactions(businessId?, walletID, page, limit, chain?, network?)` |
| **Method** | `GET` |
| **Path** | `/wallet/history` |

**Response:**

```typescript
{
  list: Transaction[];
  page_meta: PageMeta;
}

interface Transaction {
  amount: number;
  asset_id: string;
  block: number;
  chain: string;
  contract_address: string;
  from_addr: string;
  network: string;
  status: string;
  to_addr: string;
  tx_type: string;
  txid: string;
  image_url: string;
  tags: string[];
  wallet_id: string;
  created_at: string;
  tx_link?: string;
  decimals?: number;
}
```

---

### 3.12 Get Transaction Details

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getTransactionDetails(businessId?, txid, chain, network, walletID)` |
| **Method** | `GET` |
| **Path** | `/wallet/transaction` |

**Response:** `TransactionDetails`

```typescript
interface TransactionDetails {
  amount: string;
  asset_id: string;
  asset_name: string;
  asset_type: string;
  symbol: string;
  image_url: string;
  decimals: number;
  txid: string;
  status: "SYNCED" | string;
  chain: string;
  network: "MAIN" | "TEST" | string;
  currency: string;
  fiat_amount: number;
  direction: string;
  source: string;
  block_timestamp: number;
  created_at: string;
  height: number;
  chain_image_url: string;
  tx_link: string;
  tags: string[];
  from_address: string[];
  to_address: string;
  from_parties: Party[];
  to_party: Party;
  fee_break_down: { network_fee: string; neucron_credits: number };
  inputs: Input[];
  outputs: Output[];
}
```

---

### 3.13 Get Owned Asset Details

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getOwnedAssetDetails(assetID, walletID, businessId?)` |
| **Method** | `GET` |
| **Path** | `/asset/owned/details` |

**Response:** `AssetDetails`

```typescript
interface AssetDetails {
  app_id: string;
  asset_id: string;
  asset_name: string;
  asset_type: "CERTIFICATE" | "TICKET" | string;
  symbol: string;
  chain: string;
  chain_image_url: string;
  network: "MAIN" | "TEST" | string;
  protocol: "NATIVE" | string;
  image_url: string;
  decimals: number;
  legal_term: string;
  minted_at: string;
  status: "DRAFTED" | string;
  total_holdings: string;
  total_holdings_fiat: number;
  total_supply: number;
  user_id: string;
  wallet_id: string;
  team_id: string;
  asset_info: { created: string; socials: { telegram: string; twitter: string }; website: string };
  market_data: { circulating_supply_percent: number; market_cap: number; volume_24h: number };
  price_chart: { "1h": number[][]; "1d": number[][]; "1w": number[][]; "1m": number[][]; "1mo": number[][] };
  recent_transaction: RecentTransaction[];
  token_detail: Record<string, any>;
}
```

---

### 3.14 Get Event Details

| | |
|---|---|
| **Function** | `businessotherAssetsApi.getEventDetails(eventId, businessId?)` |
| **Method** | `GET` |
| **Path** | `/event/details?eventID={id}` |

**Response:** `EventDetailsResponse`

```typescript
interface EventDetailsResponse {
  event?: {
    app_id?: string;
    business_id?: string;
    created_at?: string;
    event_details?: EventDetailsPayload;
    event_id?: string;
    is_minted?: boolean;
    network?: string;
    tiers?: EventTier[];
    updated_at?: string;
    user_id?: string;
    wallet_id?: string;
  };
  payment?: {
    amount?: number;
    event_id?: string;
    paid_at?: string;
    status?: string;
    tx_id?: string;
  };
}
```

---

### 3.15 Import Asset

| | |
|---|---|
| **Function** | `businessotherAssetsApi.importAsset(businessId?, payload)` |
| **Method** | `POST` |
| **Path** | `/wallet/asset/import` |

**Request Body:**

```typescript
interface ImportAssetPayload {
  asset_name: string;
  chain: string;
  contract_address: string;
  network: string;
  symbol: string;
  wallet_id: string;
  decimals: number;
}
```

**Response:** Backend-defined

---

## 4. Asset Swap

**Client export:** `businessAssetSwapApi`

---

### 4.1 Get Swappable Assets

| | |
|---|---|
| **Function** | `businessAssetSwapApi.getSwappableAssets(businessId?)` |
| **Method** | `GET` |
| **Path** | `/asset-swap/swappable` |

**Response:** `SwappableAssetsResponse`

```typescript
interface SwappableAssetEntry {
  asset_name: string;
  asset_network: string;
}

interface SwappableAssetsResponse {
  from: SwappableAssetEntry[];
  to: SwappableAssetEntry[];
}
```

---

### 4.2 Swap Assets

| | |
|---|---|
| **Function** | `businessAssetSwapApi.swapAssets(businessId?, walletID, payload)` |
| **Method** | `POST` |
| **Path** | `/asset-swap/swap?walletID={id}` |

**Request Body:** `SwapAssetsRequest`

```typescript
interface SwapAssetsRequest {
  amount: number;
  from_asset_name: string;
  from_network_name: string;
  to_asset_name: string;
  to_network_name: string;
}
```

**Response:** `{ message: string }`

---

### 4.3 Get Swap Rate

| | |
|---|---|
| **Function** | `businessAssetSwapApi.getSwapRate(businessId?, payload)` |
| **Method** | `POST` |
| **Path** | `/asset-swap/rate` |

**Request Body:** `SwapAssetsRequest`

**Response:** `SwapRateResponse`

```typescript
interface SwapRateResponse {
  maximum_amount: number;
  minimum_amount: number;
  rate: number;
  requested_amount: number;
  swapped_amount: number;
}
```

---

## 5. Public Assets

**Client export:** `businessassetApi`

---

### 5.1 Get Public Asset List

| | |
|---|---|
| **Function** | `businessassetApi.getPublicAssetList(params?)` |
| **Method** | `GET` |
| **Path** | `/asset/public/assetlist` |

**Query Parameters**

| Param | Type | Default |
|-------|------|---------|
| `pageSize` | `number` | `100` |
| `searchQuery` | `string` | — |
| `type` | `string` | — |
| `pageNumber` | `number` | — |
| `network` | `string` | — |
| `chain` | `string` | — |

**Response:** Paginated public asset list (backend-defined)

---

## 6. Apps

**Client export:** `businessappsApi`

---

### 6.1 List Apps

| | |
|---|---|
| **Function** | `businessappsApi.getApps(businessId?)` |
| **Method** | `GET` |
| **Path** | `/app/list` |

**Response:** `App[]`

```typescript
interface App {
  app_name?: string;
  app_id?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  type?: string;
  color?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

### 6.2 Create App

| | |
|---|---|
| **Function** | `businessappsApi.createApp(appData, businessId?)` |
| **Method** | `POST` |
| **Path** | `/app` |

**Request Body:** `any` (app configuration object)

**Response:** Created app object

---

### 6.3 Get App Secret

| | |
|---|---|
| **Function** | `businessappsApi.getAppSecret(appId, businessId?)` |
| **Method** | `GET` |
| **Path** | `/app/secret?appID={id}` |

**Response:** App credentials / secret (backend-defined)

---

## 7. Business / Team

**Client export:** `businessteamApi`

---

### 7.1 Get Business Details

| | |
|---|---|
| **Function** | `businessteamApi.getBusinessDetails(businessId)` |
| **Method** | `GET` |
| **Path** | `/business` |

**Query Parameters:** `businessId`

**Response:** `BusinessDetails`

```typescript
interface BusinessDetails {
  pan_number: string;
  business_name: string;
  business_type: "private" | "public";
  business_model: "b2b" | "b2c" | "both";
  business_category: string;
  business_sub_category: string;
  business_id: string;
  business_description: string;
  business_purpose: string;
  cin_number: string;
  gst_number?: string;
  phoneNumber?: string;
  countryCode?: string;
  noGstin: boolean;
  business_address: Address;
  gst_address?: Address;
  sameAsGst: boolean;
  business_url?: string;
  app_link?: string;
  kyb_status?: "In Review" | "Approved" | "Declined" | "Abandoned" | "Expired" | "Not Started" | "In Progress" | "";
  platform_requests?: { platform: string; status: string }[];
  platform?: string[];
  business_logo?: string;
  is_owner?: boolean;
}
```

---

### 7.2 Get Business List

| | |
|---|---|
| **Function** | `businessteamApi.getBusinessList()` |
| **Method** | `GET` |
| **Path** | `/business/list` |

> **Note:** Uses raw `axios` (not `apibusiness` interceptor). Token from `localStorage.getItem("token")` or `vendor_invite_token`.

**Response:** Array of business/team entries

---

### 7.3 Update Business Details

| | |
|---|---|
| **Function** | `businessteamApi.updateBusinessDetails(businessId, data)` |
| **Method** | `PATCH` |
| **Path** | `/business/update?businessID={id}` |

**Request Body:** Partial `BusinessDetails` fields

**Response:** Updated business object

---

## 8. Members

**Client export:** `businessmembersApi`

---

### 8.1 Get Members

| | |
|---|---|
| **Function** | `businessmembersApi.getMembers(filters?)` |
| **Method** | `GET` |
| **Path** | `/business/members` |

**Query Parameters**

| Param | Type | Default |
|-------|------|---------|
| `memberName` | `string` | — |
| `pageNumber` | `number` | `1` |
| `limit` | `number` | `20` |

**Response:**

```typescript
{
  list: Member[];
  page_meta: PageMeta;
}

interface Member {
  business_id: string;
  team_id?: string;       // deprecated, use business_id
  user_id: string;
  email: string;
  full_name?: string;
  is_owner?: boolean;
  roles?: MemberRole[];
  status?: string;        // ACTIVE, INVITED, etc.
  avatar?: string;
  joined_at?: string;
}

interface MemberRole {
  role_id: string;
  role_name: string;
  permissions: string[];
  description?: string;
  business_id?: string;
}
```

---

### 8.2 Create Invites

| | |
|---|---|
| **Function** | `businessmembersApi.createInvites(invites, businessId?)` |
| **Method** | `POST` |
| **Path** | `/business/invites` |

**Request Body:**

```typescript
Array<{
  email: string;
  role_ids: string[];
}>
```

**Response:** `{ message: string }`

---

### 8.3 Add Member (deprecated)

| | |
|---|---|
| **Function** | `businessmembersApi.addMember(memberData)` |
| **Notes** | Wraps `createInvites`. Use `createInvites` instead. |

---

### 8.4 Get Invites

| | |
|---|---|
| **Function** | `businessmembersApi.getInvites(businessId?)` |
| **Method** | `GET` |
| **Path** | `/business/invites` |

**Response:** Pending invite list (backend-defined)

---

### 8.5 Assign Roles

| | |
|---|---|
| **Function** | `businessmembersApi.assignRoles(memberId, roleIds, options?)` |
| **Method** | `PUT` |
| **Path** | `/business/role/assign` |

**Query Parameters:** `memberID`, optional `teamID`

**Headers:** `X-Neucron-Business-ID`

**Request Body:** `string[]` (role IDs)

**Response:** `{ message: string }`

---

### 8.6 Remove Roles

| | |
|---|---|
| **Function** | `businessmembersApi.removeRoles(memberId, roleIds, options?)` |
| **Method** | `PUT` |
| **Path** | `/business/role/remove` |

Same params/headers/body as §8.5.

---

### 8.7 Remove Member

| | |
|---|---|
| **Function** | `businessmembersApi.removeMember(memberId, businessId?)` |
| **Method** | `DELETE` |
| **Path** | `/business/members?memberID={id}` |

**Response:** `{ message: string }`

---

## 9. RBAC (Roles & Permissions)

**Client export:** `businessrbacApi`

---

### 9.1 Get Permissions

| | |
|---|---|
| **Function** | `businessrbacApi.getPermissions(businessId?)` |
| **Method** | `GET` |
| **Path** | `/business/permissions` |

**Response:** `string[]` (permission identifiers)

---

### 9.2 Resolve Member Roles

| | |
|---|---|
| **Function** | `businessrbacApi.getMemberRole(businessId?)` |
| **Method** | `GET` |
| **Path** | `/business/role/resolve` |

**Response:** `TeamRole[]` or `{ error: string }`

```typescript
interface TeamRole {
  description: string;
  permissions: string[];
  role_id: string;
  role_name: string;
  business_id?: string;
  team_id?: string;  // deprecated
}
```

---

### 9.3 Get Roles

| | |
|---|---|
| **Function** | `businessrbacApi.getRoles(businessId?)` |
| **Method** | `GET` |
| **Path** | `/business/roles` |

**Response:** `TeamRole[]`

---

### 9.4 Create Role

| | |
|---|---|
| **Function** | `businessrbacApi.createRole(businessId, role)` |
| **Method** | `POST` |
| **Path** | `/business/roles` |

**Request Body:**

```typescript
interface TeamRoleUpsertRequest {
  role_name: string;
  description: string;
  permissions: string[];
}
```

**Response:** `{ message: string }`

---

### 9.5 Update Role

| | |
|---|---|
| **Function** | `businessrbacApi.updateRole(businessId, roleId, role)` |
| **Method** | `PUT` |
| **Path** | `/business/roles` |

**Request Body:** `TeamRoleUpsertRequest & { role_id: string }`

---

### 9.6 Delete Role

| | |
|---|---|
| **Function** | `businessrbacApi.deleteRole(businessId, roleId)` |
| **Method** | `DELETE` |
| **Path** | `/business/roles?roleID={id}` |

---

## 10. Blob / Document Upload

**Client exports:** `businessblobApi`, `businessinvoiceApi.uploadDocument`

---

### 10.1 Upload Document

| | |
|---|---|
| **Function** | `businessblobApi.uploadDocument(file, businessId?)` |
| **Method** | `POST` |
| **Path** | `/blob/document/upload` |
| **Content-Type** | `multipart/form-data` |

**Request Body (FormData)**

| Field | Type |
|-------|------|
| `document` | `File` |

**Response:** `{ url?: string }`

---

## 11. Invoices & Payment Collections

**Client export:** `businessinvoiceApi`

---

### 11.1 Create Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.createInvoice(invoiceData, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice` |

**Request Body (from UI payload):**

```typescript
interface CreateInvoicePayload {
  currency: string;
  customer_id: string;
  deposit_wallet: string;
  discount: number;
  due_date: string;          // ISO 8601
  invoice_number: string;
  issue_date: string;        // ISO 8601
  items: Array<{
    item_id?: string;
    id?: string;
    cost_per_unit: number;
    name: string;
    quantity: number;
    sac_code: string;
    tax_rate: number;
  }>;
  lut_number: string;
  notes: string;
  order_number: string;
  payment_option: Array<{
    asset_option: Array<{ asset_id: string; asset_name: string }>;
    chain: string;
    network: string;
  }>;
  payment_terms: string;
  round_off: boolean;
}
```

**Response:** Created invoice with `invoice_id`

---

### 11.2 List Invoices

| | |
|---|---|
| **Function** | `businessinvoiceApi.getInvoices(businessId?, pageNumber?, pageSize?, statuses?)` |
| **Method** | `POST` |
| **Path** | `/invoice/list?page={n}&size={n}` |

**Request Body:** `string[]` (status filters)

**Response:**

```typescript
{
  invoices: InvoiceItem[];
  page_meta: PageMeta;
}

interface InvoiceItem {
  created_at: string;
  currency: string;
  customer_id: string;
  deposit_wallet_id: string;
  discount: number;
  due_date: string;
  invoice_id: string;
  invoice_number: string;
  issue_date: string;
  items: LineItem[];
  lut_number: string;
  notes: string;
  order_number: string;
  payment_options: PaymentOption[];
  payment_terms: string;
  round_off: boolean;
  status: string;
  sub_total: number;
  tax_amount: number;
  team_id: string;
  total: number;
}
```

---

### 11.3 Get Invoice Details

| | |
|---|---|
| **Function** | `businessinvoiceApi.getInvoiceDetails(invoiceID, businessId?)` |
| **Method** | `GET` |
| **Path** | `/invoice?invoiceID={id}` |

**Response:** Full `InvoiceItem`

---

### 11.4 Update Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.updateInvoice(invoiceID, invoiceData, businessId?)` |
| **Method** | `PUT` |
| **Path** | `/invoice?invoiceID={id}` |

---

### 11.5 Delete Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.deleteInvoice(invoiceID, businessId?)` |
| **Method** | `DELETE` |
| **Path** | `/invoice?invoiceID={id}` |

---

### 11.6 Finalise Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.finaliseInvoice(invoiceID, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/finalise?invoiceID={id}` |

---

### 11.7 Mark Invoice as Paid

| | |
|---|---|
| **Function** | `businessinvoiceApi.markInvoiceAsPaid(invoiceID, payload, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/mark-paid?invoiceID={id}` |

**Request Body:**

```typescript
{
  paid_at: string;
  emails?: string[];
  cc?: string[];
  bcc?: string[];
  note?: string;
}
```

---

### 11.8 Share Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.shareInvoice(invoiceID, emails, sendEmail?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/share?invoiceID={id}&sendEmail={bool}` |

**Request Body:** `string[]` (email addresses)

---

### 11.9 Send Invoice Reminder

| | |
|---|---|
| **Function** | `businessinvoiceApi.sendInvoiceReminder(invoiceID, payload, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/reminder?invoiceID={id}` |

**Request Body:**

```typescript
{
  emails: string[];
  cc?: string[];
  bcc?: string[];
  note?: string;
  paid_at?: string;
}
```

---

### 11.10 Send Payment Confirmation

| | |
|---|---|
| **Function** | `businessinvoiceApi.sendPaymentConfirmation(invoiceID, payload, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/confirmation?invoiceID={id}` |

Same payload as §11.9.

---

### 11.11 Map Collection to Invoice

| | |
|---|---|
| **Function** | `businessinvoiceApi.mapCollectionToInvoice(invoiceID, collectionID, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/map-collection?invoiceID={id}&collectionID={id}` |

---

### 11.12 Submit Collection

| | |
|---|---|
| **Function** | `businessinvoiceApi.submitCollection(data, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/collection` |

**Request Body:**

```typescript
{ asset_id: string; invoice_id: string }
```

---

### 11.13 Create Payment Collection

| | |
|---|---|
| **Function** | `businessinvoiceApi.createPaymentCollection(invoiceID, supportedAssets, walletID?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/invoice/payment-collection?invoiceID={id}&walletID={id}` |

**Request Body:** `string[]` (supported asset IDs)

---

### 11.14 Update Payment Collection

| | |
|---|---|
| **Function** | `businessinvoiceApi.updatePaymentCollection(invoiceID, supportedAssets, businessId?)` |
| **Method** | `PUT` |
| **Path** | `/invoice/payment-collection?invoiceID={id}` |

**Request Body:** `string[]`

---

### 11.15 Get Invoice Payment Collections

| | |
|---|---|
| **Function** | `businessinvoiceApi.getInvoicePaymentCollections(invoiceID, businessId?)` |
| **Method** | `GET` |
| **Path** | `/invoice/payment-collection?invoiceID={id}` |

---

### 11.16 Create Payment Session

| | |
|---|---|
| **Function** | `businessinvoiceApi.createPaymentSession(collectionID, assetID, metadata?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/payment-collection/session?collectionID={id}&assetID={id}` |

**Request Body:** `Record<string, any>` (metadata, default `{}`)

---

### 11.17 Get Payment Session

| | |
|---|---|
| **Function** | `businessinvoiceApi.getPaymentSession(sessionID, businessId?)` |
| **Method** | `GET` |
| **Path** | `/payment-collection/session?sessionID={id}` |

---

### 11.18 Check Payment Collection

| | |
|---|---|
| **Function** | `businessinvoiceApi.checkPaymentCollection(collectionID, txHash?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/payment-collection/check?collectionID={id}` |

**Request Body:** `{ tx_hash: string } | null`

---

### 11.19 Check Payment Session

| | |
|---|---|
| **Function** | `businessinvoiceApi.checkPaymentSession(sessionID, txHash?, businessId?)` |
| **Method** | `POST` |
| **Path** | `/payment-collection/session/check?sessionID={id}` |

**Request Body:** `{ tx_hash: string } | null`

---

### 11.20 List Payment Collections

| | |
|---|---|
| **Function** | `businessinvoiceApi.getPaymentCollectionList(businessId?, params?)` |
| **Method** | `GET` |
| **Path** | `/payment-collection/list` |

**Query Parameters:** `page`, `size`, `collection_id`, `reference`, `wallet_id`, `status`

---

### 11.21 Get Payment Collection

| | |
|---|---|
| **Function** | `businessinvoiceApi.getPaymentCollection(collectionID, businessId?)` |
| **Method** | `GET` |
| **Path** | `/payment-collection?collectionID={id}` |

---

### 11.22 Get Collection Assets

| | |
|---|---|
| **Function** | `businessinvoiceApi.getCollectionAssets(collectionID, network?, businessId?)` |
| **Method** | `GET` |
| **Path** | `/payment-collection/assets?collectionID={id}&network={n}` |

---

### 11.23 Get Wallet Payment Collection Info

| | |
|---|---|
| **Function** | `businessinvoiceApi.getWalletPaymentCollectionInfo(params?, businessId?)` |
| **Method** | `GET` |
| **Path** | `/payment-collection/wallet/info` |

**Query Parameters:** `walletID` or `paymail`

**Response:**

```typescript
interface WalletInfoPayload {
  business_info?: {
    business_email?: string;
    business_id?: string;
    business_logo?: string;
    business_name?: string;
    business_url?: string;
    display_name?: string;
  };
  customization?: { display_name?: string; logo_url?: string };
  paymail?: string;
  user_info?: {
    avatar?: string;
    email?: string;
    full_name?: string;
    user_id?: string;
    user_name?: string;
  };
  wallet_id?: string;
}
```

---

### 11.24 Create Wallet Payment Collection Customization

| | |
|---|---|
| **Function** | `businessinvoiceApi.createWalletPaymentCollectionCustomization(walletID, payload, businessId?)` |
| **Method** | `POST` |
| **Path** | `/payment-collection/wallet/customization?walletID={id}` |

**Request Body:** `{ display_name: string; logo_url: string }`

---

### 11.25 Update Wallet Payment Collection Customization

| | |
|---|---|
| **Function** | `businessinvoiceApi.updateWalletPaymentCollectionCustomization(walletID, payload, businessId?)` |
| **Method** | `PATCH` |
| **Path** | `/payment-collection/wallet/customization?walletID={id}` |

---

### 11.26 Get Revenue Graph

| | |
|---|---|
| **Function** | `businessinvoiceApi.getRevenueGraph(businessId?, filters?)` |
| **Method** | `GET` |
| **Path** | `/invoice/revenue` |

**Query Parameters:** `from`, `to`, `currency`, `customerID`, `period` (`weekly | monthly | quarterly | yearly`)

---

### 11.27 Get Customer Balances

| | |
|---|---|
| **Function** | `businessinvoiceApi.getCustomerBalances(businessId?, filters?)` |
| **Method** | `GET` |
| **Path** | `/invoice/customer-balances` |

**Query Parameters:** `from`, `to`, `currency`, `customerID`

---

### 11.28 Get Invoice Customers (legacy alias)

| | |
|---|---|
| **Function** | `businessinvoiceApi.getCustomers(businessId?, pageNumber?, pageSize?)` |
| **Method** | `GET` |
| **Path** | `/invoice/customers` |

> Prefer `businesscustomerApi` (§12) for customer CRUD.

---

## 12. Customers

**Client export:** `businesscustomerApi`

---

### 12.1 List Customers

| | |
|---|---|
| **Function** | `businesscustomerApi.getCustomers(businessId, page?, size?)` |
| **Method** | `GET` |
| **Path** | `/invoice/customers` |

**Response:**

```typescript
{
  customers: CustomerApi[];
  page_meta: PageMeta;
}

interface CustomerApi {
  address_details?: {
    address?: string;
    city?: string;
    country?: string;
    fax_number?: string;
    phone_number?: string;
    pin_code?: string;
    state?: string;
  };
  allow_portal_access?: boolean;
  business_details?: {
    company_name?: string;
    display_name?: string;
    email?: string;
    phone_number?: string;
  };
  contact_persons: ContactPersonApi[];
  created_at: string;
  customer_id: string;
  customer_type: "BUSINESS" | "INDIVIDUAL";
  individual_details?: {
    customer_first_name?: string;
    customer_last_name?: string;
    language?: string;
    salulation?: string;
  };
  payment_details?: {
    amount?: number;
    currency?: string;
    deposit_wallet?: string;
    opening_balance?: string;
    payment_terms?: string;
    place_of_supply?: string;
    more_details?: Record<string, string>;
  };
  tax_payer_info?: {
    gst_treatment?: string;
    pan?: string;
    tds?: string;
    vat_gstin?: string;
  };
  team_id?: string;
  total_invoiced?: number;
  total_outstanding?: number;
}
```

---

### 12.2 Get Customer

| | |
|---|---|
| **Function** | `businesscustomerApi.getCustomer(businessId, customerId)` |
| **Method** | `GET` |
| **Path** | `/invoice/customer?customerID={id}` |

**Response:** `CustomerApi`

---

### 12.3 Create Customer

| | |
|---|---|
| **Function** | `businesscustomerApi.createCustomer(businessId, customerData)` |
| **Method** | `POST` |
| **Path** | `/invoice/customer` |

**Request Body:** `CustomerApi` fields (without `customer_id`)

---

### 12.4 Update Customer

| | |
|---|---|
| **Function** | `businesscustomerApi.updateCustomer(businessId, customerId, customerData)` |
| **Method** | `PUT` |
| **Path** | `/invoice/customer?customerID={id}` |

---

### 12.5 Delete Customer

| | |
|---|---|
| **Function** | `businesscustomerApi.deleteCustomer(businessId, customerId)` |
| **Method** | `DELETE` |
| **Path** | `/invoice/customer?customerID={id}` |

---

## 13. Vendors

**Client export:** `businessvendorApi`

---

### 13.1 List Vendors

| | |
|---|---|
| **Function** | `businessvendorApi.listVendors(businessId, page?, size?)` |
| **Method** | `GET` |
| **Path** | `/vendor/list` |

---

### 13.2 Get Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.getVendor(businessId, vendorId)` |
| **Method** | `GET` |
| **Path** | `/vendor?vendorID={id}` |

---

### 13.3 Create Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.createVendor(businessId, payload)` |
| **Method** | `POST` |
| **Path** | `/vendor` |

**Request Body:** `VendorUpsertPayload`

```typescript
interface VendorUpsertPayload {
  address_details: VendorAddressDetailsPayload;
  contact_persons: VendorContactPersonPayload[];
  email: string;
  payment_details: VendorPaymentDetailsPayload;
  phone_number: string;
  tax_payer_info: VendorTaxPayerInfoPayload;
  vendor_name: string;
  vendor_type: string;
}

interface VendorAddressDetailsPayload {
  address: string;
  city: string;
  country: string;
  fax_number: string;
  phone_number: string;
  pin_code: string;
  state: string;
}

interface VendorContactPersonPayload {
  department: string;
  designation: string;
  email: string;
  first_name: string;
  language: string;
  last_name: string;
  phone_number: string;
  salulation: string;
  work_number: string;
}

interface VendorPaymentDetailsPayload {
  currency: string;
  expense_wallet: string;
  opening_balance: number;
  payment_address: string;
  payment_terms: string;
  place_of_supply: string;
}

interface VendorTaxPayerInfoPayload {
  gst_treatment: string;
  pan: string;
  tds: string;
  vat_gstin: string;
}
```

---

### 13.4 Update Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.updateVendor(businessId, vendorId, payload)` |
| **Method** | `PUT` |
| **Path** | `/vendor?vendorID={id}` |

---

### 13.5 Invite Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.inviteVendor(businessId, vendorId)` |
| **Method** | `POST` |
| **Path** | `/vendor/invite?vendorID={id}` |

**Response:** `{ message: string }`

---

### 13.6 Set Vendor Suspension

| | |
|---|---|
| **Function** | `businessvendorApi.setVendorSuspension(businessId, vendorId, action)` |
| **Method** | `POST` |
| **Path** | `/vendor/suspension?vendorID={id}&action={SUSPEND\|UNSUSPEND}` |

---

### 13.7 Delete Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.deleteVendor(businessId, vendorId)` |
| **Method** | `DELETE` |
| **Path** | `/vendor?vendorID={id}` |

---

### 13.8 Get Vendor Ledger

| | |
|---|---|
| **Function** | `businessvendorApi.getVendorLedger(businessId, vendorId)` |
| **Method** | `GET` |
| **Path** | `/vendor/ledger?vendorID={id}` |

---

### 13.9 Accept Vendor Invitation

| | |
|---|---|
| **Function** | `businessvendorApi.acceptVendor(vendorId, token, businessId?)` |
| **Method** | `POST` |
| **Path** | `/vendor/accept?vendorID={id}&token={token}` |

---

### 13.10 Get Expense Graph

| | |
|---|---|
| **Function** | `businessvendorApi.getExpenseGraph(businessId, filters?)` |
| **Method** | `GET` |
| **Path** | `/vendor/expense/graph` |

**Query Parameters:** `vendorID`, `currency`, `from`, `to`, `period` (`daily | weekly | monthly | quarterly | yearly`)

**Response:** `VendorExpenseGraphResponse`

```typescript
type VendorExpenseGraphResponse = Record<string, {
  data_points: Array<{ currency: string; date: string; total: number }>;
  total_expense: number;
}>;
```

---

### 13.11 Get Expense Summary

| | |
|---|---|
| **Function** | `businessvendorApi.getExpenseSummary(businessId, filters?)` |
| **Method** | `GET` |
| **Path** | `/vendor/expense/summary` |

**Response:** `VendorExpenseSummaryRow[]`

```typescript
interface VendorExpenseSummaryRow {
  vendor_id: string;
  vendor_name: string;
  total_billed: Record<string, number>;   // currency → amount
  total_paid: Record<string, number>;
  total_unpaid: Record<string, number>;
}
```

---

### 13.12 Pay Vendor

| | |
|---|---|
| **Function** | `businessvendorApi.payVendor(businessId, vendorID, payDTO)` |
| **Method** | `POST` |
| **Path** | `/vendor/pay?vendorID={id}` |

**Request Body:**

```typescript
{
  amount?: string;
  amount_in_fiat: number;
  asset_id: string;
  currency: string;
  schedule_at?: string;
  sender_wallet_id: string;
  meta?: PayoutMeta;
}
```

---

## 14. Vendor Bills

**Client export:** `businessbillApi`

---

### 14.1 Create Bill

| | |
|---|---|
| **Function** | `businessbillApi.createBill(businessId, payload)` |
| **Method** | `POST` |
| **Path** | `/vendor/bill` |

**Request Body:** `VendorBillPayload`

```typescript
interface VendorBillPayload {
  additional_charge: Record<string, number>;
  bill_items: VendorBillItemPayload[];
  billing_address: {
    designation_supply: string;
    location: string;
    source_of_supply: string;
    warehouse_location: string;
  };
  billing_details: {
    amount_payble: string;
    bill_date: string;
    billing_number: string;
    due_date: string;
    order_number: string;
    payment_terms: string;
  };
  currency: string;
  discount: number;
  other_details: {
    additional_fields: Record<string, string>;
    attachment: { link: string; name: string };
    lut: string;
    note: string;
  };
  tax_payer_info: {
    gst_treatment: string;
    pan: string;
    tds: string;
    vat_gstin: string;
  };
  tax_rate: number;
  vendor_id: string;
}

interface VendorBillItemPayload {
  account: string;
  cost_per_unit: number;
  cusotmer: string;   // API field spelling
  name: string;
  quantity: number;
  sac_code: string;
  sub_total: number;
  tax_rate: number;
  total: number;
}
```

**Response:** `{ billID: string }`

---

### 14.2 Update Bill

| | |
|---|---|
| **Function** | `businessbillApi.updateBill(businessId, billID, payload)` |
| **Method** | `PUT` |
| **Path** | `/vendor/bill?billID={id}` |

**Response:** `{ message: string }`

---

### 14.3 Get Bill

| | |
|---|---|
| **Function** | `businessbillApi.getBill(businessId, billID)` |
| **Method** | `GET` |
| **Path** | `/vendor/bill?billID={id}` |

---

### 14.4 List Bills

| | |
|---|---|
| **Function** | `businessbillApi.listBills(businessId, params?)` |
| **Method** | `GET` |
| **Path** | `/vendor/bill/list` |

**Query Parameters:** `vendorID`, `page` (default `1`), `size` (default `20`)

---

### 14.5 Review Bill

| | |
|---|---|
| **Function** | `businessbillApi.reviewBill(businessId, billID, action)` |
| **Method** | `POST` |
| **Path** | `/vendor/bill/review?billID={id}&action={APPROVE\|DECLINE}` |

---

### 14.6 Confirm Bill

| | |
|---|---|
| **Function** | `businessbillApi.confirmBill(businessId, billID)` |
| **Method** | `POST` |
| **Path** | `/vendor/bill/confirm?billID={id}` |

---

### 14.7 Pay Bill

| | |
|---|---|
| **Function** | `businessbillApi.payBill(businessId, billID, payDTO)` |
| **Method** | `POST` |
| **Path** | `/vendor/bill/pay?billID={id}` |

**Request Body:**

```typescript
{
  asset_id: string;
  sender_wallet_id: string;
  schedule_at?: string;
  meta?: PayoutMeta;
}
```

**Response:** `{ payout_id: string; txmeta: string }`

---

### 14.8 Map Bill to Payout

| | |
|---|---|
| **Function** | `businessbillApi.mapBillToPayout(businessId, billID, payoutID)` |
| **Method** | `POST` |
| **Path** | `/vendor/bill/payout?billID={id}&payoutID={id}` |

---

### 14.9 Accept Vendor Invitation (bill module alias)

| | |
|---|---|
| **Function** | `businessbillApi.acceptVendorInvitation(businessId, vendorID, token)` |
| **Method** | `POST` |
| **Path** | `/vendor/accept?vendorID={id}&token={token}` |

---

## 15. Payouts

**Client export:** `businesspayoutApi`

### Shared Types

```typescript
type PayoutReferenceType = "BILL" | string;

type PayoutMeta = {
  email?: string;
  name?: string;
  note?: string;
  [key: string]: unknown;
};

type PayoutUpsertPayload = {
  address?: string;
  amount?: string;
  amount_in_fiat?: number;
  asset_id?: string;
  currency?: string;
  destination_wallet?: string;
  email?: string;
  meta?: PayoutMeta;
  paymail?: string;
  scheduled_at?: string;
  wallet_id?: string;
};

type PayoutApiModel = {
  address?: string;
  amount?: unknown;
  amount_in_fiat?: number;
  app_id?: string;
  asset_id?: string;
  asset_name?: string;
  asset_type?: string;
  bill?: PayoutBill;
  chain?: string;
  chain_image_url?: string;
  created_at?: string;
  currency?: string;
  decimals?: number;
  destination_wallet?: string;
  email?: string;
  exchange_rate?: number;
  image_url?: string;
  meta?: PayoutMeta;
  network?: "MAIN" | "TEST" | string;
  paid_at?: string;
  paymail?: string;
  payout_id: string;
  reference?: string;
  reference_type?: PayoutReferenceType;
  scheduled_at?: string;
  status?: string;
  team_id?: string;
  txid?: string;
  user_id?: string;
  vendor?: PayoutVendor;
  wallet_id?: string;
};

type PayoutListResponse = {
  list: PayoutApiModel[];
  page_meta?: PageMeta;
};
```

---

### 15.1 Create Payout

| | |
|---|---|
| **Function** | `businesspayoutApi.createPayout(businessId, payload)` |
| **Method** | `POST` |
| **Path** | `/payout` |

**Response:** `{ payout_id: string }`

---

### 15.2 Update Payout

| | |
|---|---|
| **Function** | `businesspayoutApi.updatePayout(businessId, payoutID, payload)` |
| **Method** | `PUT` |
| **Path** | `/payout?payoutID={id}` |

---

### 15.3 List Payouts

| | |
|---|---|
| **Function** | `businesspayoutApi.listPayouts(businessId, params?)` |
| **Method** | `GET` |
| **Path** | `/payout/list` |

**Query Parameters:** `status`, `reference`, `reference_type`, `page`, `limit`

**Response:** `PayoutListResponse`

---

### 15.4 Trigger Payout

| | |
|---|---|
| **Function** | `businesspayoutApi.triggerPayout(businessId, payoutID)` |
| **Method** | `POST` |
| **Path** | `/payout/trigger?payoutID={id}` |

**Response:** `{ tx_link?: string; txid?: string }`

---

### 15.5 Get Payout

| | |
|---|---|
| **Function** | `businesspayoutApi.getPayout(businessId, payoutID)` |
| **Method** | `GET` |
| **Path** | `/payout?payoutID={id}` |

**Response:** `PayoutApiModel`

---

### 15.6 Confirm Payout

| | |
|---|---|
| **Function** | `businesspayoutApi.confirmPayout(businessId, payoutID, payload)` |
| **Method** | `POST` |
| **Path** | `/payout/confirm?payoutID={id}` |

**Request Body:**

```typescript
{
  emails?: string[];
  cc?: string[];
  bcc?: string[];
  note?: string;
}
```

**Response:** `{ message: string }`

---

## 16. Billing & Subscriptions

**Client export:** `businessbillingApi`

Platform billing, credits, and subscription management (distinct from invoice module).

---

### 16.1 Get Billing Info

| | |
|---|---|
| **Function** | `businessbillingApi.getBillingInfo()` |
| **Method** | `GET` |
| **Path** | `/billing` |

---

### 16.2 Get Credit History

| | |
|---|---|
| **Function** | `businessbillingApi.getBillingHistory(pageNumber?, pageSize?)` |
| **Method** | `GET` |
| **Path** | `/credits/history` |

**Response:** `BillingHistoryResponse`

```typescript
interface BillingHistoryResponse {
  list: BillingHistoryItem[];
  page_meta: PageMeta;
}

interface BillingHistoryItem {
  id: string;
  amount: number;
  business_id: string;
  user_id: string;
  credit_type: "PURCHASED" | "GRANTED" | string;
  reason: "ADMIN_GRANT" | string;
  created_at: string;
  valid_from: string;
  expires_at: string;
  metadata: {
    admin_id?: string;
    app_id?: string;
    team_id?: string;
    route?: string;
    note?: string;
  };
}
```

---

### 16.3 Get Pricing Plans

| | |
|---|---|
| **Function** | `businessbillingApi.getPricingPlans()` |
| **Method** | `GET` |
| **Path** | `/subscription/plans` |

**Response:** `PricingPlan[]`

```typescript
interface PricingPlan {
  business_id: string;
  plan_id: string;
  plan_name: string;
  plan_type: "STANDARD" | "CUSTOM" | "BASIC" | "PREMIUM" | string;
  plan_config: {
    asset: { transfer_credits: Record<string, number> };
    asset21: { create: number; deploy: number; mint: number; redeem: number };
    certificate: { create: number; mint: number };
    credit_allocation: { credits_per_cycle: number; cycle_period: string };
    data_integrity: { credits_per_mb: number };
    event: { create: number; mint: number; redeem: number };
    rate_limit: { burst_size: number; requests_per_second: number };
    stas: { create: number; mint: number; redeem: number };
    wallet: { create: number };
  };
  plan_pricing: {
    billable_amount: number;
    billing_type: "WEEKLY" | "MONTHLY" | string;
    currency: string;
    over_due_days: number;
  };
}
```

---

### 16.4 Get Credit Balance

| | |
|---|---|
| **Function** | `businessbillingApi.getCreditBalance()` |
| **Method** | `GET` |
| **Path** | `/credits/balance` |

**Response:**

```typescript
interface balance {
  plan_balance: number;
  purchased_balance?: number;
}
```

---

### 16.5 Request Plan

| | |
|---|---|
| **Function** | `businessbillingApi.requestPlan(planId)` |
| **Method** | `POST` |
| **Path** | `/subscription/request` |

**Request Body:**

```typescript
{
  plan_id: string;
  auto_pay: boolean;
  provider: "MANUAL";
}
```

---

### 16.6 Get Plan Status

| | |
|---|---|
| **Function** | `businessbillingApi.getPlanStatus()` |
| **Method** | `GET` |
| **Path** | `/subscription/status` |

**Response:** `SubscriptionInfo`

```typescript
interface SubscriptionInfo {
  subscription_id: string;
  business_id: string;
  plan_id: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PENDING_PAYMENT';
  started_at?: string;
  expires_at?: string;
  created_at: string;
}
```

---

### 16.7 Upgrade Plan

| | |
|---|---|
| **Function** | `businessbillingApi.upGradelan(subscriptionID, newplanID)` |
| **Method** | `POST` |
| **Path** | `/subscription/upgrade?subscriptionID={id}&newPlanID={id}` |

---

### 16.8 Cancel Plan

| | |
|---|---|
| **Function** | `businessbillingApi.cancelPlan(subscriptionId)` |
| **Method** | `POST` |
| **Path** | `/subscription/cancel?subscriptionID={id}` |

---

### 16.9 Credits Top-Up

| | |
|---|---|
| **Function** | `businessbillingApi.creditsTopUp(topupData)` |
| **Method** | `POST` |
| **Path** | `/credits/topup` |

**Request Body:**

```typescript
interface TopUpCreditsPayload {
  amount: number;
  provider: 'MANUAL' | 'STRIPE' | 'PAYPAL';
  // business_id / businessID stripped before send
}
```

---

### 16.10 Get Credits Graph

| | |
|---|---|
| **Function** | `businessbillingApi.getGraph(granularity)` |
| **Method** | `GET` |
| **Path** | `/credits/graph?granularity={value}` |

**Response:** `GraphData[]`

```typescript
interface GraphData {
  date: string;
  used: number;
}
```

---

### 16.11 Get Payment Invoice List

| | |
|---|---|
| **Function** | `businessbillingApi.getInvoiceList(page?, size?)` |
| **Method** | `GET` |
| **Path** | `/payment-invoice/list?pageNumber={n}&pageSize={n}` |

**Response:** `invoiceListResponse` (platform billing invoices, not customer invoices)

---

### 16.12 Raise Payment for Invoice

| | |
|---|---|
| **Function** | `businessbillingApi.raisepaymentforinvoice(invoiceId)` |
| **Method** | `POST` |
| **Path** | `/payment-invoice/payment?invoiceID={id}` |

---

### 16.13 Get Payment History

| | |
|---|---|
| **Function** | `businessbillingApi.getPaymentHistory(subscription_id, page?, size?)` |
| **Method** | `GET` |
| **Path** | `/payment-invoice/payment/history?page={n}&size={n}` |

**Response:** `PaymentHistoryResponse`

```typescript
interface PaymentHistoryResponse {
  list: Payment[];
  page_meta: PageMeta;
}

interface Payment {
  payment_id: string;
  business_id: string;
  entity_type: "SUBSCRIPTION" | string;
  entity_id: string;
  provider: "MANUAL" | string;
  provider_reference: string;
  amount: number;
  currency: string;
  status: "CONFIRMED" | "PENDING" | "FAILED" | string;
  meta: { action: string; credits_purchased: number };
  confirmed_at: string;
  created_at: string;
}
```

---

### 16.14 Download Payment Invoice

| | |
|---|---|
| **Function** | `businessbillingApi.downloadInvoice(paymentId)` |
| **Method** | `GET` |
| **Path** | `/business/payment-invoices/{paymentId}` |

---

### 16.15 Get Payment Methods

| | |
|---|---|
| **Function** | `businessbillingApi.getPaymentMethods()` |
| **Method** | `GET` |
| **Path** | `/billing/payment-methods` |

**Response:** `PaymentMethod[]`

```typescript
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  details: {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    name?: string;
  };
  isDefault: boolean;
}
```

---

### 16.16 Add Payment Method

| | |
|---|---|
| **Function** | `businessbillingApi.addPaymentMethod(paymentData)` |
| **Method** | `POST` |
| **Path** | `/billing/payment-methods` |

---

## API Module Summary

| Module | Export | Endpoints |
|--------|--------|-----------|
| Wallet (basic) | `businesswalletApi` | 3 |
| Wallet Assets | `businessotherAssetsApi` | 15 |
| Asset Swap | `businessAssetSwapApi` | 3 |
| Public Assets | `businessassetApi` | 1 |
| Apps | `businessappsApi` | 3 |
| Business/Team | `businessteamApi` | 3 |
| Members | `businessmembersApi` | 7 |
| RBAC | `businessrbacApi` | 6 |
| Blob | `businessblobApi` | 1 |
| Invoices & Collections | `businessinvoiceApi` | 28 |
| Customers | `businesscustomerApi` | 5 |
| Vendors | `businessvendorApi` | 12 |
| Bills | `businessbillApi` | 9 |
| Payouts | `businesspayoutApi` | 6 |
| Billing | `businessbillingApi` | 16 |

**Total: ~117 API methods** across 15 client modules.

---

## Notes

1. **Dual API layer:** `src/services/api.ts` mirrors many endpoints for personal/non-business context. This document covers the **business** layer (`apibusiness.ts`).
2. **`businessId` parameters:** Many functions accept `businessId` but rely on the axios interceptor to inject `X-Neucron-Business-ID` from localStorage when not explicitly passed.
3. **Typed vs `any`:** Invoice create/update, app create, and some billing payloads use `any` in the service layer — types above are inferred from Redux slices and UI components.
4. **Deprecated APIs:** `businessmembersApi.addMember` → use `createInvites`; `team_id` fields → use `business_id`.
