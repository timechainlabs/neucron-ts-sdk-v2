# Neucron Console — UI Flows SOP (SDK & MCP Server Reference)

> **Purpose:** Standard Operating Procedure for turning Neucron Console UI flows into **SDK functions** and **MCP Server tools**. Each flow documents the MCP tool name, tool description (for MCP tool registration), SDK module mapping, and the ordered list of APIs used.
>
> **Audience:** SDK authors, MCP server implementers, and integration engineers.
>
> **Source of truth:** `src/services/api.ts`, `src/services/apibusiness.ts`, route handlers in `src/App.tsx`, and page/component logic.
>
> **Related docs:**
> - Per-endpoint request/response schemas → [`docs/apibusiness-api-reference.md`](./apibusiness-api-reference.md)

---

## Table of Contents

1. [Global Configuration](#1-global-configuration)
2. [MCP Tools Index](#2-mcp-tools-index)
3. [AUTH SETUP](#3-auth-setup)
4. [HOLDINGS](#4-holdings)
5. [DEVELOP](#5-develop)
6. [GET PAID](#6-get-paid)
7. [PAY](#7-pay)
8. [DATA INTEGRITY](#8-data-integrity)
9. [ASSET ISSUANCE](#9-asset-issuance)
10. [SDK Module Map](#10-sdk-module-map)
11. [Appendix — Common Patterns](#11-appendix--common-patterns)

---

## 1. Global Configuration

| Item | Value |
|------|-------|
| **Base URL** | `VITE_API_BASE_URL` (e.g. `https://dev.neucron.io`) |
| **HTTP Clients** | `api` (`src/services/api.ts`) — personal/auth; `apibusiness` (`src/services/apibusiness.ts`) — business-scoped |
| **Auth Header** | `Authorization: <token>` |
| **Platform Header** | `X-Identifier: NEUCRON` |
| **Business Context** | `X-Neucron-Business-ID: <businessId>` (required for business-scoped flows) |
| **WebSocket** | `wss://{host}:443/v1/mpc` (MPC wallet shard), `wss://{host}:443/v1/realtime` (live notifications) |

**MCP tool design rules:**
- One MCP tool maps to one user-facing flow (not one raw API).
- Tools accept high-level parameters (email, businessId, walletId, etc.) and orchestrate the API sequence internally.
- Business-scoped tools must accept `business_id` and inject `X-Neucron-Business-ID`.
- MFA-gated operations may return `{ intent_id, status: "MFA_REQUIRED" }` — expose a follow-up tool or `continue_intent` helper.

---

## 2. MCP Tools Index

| MCP Tool | Domain | Description (for MCP Server) |
|----------|--------|------------------------------|
| `neucron_login` | AUTH SETUP | Authenticate a user via email/password, passkey, or OAuth and return a session token. |
| `neucron_choose_entity` | AUTH SETUP | List available personal and business entities and set the active operating context (business ID). |
| `neucron_create_business` | AUTH SETUP | Register a new business entity with KYB details and return the new `business_id`. |
| `neucron_list_wallets` | HOLDINGS | List all wallets for the authenticated user or selected business. |
| `neucron_create_wallet` | HOLDINGS | Create a new MPC or encrypted wallet and optionally initialize MPC shard via WebSocket. |
| `neucron_get_balances` | HOLDINGS | Fetch asset balances for a wallet across chains/networks. |
| `neucron_get_transaction_history` | HOLDINGS | Paginated wallet transaction history with optional chain/network filters. |
| `neucron_export_transaction_history` | HOLDINGS | Export filtered transaction history to CSV or PDF (client-side generation from history API data). |
| `neucron_get_notification_logs` | HOLDINGS | List notification/activity logs and mark items as read. |
| `neucron_create_app` | DEVELOP | Create a new developer application with name, domain, and branding metadata. |
| `neucron_publish_app` | DEVELOP | Submit an app for review and publish it to the Neucron platform. |
| `neucron_browse_appstore` | DEVELOP | Browse the public app catalog and retrieve app details. |
| `neucron_create_collection_link` | GET PAID | Create a generic (universal) payment collection link for a wallet. |
| `neucron_customer_manage` | GET PAID | Create, update, delete, or invite a customer for invoicing and collections. |
| `neucron_create_invoice` | GET PAID | Create or update an invoice through the multi-step invoice builder. |
| `neucron_manage_invoice_payment_collection` | GET PAID | Create or update the payment collection (supported assets) linked to an invoice. |
| `neucron_get_revenue` | GET PAID | Retrieve revenue analytics and customer balance summaries. |
| `neucron_vendor_manage` | PAY | Create, update, delete, invite, or suspend a vendor. |
| `neucron_manage_bill` | PAY | Create or update a vendor bill with optional document upload. |
| `neucron_pay_bill` | PAY | Pay an approved bill by creating and triggering a payout. |
| `neucron_schedule_payment` | PAY | Schedule a future payout for a bill or vendor. |
| `neucron_create_payout` | PAY | Send funds to email, address, username, paymail, or vendor via payout. |
| `neucron_get_payout_history` | PAY | List and retrieve payout records with status filters. |
| `neucron_get_expenses` | PAY | Retrieve expense summary and graph analytics for vendor spend. |
| `neucron_inscribe_document` | DATA INTEGRITY | Inscribe a file on-chain for immutable proof of existence (`POST /data-integrity/file`). |
| `neucron_inscribe_text` | DATA INTEGRITY | Inscribe plain text on-chain for immutable proof of existence (`POST /data-integrity/text`). |
| `neucron_inscribe_text_array` | DATA INTEGRITY | Inscribe multiple text entries on-chain in one transaction (`POST /data-integrity/text-array`). |
| `neucron_create_security_token` | ASSET ISSUANCE | Register and deploy an Asset21 security token (STAS). |
| `neucron_create_asset21_customer` | ASSET ISSUANCE | Onboard an Asset21 customer (CUSTOMER request + approve). |
| `neucron_security_token_operations` | ASSET ISSUANCE | Mint, burn, blacklist, freeze, pause, resume via Asset21 requests. |

---

## 3. AUTH SETUP

### 3.1 Login

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_login` |
| **SDK Module** | `authApi`, `passkeyApi` |
| **Description** | Authenticate an existing Neucron user. Supports email/password login, WebAuthn passkey sign-in, and OAuth (Google/Microsoft). Returns `{ token, user }` on success. If email verification is pending, returns a redirect flag instead of a token. |
| **UI Route** | `/login` |
| **Component** | `src/components/auth/LoginForm.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/auth/login` | `authApi.login()` | Email + password authentication |
| 2 | `POST` | `/passkey/verifyStart` | `passkeyApi.verifyStart({ email })` | Start WebAuthn passkey assertion (optional path) |
| 3 | `POST` | `/passkey/verifyFinish?requestID=<id>` | `passkeyApi.verifyFinish()` | Complete passkey sign-in with browser credential |
| 4 | `GET` | `/auth/oauth/redirect?type=<google\|microsoft>` | `authApi.oauthRedirect()` | Get OAuth provider redirect URL (optional path) |
| 5 | `POST` | `/auth/oauth/callback?code=<code>&state=<state>` | `authApi.oauthCallback()` | Exchange OAuth code for session token |
| 6 | `GET` | `/auth/user/info` | `authApi.getCurrentUser()` | Refresh user profile after login (app init) |

**Request — Email login:**
```json
{ "email": "user@example.com", "password": "********" }
```

**Response — Success:**
```json
{ "token": "...", "user": { "id": "...", "email": "..." } }
```

---

### 3.2 Choose Entity to Operate

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_choose_entity` |
| **SDK Module** | `teamApi`, `authApi` |
| **Description** | List all businesses/teams the user can operate under and set the active entity context. Selecting **Personal** clears the business header; selecting a business sets `X-Neucron-Business-ID` for all subsequent business-scoped API calls. No dedicated switch API — context is client-managed. |
| **UI Component** | `src/components/dashboard/TeamSwitch.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/auth/user/info` | `authApi.getCurrentUser()` | Load personal profile for "Personal" entity label |
| 2 | `GET` | `/business/list` | `teamApi.getBusinessList()` | List all businesses the user belongs to |
| 3 | `GET` | `/business` | `teamApi.getBusinessDetails(businessId)` | *(Optional)* Load full business details after selection |

**MCP tool output:**
```json
{
  "entities": [
    { "type": "personal", "label": "John Doe" },
    { "type": "business", "business_id": "...", "label": "Acme Corp" }
  ],
  "active_entity": { "type": "business", "business_id": "..." }
}
```

---

### 3.3 Business (Creation)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_business` |
| **SDK Module** | `teamApi` |
| **Description** | Create a new business entity with KYB (Know Your Business) details including legal name, tax IDs, addresses, and business model. Returns `business_id` used for all subsequent business-scoped operations. |
| **UI Routes** | `/signup/business-info` → `/signup/business-details` → `/signup/address` (signup path); `/onboarding/details` (post-login KYB) |
| **Components** | `src/components/auth/NewSignupFlow.tsx`, `src/components/onboarding/KybModuleForm.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/business` | `teamApi.createTeam()` | Create business with full KYB payload |
| 2 | `GET` | `/business/list` | `teamApi.getBusinessList()` | Refresh business list after creation |
| 3 | `POST` | `/business/request-kyb?businessID=<id>&platform=NEUCRON` | `walletApi.requestPlatform()` | *(Optional)* Submit KYB for platform review |
| 4 | `PATCH` | `/business/update?businessID=<id>` | `teamApi.updateBusiness()` | *(Optional)* Update KYB fields after creation |

**Request — Create business:**
```json
{
  "business_name": "Acme Corp",
  "display_name": "Acme",
  "business_type": "private",
  "business_model": "b2b",
  "business_sub_model": "...",
  "business_email": "billing@acme.com",
  "jurisdiction": "IN",
  "gst_number": "...",
  "cin_number": "...",
  "pan_number": "...",
  "business_address": { "address": "...", "city": "...", "country": "...", "pin_code": "...", "status": "active" },
  "gst_address": { "address": "...", "city": "...", "country": "...", "pin_code": "..." }
}
```

**Response:**
```json
{ "business_id": "...", "data": { "business_id": "..." } }
```

---

## 4. HOLDINGS

### 4.1 Wallets

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_list_wallets` / `neucron_create_wallet` |
| **SDK Module** | `walletApi` / `businesswalletApi` |
| **Description** | List existing wallets or create a new wallet (MPC, Encrypted, or BSV). MPC wallets require a follow-up WebSocket handshake (`wss://.../v1/mpc`) for shard initialization via `mpcWalletService.ensureWalletShard()`. |
| **UI Route** | `/wallet/assets` |
| **Component** | `src/components/dashboard/wallet/AssetSection.tsx` |

#### APIs Used (in order)

**List wallets:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/list` | `walletApi.getWallets()` | List all wallets |

**Create wallet:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/wallet/create` | `walletApi.createWallet()` | Create wallet; query: `walletName`, `paymailName`, `walletType` (MPC\|ENCRYPTED), `provider?` |
| 2 | `GET` | `/wallet/list` | `walletApi.getWallets()` | Refresh wallet list after creation |
| 3 | WebSocket | `wss://{host}:443/v1/mpc` | `mpcWalletService` | MPC shard setup (MPC wallets only) |

**Additional wallet management APIs:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 4 | `PUT` | `/wallet/default?walletID=<id>` | `walletApi.setDefaultWallet()` | Set default wallet |
| 5 | `POST` | `/wallet/sync?walletID=<id>&network=<MAIN\|TEST>` | `walletApi.syncAsset()` | Sync wallet state with chain |

---

### 4.2 Balance

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_balances` |
| **SDK Module** | `walletApi`, `otherAssets` |
| **Description** | Retrieve asset balances and ledger positions for a selected wallet. Returns per-asset amounts, fiat values, chain, and network. |
| **UI Route** | `/wallet/assets` |
| **Component** | `src/components/dashboard/wallet/AssetSection.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/list` | `walletApi.getWallets()` | Resolve active wallet |
| 2 | `POST` | `/asset/ledgerlist?pageNumber=<n>&pageSize=<n>&walletID=<id>` | `walletApi.getAssets()` | Paginated asset ledger with balances |
| 3 | `GET` | `/asset/balances?walletID=<id>&network=<MAIN\|TEST>&currency?=<code>` | `otherAssets.getAssetBalances()` | Per-asset balance breakdown |

---

### 4.3 History

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_transaction_history` |
| **SDK Module** | `walletApi` |
| **Description** | Fetch paginated wallet transaction history with optional chain, network, status, and date-range filters. Supports drill-down into individual transaction details. |
| **UI Routes** | `/wallet/transactions`, `/wallet/transactions/:transactionId` |
| **Component** | `src/components/dashboard/wallet/ActivitySection.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/history?walletID=<id>&page=<n>&limit=<n>&chain?=<chain>&network?=<net>` | `walletApi.getTransactionHistory()` | Paginated transaction list |
| 2 | `GET` | `/wallet/transaction?txid=<id>&chain=<chain>&network=<net>&walletID=<id>` | `walletApi.getTransactionDetails()` | Single transaction detail |
| 3 | `GET` | `/wallet/activities` | `walletApi.getActivities()` | Aggregate activity feed |
| 4 | `GET` | `/asset-swap?walletID=<id>&swapID=<id>` | `businessAssetSwapApi.getSwapDetails()` | Swap transaction detail (if applicable) |

---

### 4.4 Export History

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_export_transaction_history` |
| **SDK Module** | `walletApi` (+ client export utility) |
| **Description** | Export filtered transaction history to CSV or PDF. The Console generates files client-side from history API data — no dedicated export endpoint. The MCP tool should fetch history via API, then produce the export file. |
| **UI Route** | `/wallet/transactions` |
| **Component** | `src/components/dashboard/wallet/ActivitySection.tsx` (`downloadCSV`, `downloadPDF`) |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/history?walletID=<id>&page=<n>&limit=<n>` | `walletApi.getTransactionHistory()` | Source data for export (fetch all pages as needed) |

**Export columns (CSV/PDF):** Date, Asset, Direction, Amount, Chain, Status, From, To, Tx ID.

**MCP tool output:** File path or base64-encoded CSV/PDF blob.

---

### 4.5 Logs (Notification History)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_notification_logs` |
| **SDK Module** | `walletApi` |
| **Description** | List system notifications (invites, payout requests, Asset21 approvals, team actions) and mark them as read. Real-time push via WebSocket `wss://.../v1/realtime`. |
| **UI Route** | `/wallet/activity` |
| **Components** | `src/components/dashboard/wallet/NotificationSection.tsx`, `src/components/dashboard/Header.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/notification/all?state=<state>&pageNumber=<n>&pageSize=<n>` | `walletApi.getNotifications()` | Paginated notification list |
| 2 | `POST` | `/notification/read` | `walletApi.markNotificationsAsRead()` | Mark notification IDs as read |
| 3 | WebSocket | `wss://{host}:443/v1/realtime` | `src/lib/rabbitmq.ts` | Live notification push (optional) |

---

## 5. DEVELOP

### 5.1 App Creation

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_app` |
| **SDK Module** | `appsApi` / `businessappsApi`, `blobApi` |
| **Description** | Create a new developer application, configure credentials (app ID, secret, redirect URIs), set permissions/scopes, and upload branding assets (icon, images, video). |
| **UI Routes** | `/develop/:appId/app-info` → `credentials` → `permissions` → `branding` |
| **Component** | `src/components/develop/developTab/DevelopTab.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/app` | `businessappsApi.createApp()` | Create app with name, domain, icon |
| 2 | `GET` | `/app?appID=<id>` | `businessappsApi.getApp()` | Retrieve app details |
| 3 | `PUT` | `/app` | `businessappsApi.updateApp()` | Update app metadata, permissions, branding |
| 4 | `GET` | `/app/secret?appID=<id>` | `businessappsApi.getAppSecret()` | Retrieve API credentials |
| 5 | `POST` | `/blob/image/upload` | `blobApi.uploadImage()` | Upload app icon / branding image |
| 6 | `POST` | `/blob/video/upload` | `blobApi.uploadVideo()` | Upload app preview video |
| 7 | `POST` | `/blob/document/upload` | `blobApi.uploadDocument()` | Upload supporting documents |
| 8 | `POST` | `/auth/email/otp/send` | `authApi.sendEmailOtp()` | Verify publisher email (optional) |
| 9 | `POST` | `/auth/email/otp/confirm` | `authApi.confirmEmailOtp()` | Confirm publisher email OTP |

**Request — Create app:**
```json
{ "app_name": "My Integration", "app_domain": "https://myapp.com", "app_icon": "...", "app_images": [] }
```

---

### 5.2 App Publish

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_publish_app` |
| **SDK Module** | `businessappsApi` |
| **Description** | Submit a configured app for platform review and publish it to make it available in the Neucron app ecosystem. Requires completed app-info, credentials, permissions, and branding steps. |
| **UI Routes** | `/develop/:appId/submission`, `/apps/publish` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/app?appID=<id>` | `businessappsApi.getApp()` | Validate app is complete before publish |
| 2 | `PUT` | `/app` | `businessappsApi.updateApp()` | Final metadata update before submission |
| 3 | `POST` | `/app/publish?appID=<id>` | `businessappsApi.publishApp()` | Submit app for publishing |

**Response:**
```json
{ "message": "App submitted for review" }
```

---

### 5.3 Appstore

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_browse_appstore` |
| **SDK Module** | `appsApi` / `businessappsApi` |
| **Description** | Browse the public Neucron app catalog, view app details, and inspect installed apps. Used to discover and install third-party integrations. |
| **UI Routes** | `/apps`, `/apps/catalog`, `/apps/:id/details` |
| **Components** | `src/components/appss/AppCatalog.tsx`, `src/components/appss/AppDetails.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/app/list` | `businessappsApi.getApps()` | List user's installed apps |
| 2 | `GET` | `/app/public?pageNumber=<n>&pageSize=<n>` | `businessappsApi.getPublishedApps()` | Browse public app catalog |
| 3 | `GET` | `/app?appID=<id>` | `businessappsApi.getApp()` | App detail view |
| 4 | `GET` | `/app/user-list?appID=<id>&pageNumber=<n>&pageSize=<n>` | `businessappsApi.getAppUsers()` | List users connected to an app |

---

## 6. GET PAID

### 6.1 Generic Collection Link

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_collection_link` |
| **SDK Module** | `invoiceApi` / `businessinvoiceApi` |
| **Description** | Create a universal payment collection link for a wallet (not tied to a specific invoice). Supports wallet branding customization (display name, logo). The link allows payers to send crypto to the wallet via a public payment page. |
| **UI Routes** | `/payment-link/create`, `/pay/:paymail` |
| **Components** | `src/pages/payment-link/CreatePaymentLink.tsx`, `src/pages/payment-link/CollectPayment.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/list` | `walletApi.getWallets()` | Select wallet for collection link |
| 2 | `GET` | `/payment-collection/wallet/info?walletID?=<id>` | `invoiceApi.getWalletCollectionInfo()` | Get wallet paymail / collection metadata |
| 3 | `POST` | `/payment-collection/wallet/customization?walletID=<id>` | `invoiceApi.createWalletCustomization()` | Set display name and logo |
| 4 | `PATCH` | `/payment-collection/wallet/customization?walletID=<id>` | `invoiceApi.updateWalletCustomization()` | Update branding |
| 5 | `POST` | `/payment-collection` | `invoiceApi.createPublicPaymentCollection()` | Create collection; body: `{ amount, currency, metadata, wallet_id }` |

**MCP tool output:**
```json
{ "collection_id": "...", "payment_link": "https://console.neucron.io/pay/<paymail>" }
```

---

### 6.2 Customer Addition / Invite

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_customer_manage` |
| **SDK Module** | `customerApi` / `businesscustomerApi` |
| **Description** | Create, update, delete, or invite a customer for invoicing and payment collection. Invite sends an email with an accept/decline link. |
| **UI Route** | `/get-paid/customers` |

#### APIs Used (in order)

**Create customer:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/invoice/customer` | `customerApi.createCustomer()` | Create customer record |
| 2 | `POST` | `/invoice/customer/invite?customerID=<id>` | `customerApi.inviteCustomer()` | Send invite email |

**Update customer:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `PUT` | `/invoice/customer?customerID=<id>` | `customerApi.updateCustomer()` | Update customer details |

**List / get / delete:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/invoice/customers?page=<n>&size=<n>` | `customerApi.getCustomers()` | List customers |
| 2 | `GET` | `/invoice/customer?customerID=<id>` | `customerApi.getCustomer()` | Get single customer |
| 3 | `DELETE` | `/invoice/customer?customerID=<id>` | `customerApi.deleteCustomer()` | Delete customer |

**Invite acceptance (recipient side):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/invoice/customer/accept?customerID=<id>&token=<token>&decision=ACCEPT\|DECLINE` | `customerApi.acceptCustomerInvite()` | Accept or decline invite |

---

### 6.3 Invoice Creation

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_invoice` |
| **SDK Module** | `invoiceApi` / `businessinvoiceApi`, `blobApi` |
| **Description** | Create or update an invoice through a multi-step flow: invoice details → payment options → review & share. Supports line items, customer assignment, attachments, and finalization. |
| **UI Routes** | `/create-invoice/details` → `/create-invoice/payment-options/:invoiceID` → `/create-invoice/review/:invoiceID` |

#### APIs Used (in order)

**Step 1 — Invoice details:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/invoice/customers?page=<n>&size=<n>` | `customerApi.getCustomers()` | Customer picker |
| 2 | `GET` | `/invoice?invoiceID=<id>` | `invoiceApi.getInvoice()` | Load existing invoice (edit mode) |
| 3 | `POST` | `/blob/document/upload` | `blobApi.uploadDocument()` | Upload invoice attachment |
| 4 | `POST` | `/invoice` | `invoiceApi.createInvoice()` | Create invoice |
| 5 | `PUT` | `/invoice?invoiceID=<id>` | `invoiceApi.updateInvoice()` | Update invoice |

**Step 2 — Payment options:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 6 | `GET` | `/invoice?invoiceID=<id>` | `invoiceApi.getInvoice()` | Reload invoice |
| 7 | `GET` | `/invoice/payment-collection?invoiceID=<id>` | `invoiceApi.getPaymentCollections()` | Get linked payment collections |

**Step 3 — Review & share:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 8 | `POST` | `/invoice/share?invoiceID=<id>&sendEmail=<bool>` | `invoiceApi.shareInvoice()` | Share invoice via email |
| 9 | `POST` | `/invoice/finalise?invoiceID=<id>` | `invoiceApi.finaliseInvoice()` | Finalize and issue invoice |

---

### 6.4 Collection Payment Link Creation / Update

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_manage_invoice_payment_collection` |
| **SDK Module** | `invoiceApi` / `businessinvoiceApi` |
| **Description** | Create or update the payment collection linked to an invoice. Defines which crypto assets/networks the customer can pay with. Returns a collection ID and payment URL. |
| **UI Route** | `/create-invoice/payment-options/:invoiceID` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/invoice/payment-collection?invoiceID=<id>` | `invoiceApi.getPaymentCollections()` | Get existing collections for invoice |
| 2 | `POST` | `/invoice/payment-collection?invoiceID=<id>&walletID?=<id>` | `invoiceApi.createPaymentCollection()` | Create collection; body: `supportedAssets[]` |
| 3 | `PUT` | `/invoice/payment-collection?invoiceID=<id>` | `invoiceApi.updatePaymentCollection()` | Update supported assets |
| 4 | `GET` | `/payment-collection?collectionID=<id>` | `invoiceApi.getPaymentCollection()` | Retrieve collection details |
| 5 | `POST` | `/invoice/map-collection?invoiceID=<id>&collectionID=<id>` | `invoiceApi.mapCollectionToInvoice()` | Map collection to invoice |

**Public payment session APIs (payer side):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 6 | `GET` | `/payment-collection/assets?collectionID=<id>&network?=<net>` | `invoiceApi.getCollectionAssets()` | Assets available for payment |
| 7 | `POST` | `/payment-collection/session?collectionID=<id>&assetID=<id>` | `invoiceApi.createPaymentSession()` | Start payment session |
| 8 | `POST` | `/payment-collection/session/check?sessionID=<id>` | `invoiceApi.checkSessionPayment()` | Verify payment received |
| 9 | `POST` | `/payment-collection/check?collectionID=<id>` | `invoiceApi.checkCollectionPayment()` | Verify collection-level payment |

---

### 6.5 Revenue

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_revenue` |
| **SDK Module** | `invoiceApi` / `businessinvoiceApi` |
| **Description** | Retrieve revenue analytics including time-series graphs, customer balance summaries, and period/currency filters. Used for financial reporting in the Get Paid dashboard. |
| **UI Route** | `/get-paid/revenue` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/invoice/revenue?from?=<date>&to?=<date>&currency?=<code>&customerID?=<id>&period?=<period>` | `invoiceApi.getRevenue()` | Revenue graph data |
| 2 | `GET` | `/invoice/customer-balances?customerID?=<id>` | `invoiceApi.getCustomerBalances()` | Outstanding customer balances |

---

## 7. PAY

### 7.1 Vendor Creation / Update

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_vendor_manage` |
| **SDK Module** | `vendorApi` / `businessvendorApi` |
| **Description** | Create, update, delete, invite, or suspend a vendor. Vendors are payees in the Business Pay module — used for bill creation and payouts. |
| **UI Routes** | `/business-pay/vendors`, `/business-pay/vendors/:vendorId/edit` |
| **Component** | `src/components/dashboard/business-pay/EditVendorForm.tsx` |

#### APIs Used (in order)

**Create vendor:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/vendor` | `vendorApi.createVendor()` | Create vendor with full payload |

**Update vendor:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `PUT` | `/vendor?vendorID=<id>` | `vendorApi.updateVendor()` | Update vendor details |

**List / get / delete / invite / suspend:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/vendor/list?page=<n>&size=<n>` | `vendorApi.getVendors()` | List vendors |
| 2 | `GET` | `/vendor?vendorID=<id>` | `vendorApi.getVendor()` | Get vendor detail |
| 3 | `DELETE` | `/vendor?vendorID=<id>` | `vendorApi.deleteVendor()` | Delete vendor |
| 4 | `POST` | `/vendor/invite?vendorID=<id>` | `vendorApi.inviteVendor()` | Send vendor invite |
| 5 | `POST` | `/vendor/suspension?vendorID=<id>&action=SUSPEND\|UNSUSPEND` | `vendorApi.suspendVendor()` | Suspend or unsuspend |
| 6 | `POST` | `/vendor/accept?vendorID=<id>&token=<token>&decision=ACCEPT\|DECLINE` | `vendorApi.acceptVendorInvite()` | Invite acceptance (recipient) |

**Vendor payload shape:** `{ vendor_name, email, phone_number, vendor_type, address_details, contact_persons[], payment_details, tax_payer_info }`

---

### 7.2 Bill Creation / Update

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_manage_bill` |
| **SDK Module** | `billApi` / `businessbillApi`, `blobApi` |
| **Description** | Create or update a vendor bill with line items, tax details, and optional document attachment. Bills go through review → approval → payment lifecycle. |
| **UI Routes** | `/bills/create`, `/bills/:billid/edit` |
| **Component** | `src/components/dashboard/business-pay/CreateBillFormView.tsx` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/vendor/list?page=<n>&size=<n>` | `vendorApi.getVendors()` | Vendor picker |
| 2 | `GET` | `/vendor/bill?billID=<id>` | `billApi.getBill()` | Load bill (edit mode) |
| 3 | `POST` | `/blob/document/upload` | `blobApi.uploadDocument()` | Upload bill document |
| 4 | `POST` | `/vendor/bill` | `billApi.createBill()` | Create bill |
| 5 | `PUT` | `/vendor/bill?billID=<id>` | `billApi.updateBill()` | Update bill |

**Bill review lifecycle APIs:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 6 | `POST` | `/vendor/bill/review?billID=<id>&action=APPROVE\|DECLINE` | `billApi.reviewBill()` | Approve or decline bill |
| 7 | `POST` | `/vendor/bill/confirm?billID=<id>` | `billApi.confirmBill()` | Confirm approved bill |
| 8 | `POST` | `/vendor/bill/paid/external?billID=<id>` | `billApi.markPaidExternal()` | Mark as paid outside platform |

---

### 7.3 Pay Bill

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_pay_bill` |
| **SDK Module** | `payoutApi` / `businesspayoutApi`, `billApi`, `intentApi` |
| **Description** | Pay an approved vendor bill by creating a payout, mapping it to the bill, and triggering execution. May require MFA authorization via intent flow for high-value transfers. |
| **UI Routes** | `/bills/:billid/pay` → `/bills/:billid/confirm-payment` → `/bills/:billid/payment-success` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/vendor/bill?billID=<id>` | `billApi.getBill()` | Load bill details |
| 2 | `POST` | `/payout` | `payoutApi.createPayout()` | Create payout for bill amount |
| 3 | `POST` | `/vendor/bill/payout?billID=<id>&payoutID=<id>` | `billApi.mapBillToPayout()` | Link payout to bill |
| 4 | `POST` | `/payout/trigger?payoutID=<id>` | `payoutApi.triggerPayout()` | Execute payout on-chain |
| 5 | `GET` | `/payout?payoutID=<id>` | `payoutApi.getPayout()` | Verify payout status |
| 6 | `POST` | `/payout/confirm?payoutID=<id>` | `payoutApi.confirmPayout()` | Send payment confirmation email |

**MFA intent APIs (if policy requires):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 7 | `GET` | `/intent/{intentId}` | `intentApi.getIntentState()` | Check MFA requirement |
| 8 | `POST` | `/intent/{intentId}/authorize?type=mfa&method=<method>` | `intentApi.authorizeIntent()` | Complete MFA challenge |

---

### 7.4 Schedule Payment

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_schedule_payment` |
| **SDK Module** | `payoutApi` / `businesspayoutApi`, `vendorApi` |
| **Description** | Schedule a future payout for a vendor bill. Creates a payout with a `scheduled_at` timestamp that executes automatically on the specified date. |
| **UI Routes** | `/bills/:billid/schedule` → `.../payment` → `.../memo` → `.../review` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/vendor/list?page=<n>&size=<n>` | `vendorApi.getVendors()` | Select vendor |
| 2 | `GET` | `/vendor/bill/list` | `billApi.getBills()` | Select bill |
| 3 | `POST` | `/payout` | `payoutApi.createPayout()` | Create payout with `scheduled_at` field |
| 4 | `POST` | `/vendor/bill/payout?billID=<id>&payoutID=<id>` | `billApi.mapBillToPayout()` | Map scheduled payout to bill |

**Payout payload (scheduled):** `{ vendor_id, bill_id, amount, asset_id, wallet_id, scheduled_at: "2026-08-01T00:00:00Z", ... }`

---

### 7.5 Payout to Email / Address / Username / Paymail / Vendor

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_payout` |
| **SDK Module** | `payoutApi` / `businesspayoutApi`, `walletApi`, `intentApi` |
| **Description** | Send funds to a recipient via email, blockchain address, Neucron username, paymail, or registered vendor. Supports direct wallet-to-wallet transfers and standalone payouts. Also covers the Send Money flow from Holdings. |
| **UI Routes** | `/wallet/send-money` (modal), `/business-pay/payout` |
| **Components** | `src/components/dashboard/SendMoney.tsx` |

#### APIs Used (in order)

**Direct asset transfer (Send Money):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/asset/balances?walletID=<id>&network=<net>` | `otherAssets.getAssetBalances()` | Check available balance |
| 2 | `POST` | `/asset/transfer?walletID=<id>` | `walletApi.transferAsset()` | Transfer to address/email/paymail; body: `{ asset_id, transfer_destinations: [{ amount, address?, paymail?, email? }] }` |

**Standalone payout:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/payout` | `payoutApi.createPayout()` | Create payout; destination via `email`, `address`, `paymail`, `vendor_id` |
| 2 | `POST` | `/payout/trigger?payoutID=<id>` | `payoutApi.triggerPayout()` | Execute payout |
| 3 | `PUT` | `/payout?payoutID=<id>` | `payoutApi.updatePayout()` | Update payout before trigger |

**Pay vendor directly:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/vendor/pay?vendorID=<id>` | `vendorApi.payVendor()` | Direct vendor payment |

**MFA intent (high-risk transfers):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 4 | `GET` | `/intent/{intentId}` | `intentApi.getIntentState()` | Check if MFA required |
| 5 | `POST` | `/passkey/verifyStart` | `passkeyApi.verifyStart()` | Passkey MFA (optional) |
| 6 | `POST` | `/passkey/verifyFinish?requestID=<id>` | `passkeyApi.verifyFinish()` | Complete passkey MFA |
| 7 | `POST` | `/intent/{intentId}/authorize?type=mfa&method=<method>` | `intentApi.authorizeIntent()` | Authorize with OTP/password/passkey |

---

### 7.6 Payout History

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_payout_history` |
| **SDK Module** | `payoutApi` / `businesspayoutApi` |
| **Description** | List all payouts with status, amount, recipient, and reference filters. Retrieve individual payout details including on-chain transaction status. |
| **UI Routes** | `/business-pay/payout`, `/business-pay/payout/:payoutid` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/payout/list?status?=<status>&page?=<n>&limit?=<n>` | `payoutApi.listPayouts()` | Paginated payout list |
| 2 | `GET` | `/payout?payoutID=<id>` | `payoutApi.getPayout()` | Single payout detail |
| 3 | `DELETE` | `/payout?payoutID=<id>` | `payoutApi.deletePayout()` | Cancel pending payout |

---

### 7.7 Expenses

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_get_expenses` |
| **SDK Module** | `vendorApi` / `businessvendorApi` |
| **Description** | Retrieve expense analytics including summary totals and time-series spend graphs filtered by vendor, currency, and date range. |
| **UI Route** | `/business-pay/expenses` |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/vendor/expense/summary` | `vendorApi.getExpenseSummary()` | Total expense summary |
| 2 | `GET` | `/vendor/expense/graph?vendorID?=<id>&currency?=<code>&from?=<date>&to?=<date>&period?=<period>` | `vendorApi.getExpenseGraph()` | Expense time-series graph |

---

## 8. DATA INTEGRITY

> **Status:** Implemented. Data Integrity is an app permission scope (`DATAINTEGRITY`) in the Develop module. All flows call the `/v1/data-integrity/*` endpoints directly (no blob upload step).

### 8.1 Inscribe Document (File)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_inscribe_document` |
| **SDK Module** | `dataIntegrityApi.fileUpload()` |
| **Description** | Upload a file and inscribe it on-chain for immutable proof of existence. Requires `data_integrity_file` app permission. |
| **App Permission** | `data_integrity_file` (scope: `DATAINTEGRITY`) |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/data-integrity/file` | `dataIntegrityApi.fileUpload()` | Multipart file upload; query: `walletID?`, `network?` (MAIN/TEST); headers: `X-Neucron-Business-ID`, `X-App-Secret`; response: `{ txID }` |

---

### 8.2 Inscribe Text

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_inscribe_text` |
| **SDK Module** | `dataIntegrityApi.textUpload()` |
| **Description** | Inscribe plain text on-chain for immutable proof of existence. Requires `data_integrity_text` app permission. |
| **App Permission** | `data_integrity_text` (scope: `DATAINTEGRITY`) |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/data-integrity/text` | `dataIntegrityApi.textUpload()` | Body: `text/plain` text; query: `hashed`, `walletID?`, `network?`; response: `{ txID }` |

---

### 8.3 Inscribe Text Array

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_inscribe_text_array` |
| **SDK Module** | `dataIntegrityApi.textArrayUpload()` |
| **Description** | Inscribe multiple text entries on-chain in a single transaction. Requires `data_integrity_text` app permission. |
| **App Permission** | `data_integrity_text` (scope: `DATAINTEGRITY`) |

#### APIs Used (in order)

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/data-integrity/text-array` | `dataIntegrityApi.textArrayUpload()` | Body: `string[]`; query: `walletID?`, `network?`; response: `{ txID }` |

---

## 9. ASSET ISSUANCE

### 9.1 Create Security Token (Register + Deploy)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_security_token` |
| **SDK Module** | `sdk.asset21.register()`, `sdk.asset21.deploy()` |
| **Description** | Register a token definition with Asset21, then deploy the STAS contract on-chain. See `asset21-api.md` § Token Lifecycle. |

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/list` | `sdk.wallet.walletList()` | Resolve issuing wallet (optional) |
| 2 | `POST` | `/asset21/register` | `sdk.asset21.register()` | Register token metadata |
| 3 | `POST` | `/asset21/deploy?assetID=` | `sdk.asset21.deploy()` | Deploy on-chain (default) |

### 9.2 Create Asset21 Customer (Create + Approve)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_create_asset21_customer` |
| **SDK Module** | `sdk.asset21.createRequest()`, `sdk.asset21.updateRequest()` |
| **Description** | Raise a `CUSTOMER` onboarding request and auto-approve it. See `asset21-api.md` § Requests. |

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/asset21/request` | `sdk.asset21.createRequest()` | `state: CUSTOMER` |
| 2 | `PUT` | `/asset21/request` | `sdk.asset21.updateRequest()` | `action: APPROVE` |
| 3 | `GET` | `/asset21/customers` | `sdk.asset21.getCustomers()` | Optional customer list refresh |

### 9.3 Security Token Core Operations

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_security_token_operations` |
| **SDK Module** | `sdk.asset21.createRequest()`, `sdk.asset21.updateRequest()` |
| **Description** | Create and approve Asset21 workflow requests for MINT, BURN (REDEEM), BLACKLIST, FREEZE, PAUSE, RESUME, and undo actions. |

| Action | Asset21 `state` | Required `requestDetails` |
|--------|-----------------|---------------------------|
| `MINT` | `MINT` | `address`, `amount` |
| `BURN` | `REDEEM` | `UtxoId`, `amount` (+ optional `address`) |
| `BLACKLIST` / `UNBLACKLIST` | same | `address` (+ optional `email`) |
| `FREEZE` / `UNFREEZE` | same | `address` (+ optional `email`) |
| `PAUSE` / `RESUME` | same | optional `email` |

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `POST` | `/asset21/request` | `sdk.asset21.createRequest()` | Raise operation request |
| 2 | `PUT` | `/asset21/request` | `sdk.asset21.updateRequest()` | Approve request (default) |
| 3 | `POST` | `/asset21/sync` | `sdk.asset21.syncTransaction()` | Optional post-approval sync |
| 4 | `GET` | `/asset21/address` | `sdk.asset21.getAddressState()` | Optional address state check |

### 9.4 Legacy — Security Token Issuance Flow (deprecated)

| Field | Value |
|-------|-------|
| **MCP Tool** | `neucron_issue_security_token` (SDK only — removed from MCP) |
| **SDK Module** | `walletApi`, `businessAsset21Api`, `intentApi` |
| **Description** | Issue a security token using the Asset21 protocol. Flow: register the asset definition → submit governance approval request → approvers review via notifications → mint token supply on approval. Governed by Asset21 app permissions (`asset21_create`, `asset21_request`, `asset21_deploy`). |
| **UI Components** | `src/components/dashboard/wallet/CreateAssetModal.tsx`, `src/components/dashboard/wallet/Asset21RequestNotificationModal.tsx` |
| **App Permissions** | `asset21_create`, `asset21_config`, `asset21_deploy`, `asset21_request`, `asset21_view` |

#### APIs Used (in order)

**Phase 1 — Register security token:**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 1 | `GET` | `/wallet/list` | `walletApi.getWallets()` | Select issuing wallet |
| 2 | `POST` | `/asset/register` | `walletApi.createAsset()` | Register asset; body: `{ asset_name, asset_type: "SECURITY", total_supply, wallet_id, ... }` |

**Phase 2 — Governance approval (Asset21 request):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 3 | `GET` | `/asset21/request-by-id?requestID=<id>` | `businessAsset21Api.getRequestById()` | Load request details for review |
| 4 | `POST` | `/asset21/request-handle?requestID=<id>&approved=<bool>` | `businessAsset21Api.handleRequest()` | Approve or reject initiation request |
| 5 | `PUT` | `/asset21/request` | `businessAsset21Api.updateRequest()` | Handle update requests; body: `{ action, assetId, requestId }` |

**Phase 3 — Mint token supply (on approval):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 6 | `POST` | `/asset/mint?assetID=<id>` | `walletApi.assetMint()` | Mint registered asset supply |

**MFA intent (if policy requires approval):**

| # | Method | Endpoint | SDK Function | Purpose |
|---|--------|----------|--------------|---------|
| 7 | `GET` | `/intent/{intentId}` | `intentApi.getIntentState()` | Check intent status from `handleRequest` response |
| 8 | `POST` | `/intent/{intentId}/authorize?type=mfa&method=<method>` | `intentApi.authorizeIntent()` | Complete MFA for high-value mint |

**Notification types:** `ASSET21_REQUEST_INITIATION`, `ASSET21_REQUEST` — pushed via `/notification/all` and WebSocket.

**Billing credits (per plan):** `asset21.create`, `asset21.deploy`, `asset21.mint`, `asset21.redeem`

---

## 10. SDK Module Map

| Domain | Personal SDK (`api.ts`) | Business SDK (`apibusiness.ts`) |
|--------|------------------------|--------------------------------|
| Auth & Passkey | `authApi`, `passkeyApi` | — |
| Entity / Business | `teamApi` | `businessteamApi` |
| Wallets & Assets | `walletApi`, `otherAssets`, `assetApi` | `businesswalletApi`, `businessotherAssetsApi`, `businessassetApi` |
| Notifications | `walletApi` (notifications) | — |
| Apps & Develop | `appsApi`, `blobApi` | `businessappsApi`, `businessblobApi` |
| Invoices & Collections | `invoiceApi`, `customerApi` | `businessinvoiceApi`, `businesscustomerApi` |
| Vendors & Bills | `vendorApi`, `billApi` | `businessvendorApi`, `businessbillApi` |
| Payouts | `payoutApi` | `businesspayoutApi` |
| MFA / Intent | `intentApi` | `businessIntentApi`, `businesspolicyApi` |
| Asset21 | — | `businessAsset21Api` |
| Data Integrity | *(planned)* `integrityApi` | *(planned)* `businessIntegrityApi` |

---

## 11. Appendix — Common Patterns

### Response shapes

```json
// Success with message
{ "message": "Operation successful" }

// Success with entity ID
{ "billID": "...", "payout_id": "...", "business_id": "...", "collection_id": "..." }

// Paginated list
{ "data": [...], "total": 100, "page": 1, "size": 20 }

// Error
{ "error": "Description", "message": "User-friendly message" }

// Intent / MFA gate
{ "intent_id": "...", "status": "PENDING|MFA_REQUIRED|APPROVED|DECLINED" }
```

### MCP tool implementation checklist

1. **Auth** — Accept `token` or use stored session; inject `Authorization` header.
2. **Business context** — Accept optional `business_id`; inject `X-Neucron-Business-ID`.
3. **Orchestration** — Chain APIs in the order listed per flow; handle pagination internally.
4. **MFA** — If an API returns `intent_id`, return it to the caller with `status: "MFA_REQUIRED"` and expose MFA completion as a follow-up.
5. **Idempotency** — Use `reference` / `reference_type` fields on payouts where available.
6. **Errors** — Map HTTP 4xx/5xx to structured MCP tool errors with `message` from response body.

### Flow → MCP Tool Quick Reference

| UI Flow | MCP Tool | # APIs |
|---------|----------|--------|
| Login | `neucron_login` | 3–6 |
| Choose entity | `neucron_choose_entity` | 2–3 |
| Business creation | `neucron_create_business` | 1–4 |
| Wallets | `neucron_list_wallets` / `neucron_create_wallet` | 1–5 |
| Balance | `neucron_get_balances` | 3 |
| History | `neucron_get_transaction_history` | 2–4 |
| Export history | `neucron_export_transaction_history` | 1 (+ client export) |
| Notification logs | `neucron_get_notification_logs` | 2 |
| App creation | `neucron_create_app` | 4–9 |
| App publish | `neucron_publish_app` | 3 |
| Appstore | `neucron_browse_appstore` | 4 |
| Collection link | `neucron_create_collection_link` | 5 |
| Customer manage | `neucron_customer_manage` | 3–6 |
| Invoice creation | `neucron_create_invoice` | 7–9 |
| Payment collection | `neucron_manage_invoice_payment_collection` | 5–9 |
| Revenue | `neucron_get_revenue` | 2 |
| Vendor manage | `neucron_vendor_manage` | 3–6 |
| Bill manage | `neucron_manage_bill` | 5–8 |
| Pay bill | `neucron_pay_bill` | 4–8 |
| Schedule payment | `neucron_schedule_payment` | 4 |
| Create payout | `neucron_create_payout` | 2–7 |
| Payout history | `neucron_get_payout_history` | 2–3 |
| Expenses | `neucron_get_expenses` | 2 |
| Inscribe document | `neucron_inscribe_document` | 1 |
| Inscribe text | `neucron_inscribe_text` | 1 |
| Inscribe text array | `neucron_inscribe_text_array` | 1 |
| Security token register + deploy | `neucron_create_security_token` | 2–3 |
| Asset21 customer onboarding | `neucron_create_asset21_customer` | 2–3 |
| Asset21 core operations | `neucron_security_token_operations` | 2–4 |

---

*Document scoped for SDK & MCP Server implementation. Last updated: July 2026.*
